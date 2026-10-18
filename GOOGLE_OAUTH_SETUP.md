# SyncSkills.AI Google sign-in setup

## 1. Configure the frontend environment

In the project root (same folder as `package.json`), create or update `.env` and add:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

Use the Supabase project's URL and **publishable key** (or legacy `anon` key) from Project Settings → API Keys. Do not use `SUPABASE_SECRET_KEY` or a service-role key in the browser.

Keep the existing backend-only variables in `.env` too; do not overwrite them.

## 2. Allow the app URL in Supabase

In Supabase Dashboard → Authentication → URL Configuration:
- Set Site URL to `http://localhost:5173` for local development.
- Add `http://localhost:5173/` to Redirect URLs.
- Add the production URL later when deploying, for example `https://your-real-domain.example/` (replace with your actual domain).

The Google provider's callback URL (the URL ending `/auth/v1/callback`) must remain registered in Google Cloud under **Authorized redirect URIs**.

## 3. Start/restart Vite

Stop the Vite dev server with Ctrl+C and run `npm run dev` again so the `VITE_` variables load.

## 4. Test

Open the app, navigate to Sign In, and click **Continue with Google**. After Google consent, the browser should return to the app and the Supabase session should open the dashboard. Refreshing should retain the session. Sign out should end the Supabase session.

Note: The existing email/password form in this project still contains a simulated flow; this change makes the Google button use real Supabase OAuth. Email/password authentication should be connected separately before relying on it for real accounts.
