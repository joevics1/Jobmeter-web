import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * profiles.user_type is supposed to be set to 'recruiter' at signup, but
 * that write can silently fail (RecruiterAuthModal logs the error and
 * moves on rather than blocking signup on it) or simply never happen if
 * the account was created through a different flow before later being
 * used to post jobs — /submit itself never checks user_type at all, so
 * someone can post jobs fine and only discover the mismatch when they hit
 * a page that does check it, like Talent Pool.
 *
 * A `companies` row (created via "Add a Company" on /submit) is a much
 * harder signal to end up with by accident, so treat having one as
 * recruiter proof too — and self-heal user_type when that happens, so
 * this doesn't need to fall back to the companies check every time.
 */
export async function isRecruiterAccount(admin: SupabaseClient, userId: string): Promise<boolean> {
  const { data: profile } = await admin
    .from('profiles')
    .select('id, user_type')
    .eq('id', userId)
    .single();

  if (profile?.user_type === 'recruiter') return true;

  const { data: companies } = await admin
    .from('companies')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (companies && companies.length > 0) {
    await admin.from('profiles').update({ user_type: 'recruiter' }).eq('id', userId);
    return true;
  }

  return false;
}
