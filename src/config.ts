// Public Supabase settings, bundled into the browser JS at build time.
// The publishable (anon) key is meant to be public: access is enforced by the
// Row Level Security policies in supabase/migrations. NEVER put the service_role
// / secret key here.
// Set both to '' to build the site in static demo mode (no sign-in, hardcoded stats).
export const SUPABASE_URL = 'https://zckxkooskmpvxjujobjz.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_8CXt7stb_5PzR_R2xYqSQQ_WVQlCDs7';
