# KAOS CRM Authentication Setup

## Overview

The KAOS CRM web application uses the **exact same authentication flow** as the iOS app, ensuring consistent user experience and security across both platforms.

## Authentication Flow

### 1. Login Process (matches iOS app)

1. **Email Validation**: 
   - Standard email format validation
   - Same regex pattern as iOS app

2. **Password Validation**:
   - Minimum 6 characters
   - Same requirements as iOS app

3. **Supabase Authentication**:
   - Uses `signInWithPassword()` method
   - Same Supabase project as iOS app
   - Identical error handling patterns

4. **User Profile Verification**:
   - Fetches user profile from `users` table
   - Verifies account is active (`is_active = true`)
   - Checks user role and permissions
   - Updates `last_login_at` timestamp

5. **Session Management**:
   - Automatic session persistence
   - Real-time session monitoring
   - Automatic logout for inactive accounts

### 2. Dashboard Access (protected routes)

- **AuthWrapper Component**: 
  - Wraps all protected pages
  - Verifies active session on every page load
  - Redirects to login if session invalid
  - Matches iOS session verification

- **Role-Based Access**:
  - Admin: Full access to all features
  - Manager: Territory and lead management
  - Sales Rep: Assigned territories only
  - HR: User management features only

### 3. Logout Process

- **Clean Session Termination**:
  - Calls Supabase `signOut()`
  - Clears local session data
  - Redirects to login page
  - Same flow as iOS app

## Setup Instructions

### 1. Environment Variables

Ensure your `.env.local` file contains the same Supabase credentials as your iOS app:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Schema

The authentication relies on the `users` table with the following structure:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'sales_rep', 'hr')),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Test Users

Create test users in your Supabase Auth dashboard:

- `admin@kaos.com` (admin role)
- `manager@kaos.com` (manager role)  
- `sales@kaos.com` (sales_rep role)
- `hr@kaos.com` (hr role)

**Important**: After creating users in Supabase Auth, add corresponding records to the `users` table.

## Security Features

### 1. Session Security
- Automatic token refresh
- Secure session persistence
- Real-time session validation

### 2. Error Handling
- Specific error messages for different failure types
- Rate limiting protection
- Account status verification

### 3. Data Protection
- Role-based data access
- Row Level Security (RLS) policies
- Encrypted session storage

## Testing the Flow

### 1. Login Page (`/`)
- Enter valid email and password
- System validates credentials with Supabase
- User profile verification occurs
- Successful login redirects to dashboard

### 2. Dashboard Access (`/dashboard`)
- AuthWrapper automatically checks session
- Invalid sessions redirect to login
- User profile loaded for role checking
- Logout button available in header

### 3. Session Persistence
- Refresh page should maintain login state
- Browser restart should maintain session (if enabled)
- Session expiry automatically redirects to login

## Common Issues

### 1. "Invalid login credentials"
- User doesn't exist in Supabase Auth
- Password is incorrect
- User exists in Auth but not in `users` table

### 2. "Account deactivated"
- User's `is_active` field is set to `false`
- Check `users` table in Supabase

### 3. "Session verification failed"
- Network connectivity issues
- Supabase project is down
- Environment variables incorrect

## iOS App Compatibility

This web authentication flow is **100% compatible** with the iOS app:

- ✅ Same Supabase project and configuration
- ✅ Same user accounts and passwords
- ✅ Same role-based access control
- ✅ Same session management patterns
- ✅ Same error handling and validation
- ✅ Real-time synchronization of user status changes

Users can seamlessly switch between the iOS app and web app using the same credentials.
