import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === '/' ||
    path === '/login' ||
    path.startsWith('/login/') ||
    path === '/signup' ||
    path.startsWith('/signup/') ||
    path.startsWith('/api/auth/') ||
    path === '/test-images' ||
    path.startsWith('/images/');

  // Get the token from the cookies
  const token = request.cookies.get('auth-token')?.value;

  // If the path is public, allow the request
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If the path is not public and there's no token, redirect to unified login
  if (!token) {
    return NextResponse.redirect(new URL('/login/unified', request.url));
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
    const { payload } = await jwtVerify(token, secret);

    // Check if the user has the correct role for the dashboard
    if (path.startsWith('/dashboard/')) {
      const dashboardType = path.split('/')[2]; // Extract dashboard type from URL

      const roleMap: Record<string, string> = {
        'admin': 'Admin',
        'investor': 'Investor',
        'operator': 'Operator'
      };

      const requiredRole = roleMap[dashboardType];

      if (requiredRole && payload.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const correctDashboard = Object.entries(roleMap).find(([_, role]) => role === payload.role)?.[0];
        if (correctDashboard) {
          return NextResponse.redirect(new URL(`/dashboard/${correctDashboard}`, request.url));
        }

        // If no matching dashboard, redirect to unified login
        return NextResponse.redirect(new URL('/login/unified', request.url));
      }
    }

    // Allow the request
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to unified login
    return NextResponse.redirect(new URL('/login/unified', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images).*)',
  ],
};
