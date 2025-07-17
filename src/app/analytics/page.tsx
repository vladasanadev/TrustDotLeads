'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  FunnelIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline'
import StatsCard from '@/components/ui/StatsCard'
import LineChart from '@/components/charts/LineChart'
import PieChart from '@/components/charts/PieChart'
import { mockTimeSeriesData } from '@/lib/mock-data'
import { ChartData, PieChartData, Lead } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/utils'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days')
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
        console.log(`✅ Analytics loaded ${apiLeads.length} leads from API`)
      }
    } catch (error) {
      console.error('Error fetching leads in analytics:', error)
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

  // Calculate analytics data from real leads
  const totalLeads = leads.length
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0)
  const avgValue = totalLeads > 0 ? totalValue / totalLeads : 0

  // For staking data, we'll use placeholder logic since it's not in current lead structure
  const totalStakingVolume = leads.reduce((sum, lead) => 
    sum + (lead.value || 0) * 0.1, 0 // Assume 10% of value is staked
  )
  const avgStakingAmount = totalLeads > 0 ? totalStakingVolume / totalLeads : 0

  // Status distribution data
  const statusData: PieChartData[] = [
    { name: 'New', value: leads.filter(lead => lead.status === 'new').length },
    { name: 'Contacted', value: leads.filter(lead => lead.status === 'contacted').length },
    { name: 'Qualified', value: leads.filter(lead => lead.status === 'qualified').length },
    { name: 'Opportunity', value: leads.filter(lead => lead.status === 'opportunity').length },
    { name: 'Closed', value: leads.filter(lead => lead.status === 'closed').length },
  ].filter(item => item.value > 0) // Only show statuses with actual leads

  // Source distribution data
  const sourceData: PieChartData[] = Object.entries(
    leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace('_', ' '), value }))

  // Value distribution data
  const valueRanges = [
    { name: '$0-$1K', min: 0, max: 1000 },
    { name: '$1K-$10K', min: 1000, max: 10000 },
    { name: '$10K-$100K', min: 10000, max: 100000 },
    { name: '$100K+', min: 100000, max: Infinity }
  ]

  const valueData: PieChartData[] = valueRanges.map(range => ({
    name: range.name,
    value: leads.filter(lead => 
      lead.value && lead.value >= range.min && lead.value < range.max
    ).length
  }))

  // Staking distribution data (simplified since we don't have polkadotData)
  const stakingRanges = [
    { name: '$0-$1K', min: 0, max: 1000 },
    { name: '$1K-$10K', min: 1000, max: 10000 },
    { name: '$10K-$100K', min: 10000, max: 100000 },
    { name: '$100K+', min: 100000, max: Infinity }
  ]

  const stakingData: PieChartData[] = stakingRanges.map(range => ({
    name: range.name,
    value: leads.filter(lead => 
      lead.value && 
      lead.value >= range.min && 
      lead.value < range.max
    ).length
  }))

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      change: { value: 12, type: 'increase' as const },
      icon: UserGroupIcon,
    },
    {
      title: 'Qualified Rate',
      value: ((qualifiedLeads / totalLeads) * 100).toFixed(1),
      change: { value: 5, type: 'increase' as const },
      icon: ChartBarIcon,
      valueType: 'percentage' as const,
    },
    {
      title: 'Total Lead Value',
      value: totalValue,
      change: { value: 18, type: 'increase' as const },
      icon: CurrencyDollarIcon,
      valueType: 'currency' as const,
    },
    {
      title: 'Avg Lead Value',
      value: avgValue,
      change: { value: 8, type: 'increase' as const },
      icon: ArrowTrendingUpIcon,
      valueType: 'currency' as const,
    },
    {
      title: 'Total Staking Volume',
      value: totalStakingVolume,
      change: { value: 15, type: 'increase' as const },
      icon: ShieldCheckIcon,
      valueType: 'number' as const,
    },
    {
      title: 'Avg Staking Amount',
      value: avgStakingAmount,
      change: { value: 3, type: 'increase' as const },
      icon: DocumentChartBarIcon,
      valueType: 'number' as const,
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="ml-2 text-gray-600">Loading analytics...</span>
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
              Analytics
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Deep insights into your Polkadot wallet leads and staking data.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              className="rounded-md border-gray-300 text-sm focus:border-pink-500 focus:ring-pink-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Lead Generation Trend */}
        <div className="rounded-lg bg-white p-6 shadow">
          <LineChart 
            data={mockTimeSeriesData}
            title="Lead Generation Trend"
            color="#e91e63"
            height={300}
          />
        </div>

        {/* Lead Status Distribution */}
        <div className="rounded-lg bg-white p-6 shadow">
          <PieChart
            data={statusData}
            title="Lead Status Distribution"
            height={300}
          />
        </div>

        {/* Lead Source Distribution */}
        <div className="rounded-lg bg-white p-6 shadow">
          <PieChart
            data={sourceData}
            title="Lead Source Distribution"
            height={300}
          />
        </div>

        {/* Lead Value Distribution */}
        <div className="rounded-lg bg-white p-6 shadow">
          <PieChart
            data={valueData}
            title="Lead Value Distribution"
            height={300}
          />
        </div>

        {/* Staking Amount Distribution */}
        <div className="rounded-lg bg-white p-6 shadow">
          <PieChart
            data={stakingData}
            title="Staking Amount Distribution"
            height={300}
          />
        </div>

        {/* Top Performing Metrics */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <CurrencyDollarIcon className="h-4 w-4 text-pink-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Highest Value Lead</div>
                  <div className="text-xs text-gray-500">Emma Thompson</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">$200,000</div>
                <div className="text-xs text-gray-500">Closed Deal</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Largest Staker</div>
                  <div className="text-xs text-gray-500">Bob Smith</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">200,000 DOT</div>
                <div className="text-xs text-gray-500">Active Validator</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <UserGroupIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Most Active</div>
                  <div className="text-xs text-gray-500">Alice Johnson</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">342 Txns</div>
                <div className="text-xs text-gray-500">High Activity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="rounded-lg bg-white shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Wallet Analytics Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nominations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rewards
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.slice(0, 10).map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.value ? formatCurrency(lead.value) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.value ? formatCurrency(lead.value * 0.1) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    N/A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    N/A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 