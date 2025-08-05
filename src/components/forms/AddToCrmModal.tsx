'use client'

import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CheckIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { WalletResult } from '@/types'
import { cn } from '@/lib/utils'

interface AddToCrmModalProps {
  isOpen: boolean
  onClose: () => void
  wallets: WalletResult[]
  onAddToLeads: (leadsData: Array<{
    name: string
    email: string
    company: string
    walletAddress: string
    chain: 'polkadot' | 'ethereum'
    status: 'new' | 'contacted' | 'qualified' | 'converted'
    source: string
    notes: string
    value?: number
  }>) => void
}

export default function AddToCrmModal({ isOpen, onClose, wallets, onAddToLeads }: AddToCrmModalProps) {
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(
    new Set()
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset selection when modal opens with new wallets
  useEffect(() => {
    if (isOpen) {
      setSelectedWallets(new Set())
    }
  }, [isOpen, wallets])
  const [formData, setFormData] = useState({
    defaultSource: 'web3_search',
    defaultStatus: 'new' as const,
    defaultCompany: '',
    addNotes: true,
    estimateValue: true
  })

  const handleWalletToggle = (address: string) => {
    const newSelected = new Set(selectedWallets)
    if (newSelected.has(address)) {
      newSelected.delete(address)
    } else {
      newSelected.add(address)
    }
    setSelectedWallets(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedWallets.size === wallets.length) {
      setSelectedWallets(new Set())
    } else {
      setSelectedWallets(new Set(wallets.map(w => w.address)))
    }
  }

  const generateLeadData = (wallet: WalletResult) => {
    const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    const estimatedValue = formData.estimateValue ? Math.round(wallet.balanceUsd * 10) : undefined
    
    // Generate meaningful names based on wallet characteristics
    let walletName = ''
    if (wallet.isStaking && wallet.balance > 1000) {
      walletName = `Staking Validator ${shortAddress}`
    } else if (wallet.balance > 10000) {
      walletName = `High-Value Holder ${shortAddress}`
    } else if (wallet.isStaking) {
      walletName = `Staking Nominator ${shortAddress}`
    } else if (wallet.balance > 1000) {
      walletName = `DOT Holder ${shortAddress}`
    } else {
      walletName = `Wallet ${shortAddress}`
    }
    
    // Generate meaningful email based on wallet type
    const emailPrefix = wallet.isStaking ? 'staking' : 'holder'
    const cleanAddress = wallet.address.slice(0, 8).toLowerCase()
    
    let notes = ''
    if (formData.addNotes) {
      const asset = wallet.asset || 'DOT'
      notes = `Wallet discovered via ${formData.defaultSource} - Balance: ${wallet.balance.toLocaleString()} ${asset} ($${wallet.balanceUsd.toFixed(2)} USD)`
      if (wallet.isStaking) notes += ' - Currently staking'
      if (wallet.kycStatus && wallet.kycStatus !== 'Unknown') notes += ` - KYC: ${wallet.kycStatus}`
      if (wallet.transactionCount) notes += ` - ${wallet.transactionCount} transactions`
      if (wallet.lastActivity) notes += ` - Last active: ${wallet.lastActivity}`
    }

    return {
      name: walletName,
      email: `${emailPrefix}.${cleanAddress}@polkadot.leads`,
      company: formData.defaultCompany || (wallet.isStaking ? 'Polkadot Staking' : 'Polkadot Network'),
      walletAddress: wallet.address,
      chain: wallet.chain as 'polkadot' | 'ethereum', // Include chain information
      status: formData.defaultStatus,
      source: formData.defaultSource,
      notes,
      value: estimatedValue
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const selectedWalletData = wallets
        .filter(wallet => selectedWallets.has(wallet.address))
        .map(generateLeadData)
      
      await onAddToLeads(selectedWalletData)
      
      // Close modal after successful submission
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      console.error('Error adding to CRM:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCount = selectedWallets.size
  const newLeadsCount = wallets.filter(w => w.status === 'new').length

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Add Wallets to CRM
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuration Panel */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Lead Configuration</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Source
                          </label>
                          <select
                            value={formData.defaultSource}
                            onChange={(e) => setFormData(prev => ({ ...prev, defaultSource: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          >
                            <option value="web3_search">Web3 Search</option>
                            <option value="bigquery">BigQuery</option>
                            <option value="blockchain_scan">Blockchain Scan</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Status
                          </label>
                          <select
                            value={formData.defaultStatus}
                            onChange={(e) => setFormData(prev => ({ ...prev, defaultStatus: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Company
                          </label>
                          <input
                            type="text"
                            value={formData.defaultCompany}
                            onChange={(e) => setFormData(prev => ({ ...prev, defaultCompany: e.target.value }))}
                            placeholder="Leave empty for 'Unknown'"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.addNotes}
                              onChange={(e) => setFormData(prev => ({ ...prev, addNotes: e.target.checked }))}
                              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Add wallet details to notes</span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.estimateValue}
                              onChange={(e) => setFormData(prev => ({ ...prev, estimateValue: e.target.checked }))}
                              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Estimate lead value (10x USD balance)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Summary</h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p>Total wallets: {wallets.length}</p>
                        <p>New leads: {newLeadsCount}</p>
                        <p>Selected: {selectedCount}</p>
                        <p>Will be added to CRM: {selectedCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Selection Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Select Wallets</h4>
                      <button
                        onClick={handleSelectAll}
                        className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                      >
                        {selectedWallets.size === wallets.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                      {wallets.map((wallet) => (
                        <div
                          key={wallet.address}
                          className={cn(
                            "flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50",
                            selectedWallets.has(wallet.address) && "bg-pink-50"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedWallets.has(wallet.address)}
                              onChange={() => handleWalletToggle(wallet.address)}
                              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-mono text-xs text-gray-900">
                                  {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                                </span>
                                <span className={cn(
                                  "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                                  wallet.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                )}>
                                  {wallet.status === 'new' ? 'New' : 'Existing'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {wallet.balance.toLocaleString()} DOT (${wallet.balanceUsd.toFixed(2)})
                                {wallet.isStaking && " • Staking"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={selectedCount === 0 || isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="w-4 h-4 mr-2" />
                        Add {selectedCount} to CRM
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 