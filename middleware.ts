import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'yieldguru-secret-key';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/admin',
];

// Check if the path is public
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath =>
    path === publicPath ||
    path.startsWith('/api/auth/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/images/') ||
    path.startsWith('/fonts/') ||
    path.includes('.') // Static files
  );
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('Middleware: Processing path:', path);

  // Allow public paths
  if (isPublicPath(path)) {
    console.log('Middleware: Public path, allowing access');
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth_token')?.value;
  console.log('Middleware: Auth token present:', !!token);

  // If no token, redirect to login
  if (!token) {
    console.log('Middleware: No auth token, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    console.log('Middleware: Verifying token with JWT_SECRET:', JWT_SECRET.substring(0, 5) + '...');
    // Log the actual JWT_SECRET for debugging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Middleware: Full JWT_SECRET for debugging:', JWT_SECRET);
    }
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    console.log('Middleware: Token verified, payload:', payload);

    // Check if user is trying to access the correct dashboard
    if (path.startsWith('/dashboard/')) {
      const dashboardType = path.split('/')[2]; // Extract dashboard type from URL
      const userRole = payload.role as string;
      console.log('Middleware: Dashboard access check - User role:', userRole, 'Dashboard:', dashboardType);

      // Map role to dashboard type
      const roleMap: Record<string, string> = {
        'Admin': 'admin',
        'Investor': 'investor',
        'Operator': 'operator'
      };

      // If user is trying to access a dashboard they don't have access to
      if (dashboardType !== roleMap[userRole]) {
        console.log('Middleware: Redirecting to correct dashboard:', roleMap[userRole]);
        // Redirect to their correct dashboard
        return NextResponse.redirect(new URL(`/dashboard/${roleMap[userRole]}`, request.url));
      }
    }

    // Token is valid, proceed
    console.log('Middleware: Authentication successful, proceeding');
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    console.error('Middleware: Auth error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
