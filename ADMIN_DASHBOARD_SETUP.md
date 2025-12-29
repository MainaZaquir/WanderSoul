# Admin Dashboard Setup Guide

This document outlines everything you need to get your admin dashboard working.

## Prerequisites

### 1. Database Migration
Run the new migration file to add admin access policies:
```bash
# If using Supabase CLI
supabase migration up

# Or apply the migration manually in Supabase Dashboard:
# SQL Editor > New Query > Paste contents of:
# supabase/migrations/20251229134444_admin_policies.sql
```

### 2. Create an Admin User

You need at least one user with `is_admin = true` in the `users` table.

**Option A: Via Supabase Dashboard (SQL Editor)**
```sql
-- First, sign up a user through your auth page, then run:
UPDATE users 
SET is_admin = true 
WHERE email = 'your-admin-email@example.com';
```

**Option B: Via Supabase Dashboard (Table Editor)**
1. Go to Supabase Dashboard > Table Editor > `users` table
2. Find your user row
3. Edit the `is_admin` column and set it to `true`
4. Save

**Option C: Create Admin User Directly (if you have the user ID)**
```sql
-- Replace 'user-uuid-here' with your actual auth.users ID
UPDATE users 
SET is_admin = true 
WHERE id = 'user-uuid-here';
```

### 3. User Profile Creation

The admin dashboard relies on the `useAuth` hook which fetches the user profile. Make sure:

1. **User profile exists**: When a user signs up, a row should be created in the `users` table
2. **Profile is fetched**: The `useAuth` hook should successfully fetch the profile with `is_admin` field

**If profiles aren't being created automatically**, you may need to:
- Set up a database trigger (recommended) or
- Create profiles server-side via Edge Functions or
- Adjust RLS policies to allow profile creation

## Required Database Policies

The migration file adds these policies:

✅ **Admins can read all users** - For user management table
✅ **Admins can read all trips** - Including inactive trips
✅ **Admins can read all products** - Including inactive products  
✅ **Admins can read all reviews** - Including unapproved reviews
✅ **Admins can update/delete reviews** - For moderation
✅ **Admins can update community posts** - For featuring posts
✅ **Admins can read all order items** - For order management
✅ **Admins can update bookings/orders** - For status management

## How to Access

1. **Sign in** with an account that has `is_admin = true`
2. Navigate to `/admin` route
3. The dashboard will check `profile?.is_admin` and show:
   - "Access Denied" if not admin
   - Full dashboard if admin

## Troubleshooting

### "Access Denied" Message
- ✅ Check that `is_admin = true` in the `users` table for your account
- ✅ Verify your profile is being fetched (check browser console)
- ✅ Ensure you're signed in with the correct account

### "Failed to load dashboard data" Error
- ✅ Run the migration file to add admin policies
- ✅ Check browser console for specific error messages
- ✅ Verify RLS policies are applied in Supabase Dashboard
- ✅ Check that all required tables exist

### Data Not Loading
- ✅ Verify admin policies exist: Supabase Dashboard > Authentication > Policies
- ✅ Check that tables have data (users, trips, products, etc.)
- ✅ Review browser console for API errors

### Profile Not Loading
- ✅ Check `useAuth` hook is working correctly
- ✅ Verify user profile exists in `users` table
- ✅ Check RLS policies allow reading own user data
- ✅ Ensure `fetchProfile` function in `useAuth.ts` is working

## Testing Checklist

- [ ] Migration file applied successfully
- [ ] Admin user created with `is_admin = true`
- [ ] Can sign in with admin account
- [ ] Can access `/admin` route
- [ ] Dashboard loads without errors
- [ ] Stats display correctly
- [ ] Can view users table
- [ ] Can approve/delete reviews
- [ ] Can feature/unfeature community posts

## Next Steps

After setup, you can:
- Manage users, trips, products
- Moderate reviews
- Feature community posts
- View analytics and statistics
- Manage bookings and orders

