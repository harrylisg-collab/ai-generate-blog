import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (not /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for next-auth session cookie
    const hasSession = request.cookies.has('next-auth.session-token') || 
                       request.cookies.has('__Secure-next-auth.session-token');
    
    if (!hasSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
