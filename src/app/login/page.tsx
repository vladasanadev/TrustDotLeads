'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  WalletIcon, 
  ArrowRightIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading, error, handleGoogleCallback } = useAuth()
  const [loginMethod, setLoginMethod] = useState<'wallet' | 'google' | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [showWalletGuide, setShowWalletGuide] = useState(false)

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const googleAuth = urlParams.get('google_auth')
    const userData = urlParams.get('user_data')
    const errorParam = urlParams.get('error')

    if (googleAuth === 'success' && userData) {
      handleGoogleCallback(userData)
      // Clean up URL
      window.history.replaceState({}, document.title, '/login')
    } else if (errorParam) {
      setConnectionError(`Google authentication failed: ${errorParam}`)
    }
  }, [handleGoogleCallback])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleWalletLogin = async () => {
    setLoginMethod('wallet')
    setIsConnecting(true)
    setConnectionError(null)

    try {
      await login('wallet')
      router.push('/dashboard')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      setConnectionError(errorMessage)
      
      // Show wallet guide if Talisman is not installed
      if (errorMessage.includes('No Polkadot extension found')) {
        setShowWalletGuide(true)
      }
    } finally {
      setIsConnecting(false)
      setLoginMethod(null)
    }
  }

  const handleGoogleLogin = async () => {
    setLoginMethod('google')
    setIsConnecting(true)
    setConnectionError(null)

    try {
      // Start real Google OAuth flow
      await login('google')
      // Note: login() will redirect to Google, so we won't reach the lines below
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login with Google'
      setConnectionError(errorMessage)
      setIsConnecting(false)
      setLoginMethod(null)
    }
  }

  const installTalisman = () => {
    window.open('https://talisman.xyz/download', '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-pink-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-pink-600">Polka</span>Leads
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Web3 Lead Generation Platform
          </p>
        </div>
        
        <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose your preferred authentication method
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            
            {/* Error Display */}
            {(error || connectionError) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Authentication Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error || connectionError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Talisman Wallet Login */}
            <div>
              <button
                onClick={handleWalletLogin}
                disabled={isConnecting}
                className={`
                  group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white
                  ${isConnecting && loginMethod === 'wallet' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                  }
                  transition-all duration-200
                `}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isConnecting && loginMethod === 'wallet' ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <WalletIcon className="h-5 w-5" />
                  )}
                </span>
                {isConnecting && loginMethod === 'wallet' 
                  ? 'Connecting to Talisman...' 
                  : 'Connect with Talisman Wallet'
                }
              </button>
              
              <p className="mt-2 text-xs text-gray-500 text-center">
                Secure authentication using your Polkadot wallet
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <div>
              <button
                onClick={handleGoogleLogin}
                disabled={isConnecting}
                className={`
                  group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white
                  ${isConnecting && loginMethod === 'google' 
                    ? 'bg-gray-100 cursor-not-allowed' 
                    : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                  }
                  transition-all duration-200
                `}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isConnecting && loginMethod === 'google' ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                </span>
                {isConnecting && loginMethod === 'google' 
                  ? 'Connecting to Google...' 
                  : 'Continue with Google'
                }
              </button>
              
              <p className="mt-2 text-xs text-gray-500 text-center">
                Sign in with your Google account
              </p>
            </div>

            {/* Wallet Installation Guide */}
            {showWalletGuide && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Talisman Wallet Required
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>You need to install Talisman wallet to use wallet authentication.</p>
                      <div className="mt-4">
                        <button
                          onClick={installTalisman}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Install Talisman
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                What you get with PolkaLeads:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Access to comprehensive Web3 lead generation tools
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Real-time Polkadot and Ethereum wallet analytics
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Cross-chain messaging with Hyperbridge integration
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Advanced CRM features for lead management
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-pink-600 hover:text-pink-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-pink-600 hover:text-pink-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 