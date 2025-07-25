# Database Setup Guide

This web application uses the **same Supabase database** as the iOS KAOS CRM app to ensure data consistency and real-time synchronization.

## 🔗 Connection Setup

### 1. Get Your Supabase Credentials

If you already have the iOS app running with Supabase:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your KAOS CRM project
3. Go to **Settings** → **API**
4. Copy your:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOi...`)

### 2. Configure Environment Variables

Update the `.env.local` file with your actual Supabase credentials:

```env
# Replace with your actual Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Replace with your actual Supabase anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: For territory mapping features
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### 3. Database Schema

If you haven't set up the database yet, run the SQL schema in `database/schema.sql`:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/schema.sql`
4. Click **Run** to create all tables and relationships

## 📊 Database Structure

The web app uses the **exact same database schema** as the iOS app:

### Core Tables
- **`users`** - User accounts and authentication (matches iOS User entity)
- **`territories`** - Geographic territory definitions (matches iOS Territory entity)
- **`leads`** - Customer leads and contact information (matches iOS Lead entity)
- **`lead_activities`** - Notes, tasks, and interactions (matches iOS LeadActivity entity)
- **`meetings`** - Scheduled appointments and calls (matches iOS Meeting entity)
- **`promotions`** - Marketing campaigns and offers (matches iOS Promotion entity)

### Data Synchronization

The web app automatically syncs with the iOS app through:

- **Real-time subscriptions** for live updates
- **Shared authentication** using the same user accounts
- **Consistent data validation** with matching business rules
- **Row Level Security** ensuring users only see their assigned data

## 🔐 Authentication

### Same User Accounts

The web app uses the **same user accounts** as the iOS app:

- Users can log in with their existing email/password
- Roles and permissions are preserved (`admin`, `manager`, `sales_rep`, `hr`)
- Session management is handled by Supabase Auth

### Test Accounts

If you need test accounts, the schema includes sample users:
- `admin@kaos.com` (admin role)
- `john.smith@kaos.com` (sales_rep role)
- `jane.doe@kaos.com` (sales_rep role)

*Note: You'll need to set passwords for these accounts in Supabase Auth.*

## 🔄 Real-time Sync

### Automatic Synchronization

Changes made in either the web app or iOS app are automatically synchronized:

- **Lead updates** appear instantly across both platforms
- **Territory changes** sync in real-time
- **Meeting scheduling** updates immediately
- **User activity** is tracked consistently

### Offline Support

The web app includes offline-first patterns:

- Local caching for better performance
- Conflict resolution when coming back online
- Queue-based sync for reliable data integrity

## 🛠️ Development Workflow

### 1. Database First

Always update the database schema first, then update both:
- iOS Core Data models
- Web app TypeScript interfaces

### 2. Business Logic Consistency

The `src/lib/business-logic.ts` file contains shared validation rules that match the iOS app's business logic.

### 3. API Compatibility

All database operations use the same Supabase client libraries, ensuring:
- Consistent data types
- Matching validation rules
- Same error handling patterns

## 📋 Verification Checklist

✅ Supabase project URL and key configured  
✅ Database schema created with all tables  
✅ Row Level Security policies enabled  
✅ Test user accounts created  
✅ Web app can authenticate users  
✅ Real-time subscriptions working  
✅ Data syncs between iOS and web  

## 🆘 Troubleshooting

### Connection Issues
- Verify your Supabase URL and key are correct
- Check that your Supabase project is active
- Ensure environment variables are properly set

### Authentication Problems
- Confirm users exist in Supabase Auth
- Check Row Level Security policies
- Verify user roles are correctly assigned

### Sync Issues
- Check real-time subscriptions are enabled
- Verify database triggers are working
- Ensure both apps use the same table schemas

## 📞 Support

For database-related issues:
1. Check the Supabase Dashboard logs
2. Verify the schema matches between iOS and web
3. Test API calls directly in Supabase
4. Contact the development team with specific error messages
