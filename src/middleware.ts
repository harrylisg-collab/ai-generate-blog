import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = ['/admin/login', '/api/auth'];
  
  // Check if the route requires authentication
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // If no token and not a public route, redirect to login
    if (!token) {
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
