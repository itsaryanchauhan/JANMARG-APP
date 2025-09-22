# Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for it to be fully set up

### 2. Get Your Project Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy your Project URL and anon/public key

### 3. Configure Environment

Edit `config/supabase.ts` and update the test environment:

```typescript
export const ENVIRONMENTS = {
  test: {
    SUPABASE_URL: "https://your-actual-project-id.supabase.co", // ← Your URL here
    SUPABASE_ANON_KEY: "your-actual-anon-key", // ← Your key here
    description: "Test environment - use for development and testing",
  },
  // ... production config
};
```

### 4. Set Up Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the entire contents of `supabase-schema.sql`
3. Click "Run" to execute the schema

### 5. Create Test User (Optional)

**Don't use manual SQL INSERT** - Supabase auth.users table doesn't allow direct inserts.

Instead, create a test user through your app:

1. Start your app: `npm start`
2. Go to the signup screen
3. Create an account with:
   - **Email**: `test@example.com`
   - **Password**: `test123456`
   - **Username**: `TestUser`

Or use Supabase's built-in user management:

1. Go to **Authentication → Users** in your Supabase dashboard
2. Click **"Add user"**
3. Enter email and password
4. The user will be created automatically

## 🧪 Test Credentials

After setup, create your first test account through the app:

1. Start the app and go to signup
2. Use any email/password you want
3. Or use these suggested credentials:
   - **Email**: `test@example.com`
   - **Password**: `test123456`
   - **Username**: `TestUser`

**Note**: You cannot pre-create users with SQL in Supabase. All users must be created through the authentication system.

## 🔧 Switching Environments

To switch between test and production:

```typescript
// In config/supabase.ts
export const CURRENT_ENV = "production"; // Change from 'test' to 'production'
```

## 🐛 Troubleshooting

### "Invalid supabaseUrl" Error

- Make sure your SUPABASE_URL is a valid HTTPS URL from Supabase
- Check that it follows the format: `https://xxxxxxxxxxxx.supabase.co`

### "No authenticated user" Error

- This is normal when the app first loads and no user is logged in
- The app should handle this gracefully now

### Database Schema Errors

- Make sure you've run the `supabase-schema.sql` in your Supabase SQL Editor
- Check that all tables were created successfully

### Authentication Not Working

- Verify your anon key is correct
- Make sure RLS policies are enabled (they are in the schema)
- Check Supabase dashboard for any authentication issues

### "null value in column 'id' violates not-null constraint"

- This happens when trying to manually INSERT into `auth.users`
- **Solution**: Create users through the app's signup or Supabase dashboard's user management
- Don't use raw SQL INSERT for creating auth users

## 📱 Testing the App

Once everything is set up:

1. Start the app: `npm start` or `expo start`
2. Try signing up with a new account
3. Try logging in with test credentials
4. Create some reports and test the functionality

The app should now work with full Supabase authentication and database functionality!
