// Public Supabase settings for the browser.
// The publishable (anon) key is meant to be public: access is enforced by the
// Row Level Security policies in supabase/migrations. NEVER put the service_role
// / secret key here.
// Leave empty to run the site in static demo mode (no sign-in, hardcoded stats).
window.JAAS_CONFIG = {
  supabaseUrl: '',  // e.g. https://<project-ref>.supabase.co
  supabaseKey: '',  // publishable key (sb_publishable_...) or legacy anon key
};
