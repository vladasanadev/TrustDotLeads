import { Lead, DashboardStats, Activity, ScrapingJob, TimeSeriesData } from '@/types'

// Empty leads array - leads will be populated from search/API
export const mockLeads: Lead[] = []

export const mockDashboardStats: DashboardStats = {
  totalLeads: 0, // Will be calculated dynamically
  newLeads: 0, // Will be calculated dynamically
  qualifiedLeads: 0, // Will be calculated dynamically
  convertedLeads: 0, // Will be calculated dynamically
  conversionRate: 0,
  averageValue: 0,
  totalValue: 0,
  activeScrapingJobs: 3,
  lastScrapeTime: new Date('2024-01-20T10:00:00Z'),
  totalWalletsScraped: 1250,
  newWalletsToday: 45,
  walletsScrapped: 1250,
  stakingVolume: 125000
}

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'lead_created',
    title: 'New lead created',
    description: 'Lead added from web3 search',
    timestamp: new Date('2024-01-20T08:00:00Z'),
    userId: 'user1',
    metadata: {
      leadId: '1',
      source: 'web3_search'
    }
  },
  {
    id: '2',
    type: 'scraping_completed',
    title: 'Search completed',
    description: 'Found high-value wallets',
    timestamp: new Date('2024-01-20T07:30:00Z'),
    userId: 'system',
    metadata: {
      jobId: 'job1',
      walletsFound: 23
    }
  },
  {
    id: '3',
    type: 'lead_updated',
    title: 'Lead status updated',
    description: 'Lead status changed to qualified',
    timestamp: new Date('2024-01-20T07:00:00Z'),
    userId: 'user1',
    metadata: {
      leadId: '2',
      oldStatus: 'contacted',
      newStatus: 'qualified'
    }
  }
]

export const mockScrapingJobs: ScrapingJob[] = [
  {
    id: 'job1',
    name: 'High-value DOT holders',
    status: 'running',
    progress: 65,
    totalWallets: 1000,
    processedWallets: 650,
    foundLeads: 23,
    startTime: new Date('2024-01-20T06:00:00Z'),
    estimatedEndTime: new Date('2024-01-20T10:00:00Z'),
    filters: {
      minBalance: 10000,
      stakingRequired: true,
      kycStatus: 'any'
    }
  },
  {
    id: 'job2',
    name: 'Governance participants',
    status: 'completed',
    progress: 100,
    totalWallets: 500,
    processedWallets: 500,
    foundLeads: 12,
    startTime: new Date('2024-01-19T14:00:00Z'),
    endTime: new Date('2024-01-19T16:30:00Z'),
    filters: {
      minBalance: 5000,
      governanceActivity: true,
      kycStatus: 'approved'
    }
  }
]

export const mockTimeSeriesData: TimeSeriesData[] = [
  { date: '2024-01-01', value: 120 },
  { date: '2024-01-02', value: 135 },
  { date: '2024-01-03', value: 125 },
  { date: '2024-01-04', value: 145 },
  { date: '2024-01-05', value: 160 },
  { date: '2024-01-06', value: 155 },
  { date: '2024-01-07', value: 170 },
  { date: '2024-01-08', value: 185 },
  { date: '2024-01-09', value: 175 },
  { date: '2024-01-10', value: 190 },
  { date: '2024-01-11', value: 200 },
  { date: '2024-01-12', value: 195 },
  { date: '2024-01-13', value: 210 },
  { date: '2024-01-14', value: 225 }
] 