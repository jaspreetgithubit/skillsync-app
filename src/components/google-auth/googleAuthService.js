import { supabase } from '../../lib/supabase';

export const DEMO_GOOGLE_ACCOUNTS = [
  {
    name: 'Jaspreet Singh',
    email: 'jaspreetsingh.dev@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'Full Stack Engineer & Team Lead'
  },
  {
    name: 'Saksham Thakur',
    email: 'sk2857thakur@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'AI / Backend Systems Architect'
  },
  {
    name: 'University Student',
    email: 'student.capstone@university.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    role: 'Frontend & UI Specialist'
  }
];

/**
 * Initiates Google OAuth:
 * - If Supabase credentials are configured in .env, starts real Supabase Google OAuth.
 * - Otherwise, returns false to signal that the interactive Google Account Selector modal should open.
 */
export async function initiateGoogleSignIn() {
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) {
        console.warn('Supabase Google OAuth initialization failed:', error.message);
        return { success: false, useFallback: true, error: error.message };
      }
      return { success: true, useFallback: false, data };
    } catch (err) {
      console.warn('Supabase OAuth error:', err);
      return { success: false, useFallback: true, error: err?.message };
    }
  }

  // No Supabase credentials configured yet -> trigger interactive Google Account Selector
  return { success: false, useFallback: true };
}

