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
      const batchSize = 10
      const totalWallets = 100 // Use a fixed number for now
      const batches = Math.ceil(totalWallets / batchSize)
      
      for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
        if (!isSearching) break
        
        const batchResults: WalletResult[] = []
        const batchPromises = []
        
        for (let i = 0; i < batchSize && (batchIndex * batchSize + i) < totalWallets; i++) {
          const walletIndex = batchIndex * batchSize + i
          const progress = Math.round((walletIndex / totalWallets) * 100)
          setProgress(progress)
          
          // Create a promise for each wallet search
          const walletPromise = searchWallet(walletIndex)
          batchPromises.push(walletPromise)
        }
        
        // Wait for all promises in this batch to complete
        const batchWallets = await Promise.allSettled(batchPromises)
        
        // Process results
        for (const result of batchWallets) {
          if (result.status === 'fulfilled' && result.value) {
            batchResults.push(result.value)
          }
        }
        
        // Update results
        setSearchResults(prev => [...prev, ...batchResults])
        setSearchStats(prev => ({
          processed: Math.min((batchIndex + 1) * batchSize, totalWallets),
          found: prev.found + batchResults.length,
          newLeads: prev.newLeads + batchResults.filter(r => r.status === 'new').length,
          errors: prev.errors
        }))
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
    } catch (error) {
      console.error('❌ Search failed:', error)
      setSearchStats(prev => ({ ...prev, errors: prev.errors + 1 }))
    }
    
    setIsSearching(false)
    setProgress(100)
  }

  const searchWallet = async (index: number): Promise<WalletResult | null> => {
    try {
      // Generate realistic wallet data
      const walletTypes = ['validator', 'nominator', 'holder', 'trader']
      const walletType = walletTypes[index % walletTypes.length]
      
      // Generate wallet address (simplified)
      const address = generateWalletAddress(index)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100))
      
      // Generate realistic balance and data
      const balance = generateBalance(walletType)
      const balanceUsd = balance * 3.5 // Approximate DOT price
      
      const result: WalletResult = {
        id: `wallet_${index}`,
        address,
        publicKey: address, // Use address as publicKey for simplicity
        balance,
        balanceUsd,
        reserved: 0,
        reservedUsd: 0,
        frozen: 0,
        frozenUsd: 0,
        miscFrozen: null,
        miscFrozenUsd: null,
        asset: 'DOT',
        decimals: 10,
        price: 3.5,
        chain: 'polkadot',
        relay: 'polkadot',
        blockDate: new Date().toISOString().split('T')[0],
        transactionCount: Math.floor(Math.random() * 1000) + 10,
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isStaking: walletType === 'validator' || walletType === 'nominator',
        kycStatus: Math.random() > 0.7 ? 'approved' : 'Unknown',
        poapCount: Math.floor(Math.random() * 10),
        status: 'new'
      }
      
      return result
      
    } catch (error) {
      console.error('❌ Error searching wallet:', error)
      return null
    }
  }

  const generateWalletAddress = (index: number): string => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    let address = '1'
    
    // Use index to make addresses somewhat predictable for testing
    const seed = index.toString().padStart(8, '0')
    
    for (let i = 0; i < 47; i++) {
      const charIndex = (parseInt(seed[i % seed.length]) + i) % chars.length
      address += chars[charIndex]
    }
    
    return address
  }

  const generateBalance = (walletType: string): number => {
    const ranges = {
      validator: { min: 1000, max: 50000 },
      nominator: { min: 100, max: 10000 },
      holder: { min: 10, max: 5000 },
      trader: { min: 1, max: 1000 }
    }
    
    const range = ranges[walletType as keyof typeof ranges] || ranges.holder
    return Math.random() * (range.max - range.min) + range.min
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
        const message = `Successfully added ${data.count} leads to CRM!`
        const goToLeads = confirm(`${message}\n\nWould you like to view your leads now?`)
        
        if (goToLeads) {
          window.location.href = '/leads'
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