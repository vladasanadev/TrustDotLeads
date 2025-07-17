'use client'

import { useState, useEffect } from 'react'
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  WalletIcon,
  BanknotesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import StatsCard from '@/components/ui/StatsCard'
import LineChart from '@/components/charts/LineChart'
import { mockTimeSeriesData, mockActivities } from '@/lib/mock-data'
import { formatRelativeTime } from '@/lib/utils'
import { Lead } from '@/types'

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      
      if (response.ok && data.success) {
        const apiLeads = data.leads || []
        setLeads(apiLeads)
        console.log(`✅ Dashboard loaded ${apiLeads.length} leads from API`)
      }
    } catch (error) {
      console.error('Error fetching leads in dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load leads on component mount
  useEffect(() => {
    fetchLeads()
  }, [])

  // Poll for updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchLeads, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calculate dynamic stats from real data
  const totalLeads = leads.length
  const newLeads = leads.filter(lead => lead.status === 'new').length
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length
  const convertedLeads = leads.filter(lead => lead.status === 'converted').length
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0)
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) : 0

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      change: { value: 12, type: 'increase' as const },
      icon: UserGroupIcon,
    },
    {
      title: 'New Leads',
      value: newLeads,
      change: { value: 8, type: 'increase' as const },
      icon: ArrowTrendingUpIcon,
    },
    {
      title: 'Total Value',
      value: totalValue,
      change: { value: 15, type: 'increase' as const },
      icon: CurrencyDollarIcon,
      valueType: 'currency' as const,
    },
    {
      title: 'Conversion Rate',
      value: conversionRate,
      change: { value: 3, type: 'increase' as const },
      icon: ChartBarIcon,
      valueType: 'percentage' as const,
    },
    {
      title: 'Wallets Scraped',
      value: 1250, // This could be calculated from source data
      change: { value: 5, type: 'increase' as const },
      icon: WalletIcon,
    },
    {
      title: 'Staking Volume',
      value: 125000, // This could be calculated from lead values
      change: { value: 7, type: 'increase' as const },
      icon: BanknotesIcon,
      valueType: 'currency' as const,
    },
  ]

  const recentLeads = leads.slice(0, 5)
  const recentActivities = mockActivities.slice(0, 5)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's what's happening with your Polkadot lead generation.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <ClockIcon className="h-4 w-4" />
              <span>Last updated: {formatRelativeTime(new Date(Date.now() - 300000))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            valueType={stat.valueType}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <LineChart 
            data={mockTimeSeriesData}
            title="Lead Generation Trend"
            color="#e91e63"
            height={300}
          />
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">New</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {leads.filter(lead => lead.status === 'new').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Contacted</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {leads.filter(lead => lead.status === 'contacted').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Qualified</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {leads.filter(lead => lead.status === 'qualified').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Opportunity</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {leads.filter(lead => lead.status === 'opportunity').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Closed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {leads.filter(lead => lead.status === 'closed').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">{lead.value ? `$${lead.value.toLocaleString()}` : 'TBD'}</div>
                    <div className="text-sm text-gray-500">{formatRelativeTime(lead.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                      <ClockIcon className="h-4 w-4 text-pink-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 