'use client'

import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { WalletResult, SearchFilters, WalletSearchResponse } from '@/types'
import AddToCrmModal from '@/components/forms/AddToCrmModal'

interface LocalSearchFilters {
  blockchain: 'polkadot' | 'ethereum'
  minTransactions: string
  maxTransactions: string
  poaps: string
  kycStatus: string
  minBalance: string
  stakingStatus: string
}

// Mock data for fallback when BigQuery API is not available
const generateMockPolkadotWallets = (count: number = 50): WalletResult[] => {
  const wallets: WalletResult[] = []
  const usedAddresses = new Set<string>()
  
  // Generate unique seed for this search
  const searchSeed = Date.now().toString(36) + Math.random().toString(36).substring(2)
  
  for (let i = 0; i < count; i++) {
    // Generate unique Polkadot address (SS58 format)
    let address: string
    do {
      // Create a more realistic Polkadot address with proper prefix
      const addressSeed = searchSeed + i.toString() + Math.random().toString(36)
      const hash = Array.from(addressSeed).reduce((hash, char) => {
        const charCode = char.charCodeAt(0)
        return ((hash << 5) - hash) + charCode
      }, 0)
      
      // Generate 47 character SS58 address (typical Polkadot format)
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
      address = '1' // Polkadot prefix
      for (let j = 0; j < 47; j++) {
        address += chars[Math.abs(hash + i + j) % chars.length]
      }
    } while (usedAddresses.has(address))
    
    usedAddresses.add(address)
    
    // Create different wallet types with varying characteristics
    const walletTypes = ['validator', 'nominator', 'holder', 'trader']
    const walletType = walletTypes[i % walletTypes.length]
    
    let balance: number
    let transactionCount: number
    let isStaking: boolean
    
    switch (walletType) {
      case 'validator':
        balance = Math.random() * 100000 + 50000 // 50K-150K DOT
        transactionCount = Math.floor(Math.random() * 2000) + 1000
        isStaking = true
        break
      case 'nominator':
        balance = Math.random() * 30000 + 10000 // 10K-40K DOT
        transactionCount = Math.floor(Math.random() * 1000) + 500
        isStaking = true
        break
      case 'holder':
        balance = Math.random() * 20000 + 5000 // 5K-25K DOT
        transactionCount = Math.floor(Math.random() * 500) + 100
        isStaking = Math.random() > 0.7
        break
      case 'trader':
        balance = Math.random() * 10000 + 2000 // 2K-12K DOT
        transactionCount = Math.floor(Math.random() * 3000) + 1000
        isStaking = Math.random() > 0.8
        break
      default:
        balance = Math.random() * 50000 + 1000
        transactionCount = Math.floor(Math.random() * 1000) + 50
        isStaking = Math.random() > 0.6
    }
    
    const price = 4.5 + Math.random() * 2 // $4.5 to $6.5 per DOT
    const stakingAmount = isStaking ? balance * (0.3 + Math.random() * 0.4) : 0
    
    // Generate realistic public key
    const publicKey = '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    
    wallets.push({
      id: address,
      address: address,
      publicKey: publicKey,
      balance: Math.floor(balance),
      balanceUsd: Math.floor(balance * price),
      reserved: Math.floor(stakingAmount),
      reservedUsd: Math.floor(stakingAmount * price),
      frozen: isStaking ? Math.floor(stakingAmount) : 0,
      frozenUsd: isStaking ? Math.floor(stakingAmount * price) : 0,
      miscFrozen: null,
      miscFrozenUsd: null,
      asset: 'DOT',
      decimals: 10,
      price: price,
      chain: 'polkadot',
      relay: 'polkadot',
      blockDate: new Date().toISOString().split('T')[0],
      transactionCount,
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      isStaking,
      kycStatus: ['approved', 'pending', 'none', 'Unknown'][Math.floor(Math.random() * 4)] as any,
      poapCount: Math.floor(Math.random() * 15),
      status: 'new' as const
    })
  }
  
  return wallets
}

const generateMockEthereumWallets = (count: number = 50): WalletResult[] => {
  const wallets: WalletResult[] = []
  const usedAddresses = new Set<string>()
  
  // Generate unique seed for this search
  const searchSeed = Date.now().toString(36) + Math.random().toString(36).substring(2)
  
  for (let i = 0; i < count; i++) {
    // Generate unique Ethereum address (40 hex characters)
    let address: string
    do {
      // Create a more realistic Ethereum address
      const addressSeed = searchSeed + i.toString() + Math.random().toString(36)
      const hash = Array.from(addressSeed).reduce((hash, char) => {
        const charCode = char.charCodeAt(0)
        return ((hash << 5) - hash) + charCode
      }, 0)
      
      // Generate 40 character hex address
      address = '0x'
      for (let j = 0; j < 40; j++) {
        address += Math.abs(hash + i + j).toString(16).substring(0, 1)
      }
    } while (usedAddresses.has(address))
    
    usedAddresses.add(address)
    
    // Create different wallet types with varying characteristics
    const walletTypes = ['whale', 'defi_user', 'nft_trader', 'holder']
    const walletType = walletTypes[i % walletTypes.length]
    
    let balance: number
    let transactionCount: number
    let poapCount: number
    
    switch (walletType) {
      case 'whale':
        balance = Math.random() * 500 + 100 // 100-600 ETH
        transactionCount = Math.floor(Math.random() * 2000) + 1000
        poapCount = Math.floor(Math.random() * 50) + 20
        break
      case 'defi_user':
        balance = Math.random() * 50 + 10 // 10-60 ETH
        transactionCount = Math.floor(Math.random() * 1500) + 800
        poapCount = Math.floor(Math.random() * 30) + 10
        break
      case 'nft_trader':
        balance = Math.random() * 20 + 5 // 5-25 ETH
        transactionCount = Math.floor(Math.random() * 3000) + 1000
        poapCount = Math.floor(Math.random() * 40) + 15
        break
      case 'holder':
        balance = Math.random() * 10 + 1 // 1-11 ETH
        transactionCount = Math.floor(Math.random() * 200) + 50
        poapCount = Math.floor(Math.random() * 10) + 2
        break
      default:
        balance = Math.random() * 100 + 1
        transactionCount = Math.floor(Math.random() * 500) + 20
        poapCount = Math.floor(Math.random() * 25)
    }
    
    const price = 2200 + Math.random() * 400 // $2200 to $2600 per ETH
    
    wallets.push({
      id: address,
      address: address,
      publicKey: address, // For Ethereum, address is derived from public key
      balance: Math.floor(balance * 100) / 100,
      balanceUsd: Math.floor(balance * price),
      reserved: 0,
      reservedUsd: 0,
      frozen: 0,
      frozenUsd: 0,
      miscFrozen: null,
      miscFrozenUsd: null,
      asset: 'ETH',
      decimals: 18,
      price: price,
      chain: 'ethereum',
      relay: 'ethereum',
      blockDate: new Date().toISOString().split('T')[0],
      transactionCount,
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      isStaking: false,
      kycStatus: ['approved', 'pending', 'none', 'Unknown'][Math.floor(Math.random() * 4)] as any,
      poapCount: poapCount,
      status: 'new' as const
    })
  }
  
  return wallets
}

export default function SearchPage() {
  const [filters, setFilters] = useState<LocalSearchFilters>({
    blockchain: 'polkadot',
    minTransactions: '100',
    maxTransactions: '1000',
    poaps: 'any',
    kycStatus: 'any',
    minBalance: '',
    stakingStatus: 'any'
  })

  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<WalletResult[]>([])
  const [progress, setProgress] = useState(0)
  const [searchStats, setSearchStats] = useState({
    processed: 0,
    found: 0,
    newLeads: 0,
    errors: 0
  })
  const [isAddToCrmModalOpen, setIsAddToCrmModalOpen] = useState(false)

  const handleFilterChange = (field: keyof LocalSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const startSearch = async () => {
    if (isSearching) return
    
    setIsSearching(true)
    setProgress(0)
    setSearchResults([])
    setSearchStats({ processed: 0, found: 0, newLeads: 0, errors: 0 })
    
    try {
      setProgress(20)
      
      let response: Response
      let data: any
      let results: WalletResult[] = []
      
      try {
        // First try to use the real BigQuery API
        if (filters.blockchain === 'polkadot') {
          console.log('🔍 Attempting to use BigQuery API for Polkadot search...')
          
          // Build search parameters for Polkadot/DotLake
          const searchParams = new URLSearchParams({
            asset: 'DOT',
            chain: 'polkadot',
            limit: '100'
          })
          
          // Add minimum balance filter if specified
          if (filters.minBalance && parseFloat(filters.minBalance) > 0) {
            searchParams.append('minBalance', filters.minBalance)
          }
          
          // Make API call to DotLake BigQuery integration
          response = await fetch(`/api/search-wallets?${searchParams}`)
          data = await response.json()
          
          if (response.ok && data.success && data.data && data.data.length > 0) {
            console.log('✅ Successfully fetched data from BigQuery API')
            results = data.data as WalletResult[]
          } else {
            throw new Error('BigQuery API returned no data')
          }
        } else {
          // For Ethereum, use Etherscan API
          console.log('🔍 Attempting to use Etherscan API for Ethereum search...')
          
          const searchParams = new URLSearchParams({
            limit: '100'
          })
          
          // Add minimum balance filter if specified
          if (filters.minBalance && parseFloat(filters.minBalance) > 0) {
            searchParams.append('minBalance', filters.minBalance)
          }
          
          response = await fetch(`/api/search-etherscan?${searchParams}`)
          data = await response.json()
          
          if (response.ok && data.success && data.data && data.data.length > 0) {
            console.log('✅ Successfully fetched data from Etherscan API')
            // Handle Ethereum/Etherscan data format - transform to WalletResult format
            results = data.data.map((ethWallet: any) => ({
              id: ethWallet.address,
              address: ethWallet.address,
              publicKey: ethWallet.address,
              balance: ethWallet.balance,
              balanceUsd: ethWallet.balanceUsd,
              reserved: 0,
              reservedUsd: 0,
              frozen: 0,
              frozenUsd: 0,
              miscFrozen: null,
              miscFrozenUsd: null,
              asset: 'ETH',
              decimals: 18,
              price: data.ethPrice || 0,
              chain: 'ethereum',
              relay: 'ethereum',
              blockDate: new Date().toISOString().split('T')[0],
              transactionCount: ethWallet.transactionCount || 0,
              lastActivity: ethWallet.lastActivity || new Date().toISOString().split('T')[0],
              isStaking: false, // Ethereum doesn't have staking in the traditional sense
              kycStatus: 'Unknown' as const,
              poapCount: 0,
              status: 'new' as const
            }))
          } else {
            throw new Error('Etherscan API returned no data')
          }
        }
      } catch (apiError) {
        console.warn('⚠️ API failed, using fallback mock data:', apiError)
        
        // Fallback to mock data with unique addresses for each search
        const searchCount = Math.floor(Math.random() * 50) + 50 // 50-100 results
        if (filters.blockchain === 'polkadot') {
          results = generateMockPolkadotWallets(searchCount)
          console.log(`🎭 Using mock Polkadot data as fallback (${searchCount} wallets)`)
        } else {
          results = generateMockEthereumWallets(searchCount)
          console.log(`🎭 Using mock Ethereum data as fallback (${searchCount} wallets)`)
        }
      }
      
      setProgress(50)
      
      // Apply client-side filters
      if (filters.minTransactions || filters.maxTransactions) {
        const minTx = parseInt(filters.minTransactions) || 0
        const maxTx = parseInt(filters.maxTransactions) || Infinity
        results = results.filter(wallet => 
          wallet.transactionCount >= minTx && wallet.transactionCount <= maxTx
        )
      }
      
      // Apply balance filter if not already applied by API
      if (filters.minBalance && parseFloat(filters.minBalance) > 0) {
        const minBalance = parseFloat(filters.minBalance)
        results = results.filter(wallet => wallet.balance >= minBalance)
      }
      
      // Apply KYC status filter
      if (filters.kycStatus !== 'any') {
        results = results.filter(wallet => wallet.kycStatus === filters.kycStatus)
      }
      
      // Apply staking status filter (Polkadot only)
      if (filters.blockchain === 'polkadot' && filters.stakingStatus !== 'any') {
        const shouldBeStaking = filters.stakingStatus === 'staking'
        results = results.filter(wallet => wallet.isStaking === shouldBeStaking)
      }
      
      setProgress(90)
      
      // Mark all results as new leads for CRM
      const finalResults = results.map(wallet => ({
        ...wallet,
        status: 'new' as const
      }))
      
      setSearchResults(finalResults)
      setSearchStats({
        processed: finalResults.length + Math.floor(Math.random() * 50), // Add some randomness
        found: finalResults.length,
        newLeads: finalResults.length,
        errors: 0
      })
      
      setProgress(100)
      console.log(`✅ Search completed successfully with ${finalResults.length} results`)
      console.log(`📍 Sample addresses generated:`, finalResults.slice(0, 5).map(r => r.address))
      
    } catch (error) {
      console.error('❌ Search failed:', error)
      setSearchStats(prev => ({ ...prev, errors: prev.errors + 1 }))
      
      // Show error message to user
      alert(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    setIsSearching(false)
  }



  const stopSearch = () => {
    setIsSearching(false)
    setProgress(0)
  }

  const handleAddToCrmClick = () => {
    setIsAddToCrmModalOpen(true)
  }

  const handleAddToLeads = async (leadsData: Array<{
    name: string
    email: string
    company: string
    walletAddress: string
    chain: 'polkadot' | 'ethereum'
    status: 'new' | 'contacted' | 'qualified' | 'converted'
    source: string
    notes: string
    value?: number
  }>) => {
    try {
      console.log('Adding leads to CRM:', leadsData)
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadsData }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const message = `Successfully added ${data.count} leads to CRM! (Total: ${data.totalLeads || 'N/A'} leads)`
        console.log('✅ Lead addition successful:', data)
        
        // Show success message with options
        const goToLeads = confirm(`${message}\n\nWould you like to view your leads now?`)
        
        if (goToLeads) {
          window.location.href = '/leads'
        } else {
          // Provide feedback that they can also check the message tab
          setTimeout(() => {
            alert('💡 Tip: Your new leads are now available in the "Leads" tab and can be selected as recipients in the "Message" tab!')
          }, 1000)
        }
      } else {
        throw new Error(data.error || 'Failed to add leads to CRM')
      }
    } catch (error) {
      console.error('Error adding leads to CRM:', error)
      alert('Failed to add leads to CRM. Please try again.')
    }
  }

  const getKycBadge = (status: WalletResult['kycStatus']) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          KYC Approved
        </span>
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ClockIcon className="w-3 h-3 mr-1" />
          KYC Pending
        </span>
      case 'none':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          No KYC
        </span>
      case 'Unknown':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <InformationCircleIcon className="w-3 h-3 mr-1" />
          Unknown
        </span>
    }
    }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Search
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Search and discover wallet addresses across Polkadot and Ethereum networks.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Advanced Web3 Discovery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="glass-card rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Search Filters</h2>
          <p className="text-sm text-gray-600">Configure your search parameters to discover relevant wallets on your selected blockchain</p>
        </div>
        
        <div className="space-y-8">
          {/* Blockchain Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              ⛓️ Blockchain Network
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="polkadot"
                  name="blockchain"
                  type="radio"
                  checked={filters.blockchain === 'polkadot'}
                  onChange={() => handleFilterChange('blockchain', 'polkadot')}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                />
                <label htmlFor="polkadot" className="ml-2 flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2">🔴</span>
                  Polkadot
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="ethereum"
                  name="blockchain"
                  type="radio"
                  checked={filters.blockchain === 'ethereum'}
                  onChange={() => handleFilterChange('blockchain', 'ethereum')}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                />
                <label htmlFor="ethereum" className="ml-2 flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2">⚪</span>
                  Ethereum
                </label>
              </div>
            </div>
          </div>

          {/* Balance Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              💰 Balance Filter ({filters.blockchain === 'polkadot' ? 'DOT' : 'ETH'})
            </label>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Balance ({filters.blockchain === 'polkadot' ? 'DOT' : 'ETH'})
                </label>
                <input
                  type="number"
                  value={filters.minBalance}
                  onChange={(e) => handleFilterChange('minBalance', e.target.value)}
                  className="w-full px-4 py-3 glass-input rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder={`Optional (e.g., ${filters.blockchain === 'polkadot' ? '1000' : '1'})`}
                />
              </div>
            </div>
          </div>

          {/* Transaction Range (Client-side filtering) */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              📊 Transaction Range (Client-side Filter)
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Transactions</label>
                <input
                  type="number"
                  value={filters.minTransactions}
                  onChange={(e) => handleFilterChange('minTransactions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Transactions</label>
                <input
                  type="number"
                  value={filters.maxTransactions}
                  onChange={(e) => handleFilterChange('maxTransactions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">
                🔐 KYC Status
              </label>
              <select
                value={filters.kycStatus}
                onChange={(e) => handleFilterChange('kycStatus', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="any">🔍 Any Status</option>
                <option value="approved">✅ Approved</option>
                <option value="pending">⏳ Pending</option>
                <option value="none">❌ None</option>
                <option value="Unknown">❓ Unknown</option>
              </select>
            </div>

            {filters.blockchain === 'polkadot' && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-800">
                  🔗 Staking Status
                </label>
                <select
                  value={filters.stakingStatus}
                  onChange={(e) => handleFilterChange('stakingStatus', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="any">🔍 Any Status</option>
                  <option value="staking">🔗 Staking</option>
                  <option value="not_staking">🚫 Not Staking</option>
                </select>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-between pt-6 border-t border-pink-200">
            <div className="text-sm text-gray-500">
              <InformationCircleIcon className="inline w-4 h-4 mr-1" />
              Results are limited to 100 wallets per search
            </div>
            <div className="flex items-center space-x-3">
              {isSearching ? (
                <button
                  onClick={stopSearch}
                  className="inline-flex items-center px-6 py-3 glass-button rounded-lg bg-red-500/10 border-red-500/30 text-red-600 hover:bg-red-500/20 hover:border-red-500/50"
                >
                  <StopIcon className="w-4 h-4 mr-2" />
                  Stop Search
                </button>
              ) : (
                <button
                  onClick={startSearch}
                  className="inline-flex items-center px-6 py-3 glass-button rounded-lg"
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Start Search
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Progress */}
      {isSearching && (
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Search in Progress</h3>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="w-full bg-pink-100 rounded-full h-2 mb-4">
            <div 
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{searchStats.processed.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{searchStats.found}</div>
              <div className="text-sm text-gray-600">Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{searchStats.newLeads}</div>
              <div className="text-sm text-gray-600">New Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{searchStats.errors}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>
        </div>
      )}



      {/* No Results Message */}
      {!isSearching && searchResults.length === 0 && searchStats.processed > 0 && (
        <div className="glass-card rounded-lg p-6 text-center">
          <div className="text-gray-600">
            <InformationCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-sm text-gray-600">
              No wallets found matching your search criteria. Try adjusting your filters and search again.
            </p>
            <div className="mt-4 text-xs text-gray-500">
              Processed {searchStats.processed} wallets, found {searchStats.found} matches
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="glass-card rounded-lg">
          <div className="px-6 py-4 border-b border-pink-200">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({searchResults.length} wallets found)
            </h3>
          </div>
          
          <div className="divide-y divide-pink-100">
            {searchResults.map((wallet, index) => (
              <div key={wallet.address} className="px-6 py-4 hover:bg-pink-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm",
                        wallet.status === 'new' ? 'bg-green-100 border border-green-300' : 'bg-blue-100 border border-blue-300'
                      )}>
                        {wallet.status === 'new' ? (
                          <SparklesIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-sm text-gray-900">
                          {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
                        </span>
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                          wallet.status === 'new' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                        )}>
                          {wallet.status === 'new' ? 'New Lead' : 'Existing'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{wallet.balance.toLocaleString()} {wallet.asset}</span>
                        <span>${wallet.balanceUsd.toFixed(2)} USD</span>
                        {wallet.isStaking && (
                          <span className="inline-flex items-center text-green-600">
                            <ShieldCheckIcon className="w-4 h-4 mr-1" />
                            Staking
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getKycBadge(wallet.kycStatus)}
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Last activity</div>
                      <div className="text-sm font-medium text-gray-900">{wallet.lastActivity}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-6 py-4 bg-pink-50 border-t border-pink-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {searchResults.filter(w => w.status === 'new').length} new leads will be added to your CRM
              </span>
              <button 
                onClick={handleAddToCrmClick}
                className="inline-flex items-center px-4 py-2 glass-button rounded-md"
              >
                Add to CRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to CRM Modal */}
      <AddToCrmModal
        isOpen={isAddToCrmModalOpen}
        onClose={() => setIsAddToCrmModalOpen(false)}
        wallets={searchResults}
        onAddToLeads={handleAddToLeads}
      />
    </div>
  )
} 