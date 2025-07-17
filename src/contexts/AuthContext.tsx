'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthState, AuthUser, WalletAccount, WalletConnectionState } from '@/types'

interface AuthContextType extends AuthState {
  login: (method: 'wallet' | 'google', data?: unknown) => Promise<void>
  logout: () => void
  connectWallet: () => Promise<WalletAccount[]>
  handleGoogleCallback: (userData: string) => void
  walletState: WalletConnectionState
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  const [walletState, setWalletState] = useState<WalletConnectionState>({
    isConnected: false,
    isConnecting: false,
    accounts: [],
    selectedAccount: null,
    error: null
  })

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        const user: AuthUser = JSON.parse(savedUser)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })

        // If user logged in with wallet, restore wallet connection state
        if (user.authMethod === 'wallet' && user.walletAddress) {
          setWalletState({
            isConnected: true,
            isConnecting: false,
            accounts: [{
              address: user.walletAddress,
              meta: {
                name: user.name,
                source: 'talisman'
              }
            }],
            selectedAccount: {
              address: user.walletAddress,
              meta: {
                name: user.name,
                source: 'talisman'
              }
            },
            error: null
          })
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setAuthState(prev => ({ ...prev, isLoading: false, error: 'Failed to check authentication status' }))
    }
  }

  const connectWallet = async () => {
    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }))
    
    try {
      // Check if Talisman is installed
      const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp')
      
      const extensions = await web3Enable('PolkaLeads CRM')
      
      if (extensions.length === 0) {
        throw new Error('No Polkadot extension found. Please install Talisman wallet.')
      }

      const accounts = await web3Accounts()
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your Talisman wallet.')
      }

      const walletAccounts: WalletAccount[] = accounts.map(account => ({
        address: account.address,
        meta: {
          name: account.meta.name || 'Unknown Account',
          source: account.meta.source
        },
        type: account.type
      }))

      setWalletState({
        isConnected: true,
        isConnecting: false,
        accounts: walletAccounts,
        selectedAccount: walletAccounts[0],
        error: null
      })

      return walletAccounts
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage
      }))
      throw error
    }
  }

  const login = async (method: 'wallet' | 'google', _data?: unknown) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      if (method === 'wallet') {
        // Wallet authentication
        const accounts = await connectWallet()
        const selectedAccount = accounts[0]
        
        // Create or get user from wallet address
        const user: AuthUser = {
          id: `wallet_${selectedAccount.address}`,
          name: selectedAccount.meta.name || `User ${selectedAccount.address.slice(0, 6)}...`,
          email: `${selectedAccount.address.slice(0, 8)}@wallet.polkaleads.com`,
          walletAddress: selectedAccount.address,
          authMethod: 'wallet',
          role: 'agent',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }

        localStorage.setItem('auth_user', JSON.stringify(user))
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
      } else if (method === 'google') {
        // Real Google OAuth authentication
        try {
          // Get Google OAuth URL from our API
          const response = await fetch('/api/auth/google?action=login')
          const result = await response.json()
          
          if (result.success && result.authUrl) {
            // Redirect to Google OAuth
            window.location.href = result.authUrl
            return
          } else {
            throw new Error(result.error || 'Failed to initialize Google OAuth')
          }
        } catch (error) {
          console.error('Google OAuth initialization error:', error)
          throw new Error('Failed to start Google authentication')
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
    setWalletState({
      isConnected: false,
      isConnecting: false,
      accounts: [],
      selectedAccount: null,
      error: null
    })
  }

  const handleGoogleCallback = (userData: string) => {
    try {
      const user: AuthUser = JSON.parse(Buffer.from(userData, 'base64').toString())
      
      localStorage.setItem('auth_user', JSON.stringify(user))
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Error handling Google callback:', error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to process Google authentication'
      }))
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    connectWallet,
    handleGoogleCallback,
    walletState
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 