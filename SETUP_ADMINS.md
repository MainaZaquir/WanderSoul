# Quick Admin Setup Guide

## Option 1: Quick SQL Script (Recommended for Initial Setup)

1. **Sign up** both you and the owner through your auth page (`/auth`)
2. **Open** `supabase/migrations/20251229134500_setup_admins.sql`
3. **Replace** the email addresses with your actual emails:
   ```sql
   UPDATE users 
   SET is_admin = true 
   WHERE email = 'your-actual-email@example.com';
   
   UPDATE users 
   SET is_admin = true 
   WHERE email = 'owner-actual-email@example.com';
   ```
4. **Run** the script in Supabase Dashboard > SQL Editor
5. **Verify** it worked:
   ```sql
   SELECT email, is_admin FROM users WHERE is_admin = true;
   ```

## Option 2: Via Supabase Dashboard (Visual Method)

1. **Sign up** both users through your auth page
2. Go to **Supabase Dashboard** > **Table Editor** > **users** table
3. Find your user row
4. Click **Edit** on the `is_admin` column
5. Set it to `true` and save
6. Repeat for the owner's account

## Option 3: Using the Database Function (After First Admin is Set)

Once you have at least one admin, you can use the `promote_user_to_admin()` function:

```sql
-- From an admin account, promote another user:
SELECT promote_user_to_admin('new-admin-email@example.com');
```

**Note:** This function is only available after running the admin policies migration.

## What Happens After Setup?

✅ Both you and the owner can:
- Sign in at `/auth`
- Access `/admin` dashboard
- Manage all platform data
- Promote other users to admin (using the function above)

## Troubleshooting

**"No rows updated" error?**
- Make sure both users have signed up first
- Check the email addresses are exactly correct (case-sensitive)
- Verify the users exist: `SELECT email FROM users;`

**Still can't access admin dashboard?**
- Make sure you've run the admin policies migration first
- Sign out and sign back in to refresh your session
- Check browser console for errors

## Future: Adding More Admins

Once you have admin access, you can:
1. Use the admin dashboard to view all users
2. Use the SQL function: `SELECT promote_user_to_admin('email@example.com');`
3. Or manually update: `UPDATE users SET is_admin = true WHERE email = 'email@example.com';`

