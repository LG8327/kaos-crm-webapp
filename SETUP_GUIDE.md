# 🚀 Quick Setup: Connect to Your iOS App Database

The KAOS CRM web app is currently running in **Demo Mode** because Supabase credentials are not configured. Here's how to connect it to your iOS app's database:

## 📋 Setup Steps

### 1. Get Your Supabase Credentials

From your iOS app's Supabase project:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your KAOS CRM project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOi...`)

### 2. Update Environment Variables

Edit the `.env.local` file in your project root:

```bash
# Replace with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cC...your-actual-key

# Development settings
NODE_ENV=development
```

### 3. Restart the Development Server

```bash
npm run dev
```

## ✅ Verification

After setup, you should see:

- ❌ Demo mode banner disappears
- ✅ Can login with your actual iOS app credentials
- ✅ Same user accounts work on both platforms
- ✅ Data syncs between iOS and web in real-time

## 🔧 Demo Mode Features

While in demo mode, you can test with these accounts:

| Email | Role | Description |
|-------|------|-------------|
| `admin@kaos.com` | Admin | Full system access |
| `manager@kaos.com` | Manager | Territory & team management |
| `sales@kaos.com` | Sales Rep | Lead management |
| `hr@kaos.com` | HR | User administration |

**Password**: Any password works in demo mode (minimum 6 characters)

## 🏗️ Database Schema

If you need to set up the database schema, refer to the `database/schema.sql` file which contains the complete table structure that matches your iOS Core Data models.

## 🆘 Troubleshooting

### "Failed to fetch" error
- Check your Supabase URL and key are correct
- Ensure your Supabase project is active
- Verify the project URL doesn't include trailing slashes

### "Invalid login credentials" 
- User doesn't exist in Supabase Auth
- User exists in Auth but not in the `users` table
- Check the database has proper Row Level Security policies

### "Unable to verify user account"
- The `users` table might not exist
- Run the schema from `database/schema.sql`
- Check table permissions in Supabase

## 📞 Need Help?

1. Check the browser console for detailed error messages
2. Verify your Supabase project status in the dashboard
3. Ensure the database schema matches the iOS app structure
4. Test direct API calls in the Supabase dashboard
