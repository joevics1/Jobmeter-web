// 📁 app/api/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      // Check if user has completed onboarding
      const { data: onboarding } = await supabase
        .from('onboarding_data')
        .select('user_id')
        .eq('user_id', user.id)
        .single()

      if (!onboarding) {
        // No onboarding data — send to onboarding (CV required)
        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
      }

      // Onboarding complete — send to jobs
      return NextResponse.redirect(new URL('/jobs', requestUrl.origin))
    }
  }

  // Fallback
  return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
}