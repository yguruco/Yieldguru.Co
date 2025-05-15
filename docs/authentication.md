# User Authentication Documentation

## Overview

The YieldGuru platform implements a comprehensive JWT-based authentication system that manages user sessions and authorizes access to protected resources. The system supports three user roles: Admin, Investor, and Operator, each with specific access permissions and dedicated dashboards.

## Authentication Flow

1. **Registration/Signup**: New users register by providing their name, email, password, and selecting a role (Investor or Operator).
2. **Login**: Registered users authenticate by providing their email and password.
3. **Session Management**: Upon successful authentication, the server issues a JWT token stored in an HTTP-only cookie.
4. **Authorization**: The middleware verifies the JWT token for protected routes and enforces role-based access control.
5. **Logout**: Users can terminate their session, which clears the authentication cookie.

## User Model

The User model is defined in `models/User.ts` and includes the following fields:

| Field     | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| name      | String | User's full name                                 |
| email     | String | User's email address (unique identifier)         |
| password  | String | Hashed password (using bcrypt)                   |
| role      | String | User role: 'Admin', 'Investor', or 'Operator'    |
| status    | String | Account status: 'Active', 'Inactive', or 'Pending' |
| lastLogin | Date   | Timestamp of the user's last login               |

### Password Security

Passwords are securely hashed using bcrypt before storage:

```typescript
// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});
```

Password verification is handled by a dedicated method:

```typescript
// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
```

## Authentication Endpoints

### 1. User Registration

**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "Investor" // or "Operator"
}
```

**Response**: Returns user data and sets the authentication cookie.

### 2. User Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**: Returns user data and sets the authentication cookie.

### 3. Admin Login

**Endpoint**: `POST /api/auth/admin`

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Response**: Returns admin user data and sets the authentication cookie.

### 4. Get Current User

**Endpoint**: `GET /api/auth/me`

**Response**: Returns the currently authenticated user's data.

### 5. Logout

**Endpoint**: `POST /api/auth/logout`

**Response**: Clears the authentication cookie.

## JWT Token Management

JWT tokens are created during login/signup and contain the following payload:

```typescript
const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    role: user.role
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);
```

The token is stored in an HTTP-only cookie:

```typescript
cookieStore.set({
  name: 'auth_token',
  value: token,
  httpOnly: true,
  path: '/',
  secure: false, // Set to true in production with HTTPS
  maxAge: 60 * 60 * 24, // 24 hours
  sameSite: 'lax'
});
```

## Authentication Middleware

The application uses a global middleware (`middleware.ts`) that:

1. Allows access to public paths without authentication
2. Verifies the JWT token for protected routes
3. Enforces role-based access to dashboards
4. Redirects unauthenticated users to the login page

```typescript
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
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Role-based dashboard access control
    if (path.startsWith('/dashboard/')) {
      const dashboardType = path.split('/')[2];
      const userRole = payload.role as string;
      
      // Map role to dashboard type
      const roleMap: Record<string, string> = {
        'Admin': 'admin',
        'Investor': 'investor',
        'Operator': 'operator'
      };

      // Redirect to correct dashboard if needed
      if (dashboardType !== roleMap[userRole]) {
        return NextResponse.redirect(new URL(`/dashboard/${roleMap[userRole]}`, request.url));
      }
    }

    // Token is valid, proceed
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

## Client-Side Authentication

The application uses a React context (`AuthContext`) to manage authentication state on the client side:

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Authentication methods
  const login = async (email, password, isAdmin) => {/* ... */};
  const signup = async (name, email, password, role) => {/* ... */};
  const logout = async () => {/* ... */};

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt with a salt.
2. **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies to prevent JavaScript access.
3. **Token Expiration**: Tokens expire after 24 hours, requiring re-authentication.
4. **Role-Based Access Control**: Users can only access resources appropriate for their role.

## Best Practices for Production

1. Store JWT_SECRET in environment variables
2. Enable HTTPS and set `secure: true` for cookies
3. Implement rate limiting for authentication endpoints
4. Add CSRF protection
5. Consider implementing refresh tokens for longer sessions
6. Add multi-factor authentication for sensitive operations
