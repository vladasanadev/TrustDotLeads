'use client'

import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowUpRightIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Lead } from '@/types'
import { cn, formatDate, formatCurrency } from '@/lib/utils'

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  converted: 'bg-purple-100 text-purple-800',
  opportunity: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-100 text-gray-800'
}

const sourceColors: Record<string, string> = {
  web3_scrape: 'bg-pink-100 text-pink-800',
  web3_search: 'bg-pink-100 text-pink-800',
  bigquery: 'bg-purple-100 text-purple-800',
  blockchain_scan: 'bg-indigo-100 text-indigo-800',
  manual: 'bg-gray-100 text-gray-800',
  referral: 'bg-orange-100 text-orange-800',
  social: 'bg-blue-100 text-blue-800',
  other: 'bg-gray-100 text-gray-800'
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]) // Start with empty array
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch leads from API
  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      
      if (response.ok && data.success) {
        const apiLeads = data.leads || []
        setLeads(apiLeads)
        console.log(`✅ Loaded ${apiLeads.length} leads from API`)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads()
  }, [])

  // Poll for updates every 30 seconds for real-time sync (reduced frequency)
  useEffect(() => {
    const interval = setInterval(fetchLeads, 30000) // Less frequent automatic updates
    return () => clearInterval(interval)
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, updatedAt: new Date() }
        : lead
    ))
  }

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const LeadActions = ({ lead }: { lead: Lead }) => (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <EyeIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                  View Details
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <PencilIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                  Edit Lead
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <EnvelopeIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                  Send Email
                </button>
              )}
            </Menu.Item>
            {lead.phone && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={cn(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'flex items-center px-4 py-2 text-sm w-full'
                    )}
                  >
                    <PhoneIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                    Call
                  </button>
                )}
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={cn(
                    active ? 'bg-gray-100 text-red-600' : 'text-red-600',
                    'flex items-center px-4 py-2 text-sm w-full'
                  )}
                >
                  <TrashIcon className="mr-3 h-4 w-4" aria-hidden="true" />
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Leads
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your Polkadot Web3 wallet leads and track their progress.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={fetchLeads}
              disabled={isLoading}
              className="inline-flex items-center gap-x-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              )}
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-x-2 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* Modern Search & Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Search & Filter Leads</h2>
          <p className="text-sm text-gray-600">Find and organize your Polkadot Web3 wallet leads</p>
        </div>
        
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              🔍 Search Leads
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                className="block w-full rounded-lg border-gray-300 pl-12 pr-4 py-3 text-sm shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                📊 Filter by Status
              </label>
              <select
                className="block w-full rounded-lg border-gray-300 py-3 px-4 text-sm shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all duration-200 text-gray-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="new">🆕 New</option>
                <option value="contacted">📞 Contacted</option>
                <option value="qualified">✅ Qualified</option>
                <option value="opportunity">💰 Opportunity</option>
                <option value="closed">📋 Closed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                🌐 Filter by Source
              </label>
              <select
                className="block w-full rounded-lg border-gray-300 py-3 px-4 text-sm shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-gray-50 focus:bg-white transition-all duration-200 text-gray-900"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="all">All Sources</option>
                <option value="web3_scrape">🔗 Web3 Scrape</option>
                <option value="manual">✋ Manual</option>
                <option value="referral">👥 Referral</option>
                <option value="social">📱 Social</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Showing</span>
              <span className="text-sm font-medium text-gray-900">{filteredLeads.length}</span>
              <span className="text-sm text-gray-500">of {leads.length} leads</span>
            </div>
            {(searchQuery || statusFilter !== 'all' || sourceFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setSourceFilter('all')
                }}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg overflow-hidden sm:rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Lead Management
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {lead.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        {lead.company && (
                          <div className="text-sm text-gray-500">{lead.company}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-pink-500',
                        statusColors[lead.status]
                      )}
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="opportunity">Opportunity</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      sourceColors[lead.source]
                    )}>
                      {lead.source.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.value ? formatCurrency(lead.value) : 'TBD'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.polkadotAddress ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs">
                          {lead.polkadotAddress.slice(0, 8)}...{lead.polkadotAddress.slice(-8)}
                        </span>
                        <button
                          onClick={() => handleCopyAddress(lead.polkadotAddress!)}
                          className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                          title="Copy wallet address"
                        >
                          {copiedAddress === lead.polkadotAddress ? (
                            <CheckIcon className="h-3 w-3 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.lastActivity ? formatDate(new Date(lead.lastActivity)) : formatDate(new Date(lead.createdAt))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <LeadActions lead={lead} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <MagnifyingGlassIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
} 