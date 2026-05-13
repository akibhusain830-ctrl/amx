import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Only verify user session for protected routes to improve performance
  let user = null;
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin') || 
                          request.nextUrl.pathname.startsWith('/profile') ||
                          request.nextUrl.pathname.startsWith('/auth');

  if (isProtectedRoute) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  // Protect Admin routes with RBAC
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      return NextResponse.redirect(url)
    }
    
    // Fallback: grant access if they are the owner or explicitly have the admin role
    const isAdmin = 
      user.user_metadata?.role === 'admin' || 
      user.email === 'akibhusain830@gmail.com' || 
      user.email === 'manasprbordoloi@gmail.com';
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/' // Redirect to home if unauthorized
      return NextResponse.redirect(url)
    }
  }

  // Protect Profile routes
  if (request.nextUrl.pathname.startsWith('/profile')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in users away from auth page
  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (user) {
      const url = request.nextUrl.clone()
      url.pathname = '/profile'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
