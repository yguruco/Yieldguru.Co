import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'yieldguru-secret-key';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login/admin',
  '/login/investor',
  '/login/operator',
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
  
  // Allow public paths
  if (isPublicPath(path)) {
    return NextResponse.next();
  }
  
  // Check for auth token
  const token = request.cookies.get('auth_token')?.value;
  
  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login/investor', request.url));
  }
  
  try {
    // Verify the token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    
    // Check if user is trying to access the correct dashboard
    if (path.startsWith('/dashboard/')) {
      const dashboardType = path.split('/')[2]; // Extract dashboard type from URL
      const userRole = payload.role as string;
      
      // Map role to dashboard type
      const roleMap: Record<string, string> = {
        'Admin': 'admin',
        'Investor': 'investor',
        'Operator': 'operator'
      };
      
      // If user is trying to access a dashboard they don't have access to
      if (dashboardType !== roleMap[userRole]) {
        // Redirect to their correct dashboard
        return NextResponse.redirect(new URL(`/dashboard/${roleMap[userRole]}`, request.url));
      }
    }
    
    // Token is valid, proceed
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/login/investor', request.url));
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
