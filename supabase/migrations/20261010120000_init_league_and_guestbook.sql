-- JaaS: registered users, drink/ticket logging, team building league, guestbook.
-- Reads are public (the site is public); writes need a logged-in user and only touch their own rows.

-- ============ PROFILES ============
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null unique
              check (username ~ '^[a-z0-9][a-z0-9_-]{2,23}$'),
  created_at  timestamptz not null default now()
);

-- Create a profile automatically when someone registers.
-- The username comes from signUp({ options: { data: { username } } }).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(new.raw_user_meta_data ->> 'username'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ TEAM BUILDINGS ============
create table public.team_buildings (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 2 and 60),
  emoji       text not null default '🍻' check (char_length(emoji) <= 8),
  days        int  not null default 1 check (days between 1 and 14),
  created_by  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ============ DRINKS ============
create table public.drink_logs (
  id                bigint generated always as identity primary key,
  user_id           uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  team_building_id  bigint references public.team_buildings (id) on delete set null,
  drink_type        text not null
                    check (drink_type in ('rakia','beer','wine','mastika','whisky','water','other')),
  quantity          int  not null default 1 check (quantity between 1 and 20),
  logged_at         timestamptz not null default now()
);
create index drink_logs_user_idx on public.drink_logs (user_id);
create index drink_logs_tb_idx   on public.drink_logs (team_building_id);

-- ============ TICKETS ============
create table public.ticket_logs (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  tickets     int  not null check (tickets between 1 and 100),
  logged_at   timestamptz not null default now()
);
create index ticket_logs_user_idx on public.ticket_logs (user_id);

-- ============ GUESTBOOK ============
create table public.guestbook (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  message     text not null check (char_length(btrim(message)) between 1 and 280),
  created_at  timestamptz not null default now()
);
create index guestbook_created_idx on public.guestbook (created_at desc);

-- ============ ROW LEVEL SECURITY ============
alter table public.profiles       enable row level security;
alter table public.team_buildings enable row level security;
alter table public.drink_logs     enable row level security;
alter table public.ticket_logs    enable row level security;
alter table public.guestbook      enable row level security;

-- Everyone (including logged-out visitors) can read.
create policy "public read" on public.profiles       for select to anon, authenticated using (true);
create policy "public read" on public.team_buildings for select to anon, authenticated using (true);
create policy "public read" on public.drink_logs     for select to anon, authenticated using (true);
create policy "public read" on public.ticket_logs    for select to anon, authenticated using (true);
create policy "public read" on public.guestbook      for select to anon, authenticated using (true);

-- Logged-in users write only their own rows.
create policy "own insert" on public.team_buildings for insert to authenticated with check ((select auth.uid()) = created_by);
create policy "own insert" on public.drink_logs     for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own insert" on public.ticket_logs    for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own insert" on public.guestbook      for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "own delete" on public.team_buildings for delete to authenticated using ((select auth.uid()) = created_by);
create policy "own delete" on public.drink_logs     for delete to authenticated using ((select auth.uid()) = user_id);
create policy "own delete" on public.ticket_logs    for delete to authenticated using ((select auth.uid()) = user_id);
create policy "own delete" on public.guestbook      for delete to authenticated using ((select auth.uid()) = user_id);

-- Profiles are created by the trigger; users may only rename themselves.
create policy "own update" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- ============ STATS VIEWS (what the website reads) ============
-- security_invoker: views respect the RLS policies above instead of running as the owner.

-- League table: drinks per team building.
create view public.league_table with (security_invoker = true) as
select
  tb.id,
  tb.emoji,
  tb.name,
  tb.days,
  coalesce(sum(d.quantity), 0)::int                                 as drinks,
  round(coalesce(sum(d.quantity), 0)::numeric / tb.days, 1)          as per_day,
  count(distinct d.user_id)::int                                     as players
from public.team_buildings tb
left join public.drink_logs d on d.team_building_id = tb.id
group by tb.id;

-- Drink types share (for the possession bar).
create view public.drink_type_stats with (security_invoker = true) as
select drink_type, sum(quantity)::int as drinks
from public.drink_logs
group by drink_type;

-- Per-player stats: drinks, tickets, drinks per ticket processed.
create view public.player_stats with (security_invoker = true) as
select
  p.id,
  p.username,
  coalesce(d.drinks, 0)::int  as drinks,
  coalesce(t.tickets, 0)::int as tickets,
  case when coalesce(t.tickets, 0) = 0 then null
       else round(d.drinks::numeric / t.tickets, 1) end as drinks_per_ticket
from public.profiles p
left join (select user_id, sum(quantity) as drinks  from public.drink_logs  group by user_id) d on d.user_id = p.id
left join (select user_id, sum(tickets)  as tickets from public.ticket_logs group by user_id) t on t.user_id = p.id;

-- Guestbook with usernames.
create view public.guestbook_feed with (security_invoker = true) as
select g.id, g.message, g.created_at, g.user_id, p.username
from public.guestbook g
join public.profiles p on p.id = g.user_id;

grant select on public.league_table, public.drink_type_stats, public.player_stats, public.guestbook_feed
  to anon, authenticated;
