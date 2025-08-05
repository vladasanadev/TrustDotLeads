'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { hyperbridgeClient } from '@/lib/hyperbridge'
import { HyperbridgeMessage } from '@/types'
import {
  PaperAirplaneIcon,
  UserGroupIcon,
  GiftIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  ClockIcon,
  XCircleIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  WalletIcon,
  CpuChipIcon,
  ServerStackIcon,
  SignalIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  BeakerIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface Lead {
  id: string
  name: string
  email: string
  walletAddress: string
  chain: 'polkadot' | 'ethereum'
  status: string
}

export default function MessagePage() {
  const { user, walletState, connectWallet } = useAuth()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [messageType, setMessageType] = useState<'text' | 'nft' | 'token'>('text')
  const [messageContent, setMessageContent] = useState('')
  const [messages, setMessages] = useState<HyperbridgeMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [showHyperbridge, setShowHyperbridge] = useState(false)
  const [fees, setFees] = useState<{ relay: string; protocol: string; total: string } | null>(null)
  const [isCalculatingFees, setIsCalculatingFees] = useState(false)
  // Simplified for marketing messages - always use POST requests
  const ismpMessageType = 'post' // Fixed to POST for marketing messages

  // Add message mode state
  const [messageMode, setMessageMode] = useState<'cross-chain' | 'email'>('cross-chain')

  // Add leads state for real-time sync
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)

  // Add testnet status state
  const [testnetStatus, setTestnetStatus] = useState<{
    polkadot: { connected: boolean; blockNumber?: number; chainName?: string }
    ethereum: { connected: boolean; blockNumber?: number; chainName?: string }
  }>({
    polkadot: { connected: false },
    ethereum: { connected: false }
  })

  // Check if user is connected with wallet
  const isWalletConnected = user?.authMethod === 'wallet' && walletState.isConnected
  const connectedWalletAddress = user?.walletAddress || walletState.selectedAccount?.address

  // Fetch leads from API
  const fetchLeads = async () => {
    setIsLoadingLeads(true)
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      
      if (response.ok && data.success) {
        const apiLeads = data.leads || []
        setLeads(apiLeads)
        console.log(`✅ Message tab loaded ${apiLeads.length} leads from API`)
      }
    } catch (error) {
      console.error('Error fetching leads in message tab:', error)
    } finally {
      setIsLoadingLeads(false)
    }
  }

  // Load leads on component mount
  useEffect(() => {
    fetchLeads()
  }, [])

  // Poll for lead updates every 5 seconds for real-time sync
  useEffect(() => {
    const interval = setInterval(fetchLeads, 5000)
    return () => clearInterval(interval)
  }, [])

  // Load messages from API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/hyperbridge/messages?address=${connectedWalletAddress}&limit=50`)
        const data = await response.json()
        
        if (data.success) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }

    if (connectedWalletAddress) {
      loadMessages()
    }
  }, [connectedWalletAddress])

  // Subscribe to incoming messages
  useEffect(() => {
    if (!isWalletConnected) return

    const setupSubscription = async () => {
      const unsubscribe = await hyperbridgeClient.subscribeToMessages((message) => {
        setMessages(prev => [message, ...prev])
      }, 'polkadot')

      return unsubscribe
    }

    let unsubscribe: (() => void) | undefined

    setupSubscription().then(unsub => {
      unsubscribe = typeof unsub === 'function' ? unsub : undefined
    })

    return () => {
      unsubscribe?.()
    }
  }, [isWalletConnected])

  // Add testnet status check
  useEffect(() => {
    const checkTestnetStatus = async () => {
      try {
        const status = await hyperbridgeClient.getTestnetStatus()
        setTestnetStatus(status)
      } catch (error) {
        console.error('Failed to get testnet status:', error)
      }
    }

    checkTestnetStatus()
    const interval = setInterval(checkTestnetStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Calculate fees when message details change
  useEffect(() => {
    const calculateFees = async () => {
      if (!selectedLead || !messageContent.trim()) {
        setFees(null)
        return
      }

      setIsCalculatingFees(true)
      try {
        const response = await fetch('/api/hyperbridge/fees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceChain: 'polkadot',
            destChain: selectedLead.chain,
            payload: {
              type: messageType,
              content: messageContent
            }
          })
        })

        const data = await response.json()
        if (data.success) {
          setFees(data.fees)
        }
      } catch (error) {
        console.error('Error calculating fees:', error)
      } finally {
        setIsCalculatingFees(false)
      }
    }

    const debounceTimer = setTimeout(calculateFees, 500)
    return () => clearTimeout(debounceTimer)
  }, [selectedLead, messageContent, messageType])

  const handleSendMessage = async () => {
    // Validate inputs for both modes
    if (!selectedLead || !messageContent.trim()) return

    // For cross-chain messages, require wallet connection
    if (messageMode === 'cross-chain' && (!isWalletConnected || !connectedWalletAddress)) return

    setIsSending(true)
    try {
      if (messageMode === 'cross-chain') {
        // Handle cross-chain message
        const requestBody = {
          messageType: ismpMessageType,
          senderAddress: connectedWalletAddress,
          source: {
            chain: 'polkadot',
            address: connectedWalletAddress
          },
          destination: {
            chain: selectedLead!.chain,
            address: selectedLead!.walletAddress
          },
          payload: {
            type: messageType,
            content: messageContent,
            recipient: selectedLead!.name,
            timestamp: new Date().toISOString()
          }
        }

        console.log('🚀 Sending cross-chain message:', requestBody)

        const response = await fetch('/api/hyperbridge/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        const data = await response.json()

        if (response.ok && data.success) {
          console.log('✅ Cross-chain message sent successfully:', data)
          setMessages(prev => [data.message, ...prev])
          setMessageContent('')
          setSelectedLead(null)
          alert('Cross-chain message sent successfully!')
        } else {
          console.error('Failed to send cross-chain message:', data.error)
          alert(`Failed to send cross-chain message: ${data.error}`)
        }
      } else {
        // Handle email message
        console.log('📧 Sending email to:', selectedLead.email)
        console.log('📧 Email content:', messageContent)
        
        // Simulate email sending (in a real app, you'd call an email API)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Create a mock message for display
        const emailMessage = {
          id: `email_${Date.now()}`,
          type: 'email',
          senderAddress: user?.email || 'user@polkaleads.com',
          recipientAddress: selectedLead.email,
          content: messageContent,
          timestamp: new Date().toISOString(),
          status: 'sent'
        }

        setMessages(prev => [emailMessage as any, ...prev])
        setMessageContent('')
        setSelectedLead(null)
        alert('Email sent successfully!')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Failed to send ${messageMode === 'cross-chain' ? 'cross-chain message' : 'email'}. Please try again.`)
    } finally {
      setIsSending(false)
    }
  }

  const updateMessageStatus = async (messageId: string, status: HyperbridgeMessage['status']) => {
    try {
      const response = await fetch('/api/hyperbridge/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_status',
          messageId
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        ))
      }
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  const getStatusIcon = (status: HyperbridgeMessage['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'relayed':
        return <CpuChipIcon className="h-4 w-4 text-blue-500" />
      case 'dispatched':
        return <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: HyperbridgeMessage['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'relayed':
        return 'bg-blue-100 text-blue-800'
      case 'dispatched':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getChainIcon = (chain: 'polkadot' | 'ethereum') => {
    return chain === 'polkadot' ? '🔴' : '⚪'
  }

  const getTypeIcon = (type: HyperbridgeMessage['payload']['type']) => {
    switch (type) {
      case 'nft':
        return <GiftIcon className="h-4 w-4" />
      case 'token':
        return <CurrencyDollarIcon className="h-4 w-4" />
      default:
        return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const formatFee = (fee: string, chain: 'polkadot' | 'ethereum') => {
    const value = BigInt(fee)
    if (chain === 'polkadot') {
      return `${(Number(value) / 1e12).toFixed(4)} DOT`
    } else {
      return `${(Number(value) / 1e18).toFixed(6)} ETH`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Cross-Chain Messaging via XMTP
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Send marketing messages, NFTs, and tokens across Polkadot and Ethereum networks.
            </p>
            {isWalletConnected && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Connected as {user?.name} ({connectedWalletAddress?.slice(0, 8)}...{connectedWalletAddress?.slice(-4)})
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
              isWalletConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full mr-2",
                isWalletConnected ? "bg-green-500" : "bg-red-500"
              )} />
              {isWalletConnected ? 'Connected' : 'Disconnected'}
            </div>
            {isWalletConnected && connectedWalletAddress && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                <WalletIcon className="h-4 w-4 mr-2" />
                {connectedWalletAddress.slice(0, 6)}...{connectedWalletAddress.slice(-4)}
              </div>
            )}
            <button
              onClick={connectWallet}
              disabled={isWalletConnected || walletState.isConnecting}
              className="inline-flex items-center gap-x-2 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {walletState.isConnecting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : isWalletConnected ? (
                <>
                  <WalletIcon className="h-4 w-4" />
                  Wallet Connected
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hyperbridge Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BeakerIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-purple-900">Cross-Chain Messaging</h2>
          </div>
          <button
            onClick={() => setShowHyperbridge(!showHyperbridge)}
            className="text-purple-600 hover:text-purple-800"
          >
            {showHyperbridge ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {showHyperbridge && (
          <div className="space-y-4">
            <p className="text-sm text-purple-800">
              This implementation uses the Interoperable State Machine Protocol (ISMP) to enable secure cross-chain 
              communication between Polkadot and Ethereum ecosystems through Hyperbridge.
            </p>
            
            {/* Testnet Status Display */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h3 className="font-medium text-purple-900 mb-3">🌐 Testnet Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${testnetStatus.polkadot.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {testnetStatus.polkadot.chainName || 'Polkadot Paseo'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testnetStatus.polkadot.connected ? 
                        `Block #${testnetStatus.polkadot.blockNumber || 'Loading...'}` : 
                        'Disconnected'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${testnetStatus.ethereum.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {testnetStatus.ethereum.chainName || 'Ethereum Sepolia'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testnetStatus.ethereum.connected ? 
                        `Block #${testnetStatus.ethereum.blockNumber || 'Loading...'}` : 
                        'Disconnected'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2">ISMP Messaging</h3>
                <p className="text-sm text-purple-700">Uses pallet-ismp for cross-chain message dispatch</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2">Consensus Proofs</h3>
                <p className="text-sm text-purple-700">GRANDPA consensus client for proof verification</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2">Token Gateway</h3>
                <p className="text-sm text-purple-700">pallet-token-gateway for asset transfers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-purple-700">
              <a href="https://docs.hyperbridge.network/developers/polkadot/getting-started" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-purple-900">
                <LinkIcon className="h-4 w-4 mr-1" />
                Polkadot SDK Documentation
              </a>
              <a href="https://github.com/polytope-labs/hyperbridge" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-purple-900">
                <LinkIcon className="h-4 w-4 mr-1" />
                Hyperbridge Repository
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Message */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Compose Message
            </h2>
            
            {/* Message Mode Radio Buttons */}
            <div className="flex items-center space-x-8">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="messageMode"
                  value="cross-chain"
                  checked={messageMode === 'cross-chain'}
                  onChange={(e) => setMessageMode(e.target.value as 'cross-chain' | 'email')}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 transition-colors"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                  Cross-Chain Message
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="messageMode"
                  value="email"
                  checked={messageMode === 'email'}
                  onChange={(e) => setMessageMode(e.target.value as 'cross-chain' | 'email')}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 transition-colors"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                  Email
                </span>
              </label>
            </div>
          </div>
          
          {messageMode === 'cross-chain' && !isWalletConnected && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Polkadot Wallet Required:</strong> Connect your Polkadot wallet to send cross-chain messages via Hyperbridge.
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Messages are dispatched using the ISMP protocol from your connected Polkadot account.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {messageMode === 'email' && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-2" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Email Mode:</strong> Send traditional emails to your leads using their email addresses.
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Messages will be sent via standard email protocols.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Lead Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Recipient
                </label>
                <button
                  onClick={fetchLeads}
                  disabled={isLoadingLeads}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium disabled:opacity-50"
                >
                  {isLoadingLeads ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              <select
                value={selectedLead?.id || ''}
                onChange={(e) => {
                  const lead = leads.find(l => l.id === e.target.value)
                  setSelectedLead(lead || null)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Choose a recipient... ({leads.length} available)</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {getChainIcon(lead.chain)} {lead.name} ({lead.walletAddress.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Type
              </label>
              <div className="flex space-x-4">
                {(['text', 'nft', 'token'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setMessageType(type)}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md text-sm font-medium",
                      messageType === type
                        ? "bg-pink-100 text-pink-800 border-2 border-pink-500"
                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                    )}
                  >
                    {getTypeIcon(type)}
                    <span className="ml-2 capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Source Chain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send From (Source Chain)
              </label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center">
                  <span className="mr-2">🔴</span>
                  <span className="text-gray-700">Polkadot</span>
                  {isWalletConnected && (
                    <span className="ml-2 text-sm text-gray-500">({connectedWalletAddress?.slice(0, 6)}...{connectedWalletAddress?.slice(-4)})</span>
                  )}
                </div>
              </div>
            </div>

            {/* Destination Chain */}
            {selectedLead && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To (Destination Chain)
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <span className="mr-2">{getChainIcon(selectedLead.chain)}</span>
                    <span className="text-gray-700 capitalize">{selectedLead.chain}</span>
                    <span className="ml-2 text-sm text-gray-500">({selectedLead.walletAddress.slice(0, 6)}...{selectedLead.walletAddress.slice(-4)})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {messageType === 'text' ? 'Marketing Message' : messageType === 'nft' ? 'NFT Details' : 'Token Details'}
              </label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                placeholder={
                  messageType === 'text' 
                    ? 'Enter your marketing message to send cross-chain...' 
                    : messageType === 'nft'
                    ? 'NFT contract address and token ID...'
                    : 'Token contract address and amount...'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            {/* Fees Display */}
            {(fees || isCalculatingFees) && selectedLead && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Transaction Fees</h3>
                {isCalculatingFees ? (
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                    Calculating fees...
                  </div>
                ) : fees ? (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relay Fee:</span>
                      <span className="font-medium">{formatFee(fees.relay, 'polkadot')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protocol Fee:</span>
                      <span className="font-medium">{formatFee(fees.protocol, 'polkadot')}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="text-gray-700 font-medium">Total:</span>
                      <span className="font-semibold">{formatFee(fees.total, 'polkadot')}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={
                (messageMode === 'cross-chain' && !isWalletConnected) || 
                isSending ||
                !selectedLead ||
                !messageContent.trim()
              }
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {messageMode === 'cross-chain' ? 'Sending Message...' : 'Sending Email...'}
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  {messageMode === 'cross-chain' ? 'Send Cross-Chain Message' : 'Send Email'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Message History</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No messages sent yet</p>
                <p className="text-sm text-gray-400">Messages will appear here once sent via Hyperbridge</p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {getChainIcon(message.source.chain)} → {getChainIcon(message.destination.chain)}
                      </span>

                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(message.status)
                      )}>
                        {getStatusIcon(message.status)}
                        <span className="ml-1">{message.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      {getTypeIcon(message.payload.type)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    To: {message.destination.address.slice(0, 8)}...{message.destination.address.slice(-8)}
                  </div>
                  
                  <div className="text-sm text-gray-900 mb-2">
                    {message.payload.content}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(message.timestamp).toLocaleString()}</span>
                    {message.txHash && (
                      <span className="font-mono">
                        Tx: {message.txHash.slice(0, 8)}...{message.txHash.slice(-8)}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs text-purple-600">
                      Hyperbridge ID: {message.id}
                    </div>
                    {message.fees && (
                      <div className="text-xs text-gray-500 mt-1">
                        Fees: {formatFee((BigInt(message.fees.relay) + BigInt(message.fees.protocol)).toString(), message.source.chain)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 