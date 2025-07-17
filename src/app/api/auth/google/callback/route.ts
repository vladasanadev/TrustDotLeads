import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your_secret_here'
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/api/auth/google/callback`

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/login?error=oauth_error`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/login?error=no_code`)
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    })

    const userInfo = await oauth2.userinfo.get()
    const user = userInfo.data

    if (!user.email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/login?error=no_email`)
    }

    // Create user data for our application
    const userData = {
      id: `google_${user.id}`,
      name: user.name || 'Google User',
      email: user.email,
      avatar: user.picture,
      authMethod: 'google',
      role: 'agent',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    // Store user data in a way that the frontend can access it
    // For now, we'll redirect with the user data as query parameters (base64 encoded)
    const userDataEncoded = Buffer.from(JSON.stringify(userData)).toString('base64')
    
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/login?google_auth=success&user_data=${userDataEncoded}`)

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/login?error=callback_error`)
  }
} 