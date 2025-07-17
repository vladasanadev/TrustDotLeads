# Google OAuth Setup Guide

## 🔐 Real Google Sign-In Integration

This guide will help you set up **real Google OAuth authentication** for your PolkaLeads CRM application.

## 📋 Prerequisites

1. Google Cloud Console account
2. Your application running on `http://localhost:3003`

## 🚀 Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** and **Google OAuth2 API**

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - **App name**: PolkaLeads CRM
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Add scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
5. Add test users (your email addresses)

### 3. Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Choose **Web application**
4. Configure:
   - **Name**: PolkaLeads CRM
   - **Authorized JavaScript origins**: `http://localhost:3003`
   - **Authorized redirect URIs**: `http://localhost:3003/api/auth/google/callback`
5. Save and copy your **Client ID** and **Client Secret**

### 4. Environment Variables

Create a `.env.local` file in your project root:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

**Replace the placeholder values with your actual Google OAuth credentials.**

### 5. Update Configuration (Optional)

If you want to use different URLs, update the configuration in:
- `src/app/api/auth/google/route.ts`
- `src/app/api/auth/google/callback/route.ts`

## 🧪 Testing the Integration

1. **Start your application**:
   ```bash
   npm run dev
   ```

2. **Navigate to the login page**:
   ```
   http://localhost:3003/login
   ```

3. **Click "Continue with Google"**:
   - You'll be redirected to Google's OAuth page
   - Sign in with your Google account
   - Grant permissions to the app
   - You'll be redirected back to your app and logged in

## 🔧 How It Works

### Authentication Flow

1. **User clicks "Continue with Google"**
2. **Frontend calls** `/api/auth/google?action=login`
3. **API generates Google OAuth URL** and returns it
4. **User is redirected** to Google's OAuth page
5. **User signs in** and grants permissions
6. **Google redirects back** to `/api/auth/google/callback`
7. **Callback exchanges code** for user information
8. **User data is encoded** and passed to frontend
9. **Frontend processes** user data and logs in
10. **User is redirected** to dashboard

### API Endpoints

- **`/api/auth/google`** - Generates Google OAuth URL
- **`/api/auth/google/callback`** - Handles OAuth callback and user data

### Security Features

- **Real Google OAuth** - No simulation or mock data
- **Secure token exchange** - Uses official Google OAuth2 library
- **User data validation** - Validates email and user information
- **Error handling** - Comprehensive error handling for all scenarios

## 🚨 Important Notes

1. **Environment Variables**: Make sure to set your real Google OAuth credentials
2. **HTTPS in Production**: Use HTTPS URLs for production deployment
3. **Domain Verification**: Verify your domain in Google Cloud Console for production
4. **Scopes**: Only requests email and profile information (minimal permissions)

## 🐛 Troubleshooting

### Common Issues

1. **"OAuth client not found"**
   - Check your Client ID and Client Secret
   - Ensure environment variables are set correctly

2. **"Redirect URI mismatch"**
   - Verify the redirect URI in Google Cloud Console
   - Should be: `http://localhost:3003/api/auth/google/callback`

3. **"This app isn't verified"**
   - This is normal for development
   - Click "Advanced" > "Go to PolkaLeads CRM (unsafe)"
   - For production, submit your app for verification

4. **"Access blocked"**
   - Add your email to test users in OAuth consent screen
   - Ensure you're using the correct Google account

## 🎉 Success!

Once configured, your users can:
- Sign in with their real Google accounts
- Access all CRM features
- Have their Google profile information (name, email, avatar) displayed
- Sign out and sign back in seamlessly

The integration is now **production-ready** and uses real Google OAuth authentication! 