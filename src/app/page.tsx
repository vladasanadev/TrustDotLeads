'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  WalletIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setIsRedirecting(true)
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const quickActions = [
    {
      title: 'Find Web3 Leads',
      description: 'Search Polkadot wallets with BigQuery',
      icon: MagnifyingGlassIcon,
      action: () => router.push('/login?redirect=/search'),
      color: 'bg-blue-500',
      steps: '2 steps'
    },
    {
      title: 'Send Cross-Chain Message',
      description: 'Message leads via Hyperbridge',
      icon: WalletIcon,
      action: () => router.push('/login?redirect=/message'),
      color: 'bg-purple-500',
      steps: '2 steps'
    },
    {
      title: 'View Analytics',
      description: 'Analyze staking & wallet data',
      icon: ChartBarIcon,
      action: () => router.push('/login?redirect=/analytics'),
      color: 'bg-green-500',
      steps: '1 step'
    },
    {
      title: 'Manage Leads',
      description: 'Access your CRM dashboard',
      icon: UserGroupIcon,
      action: () => router.push('/login?redirect=/leads'),
      color: 'bg-pink-500',
      steps: '1 step'
    }
  ]

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-pink-600">Polka</span>Leads
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The fastest way to discover, connect, and convert Web3 wallet holders into customers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => router.push('/search')}
                className="inline-flex items-center px-8 py-3 border border-pink-600 text-base font-medium rounded-md text-pink-600 bg-white hover:bg-pink-50 transition-colors"
              >
                Try Demo
                <SparklesIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start in seconds, not minutes
          </h2>
          <p className="text-lg text-gray-600">
            Jump straight to what matters most
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className="glass-card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {action.steps}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {action.description}
              </p>
              <div className="flex items-center text-pink-600 text-sm font-medium">
                Start now
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for Web3 lead generation
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">BigQuery Integration</h3>
              <p className="text-gray-600">Search millions of Polkadot wallets with advanced filters</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cross-Chain Messaging</h3>
              <p className="text-gray-600">Send messages between Polkadot and Ethereum via Hyperbridge</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Track staking rewards, balances, and conversion metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
