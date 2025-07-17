// Lead management types
export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  walletAddress: string;
  polkadotAddress?: string; // For backward compatibility
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'opportunity' | 'closed';
  source: string;
  createdAt: string;
  notes?: string;
  value?: number;
  phone?: string;
  tags?: string[];
  lastActivity?: string;
}

// Wallet search and BigQuery types
export interface WalletBalance {
  accId: string;
  acc_pubKey: string;
  asset: string;
  decimals: number;
  price: number;
  free: number;
  reserved: number;
  frozen: number;
  misc_frozen: number | null;
  free_usd: number;
  reserved_usd: number;
  frozen_usd: number;
  misc_frozen_usd: number | null;
  chain: string;
  relay: string;
  block_date: string;
}

// Transformed wallet data for frontend
export interface WalletResult {
  id: string;
  address: string;
  publicKey: string;
  balance: number;
  balanceUsd: number;
  reserved: number;
  reservedUsd: number;
  frozen: number;
  frozenUsd: number;
  miscFrozen: number | null;
  miscFrozenUsd: number | null;
  asset: string;
  decimals: number;
  price: number;
  chain: string;
  relay: string;
  blockDate: string;
  transactionCount: number;
  lastActivity: string;
  isStaking: boolean;
  kycStatus: 'approved' | 'pending' | 'none' | 'Unknown';
  poapCount: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
}

// Search filters
export interface SearchFilters {
  minBalance?: number;
  maxBalance?: number;
  asset?: string;
  chain?: string;
  limit?: number;
}

// API response types
export interface WalletSearchResponse {
  success: boolean;
  data: WalletResult[];
  count: number;
  filters: SearchFilters;
  error?: string;
}

// Analytics types
export interface AnalyticsData {
  totalLeads: number;
  conversionRate: number;
  averageBalance: number;
  topSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }>;
}

// Simple data for pie charts and bar charts
export interface PieChartData {
  name: string;
  value: number;
}

export interface Activity {
  id: string
  type: 'email' | 'call' | 'meeting' | 'note' | 'status_change' | 'wallet_update' | 'lead_created' | 'scraping_completed' | 'lead_updated'
  title: string
  description: string
  timestamp: Date
  userId: string
  metadata?: Record<string, any>
}

export interface DashboardStats {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  convertedLeads: number
  totalValue: number
  averageValue: number
  conversionRate: number
  activeScrapingJobs: number
  lastScrapeTime: Date
  totalWalletsScraped: number
  newWalletsToday: number
  walletsScrapped: number
  stakingVolume: number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'agent'
  avatar?: string
  createdAt: Date
  lastLogin: Date
  walletAddress?: string
  authMethod: 'wallet' | 'google'
}

export interface Filter {
  status?: Lead['status'][]
  source?: Lead['source'][]
  assignedTo?: string[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  valueRange?: {
    min: number
    max: number
  }
}

export interface TimeSeriesData {
  date: string
  value: number
}

export interface ValidatorInfo {
  address: string
  name: string
  commission: number
  totalStake: number
  ownStake: number
  nominators: number
  isActive: boolean
  era: number
}

export interface ScrapingJob {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  totalWallets: number
  processedWallets: number
  foundLeads: number
  startTime: Date
  endTime?: Date
  estimatedEndTime?: Date
  filters: {
    minBalance?: number
    minStake?: number
    activeOnly?: boolean
    stakingRequired?: boolean
    governanceActivity?: boolean
    kycStatus?: string
  }
  error?: string
}

// Authentication types
export interface WalletAccount {
  address: string
  meta: {
    name: string
    source: string
  }
  type?: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  walletAddress?: string
  authMethod: 'wallet' | 'google'
  role: 'admin' | 'manager' | 'agent'
  createdAt: string
  lastLogin: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface WalletAuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
}

export interface GoogleAuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface WalletConnectionState {
  isConnected: boolean
  isConnecting: boolean
  accounts: WalletAccount[]
  selectedAccount: WalletAccount | null
  error: string | null
}

// Hyperbridge and cross-chain messaging types following official documentation
export enum StateMachine {
  Polkadot = 'polkadot',
  Ethereum = 'ethereum',
  EvmMainnet = 'evm-1',
  EvmSepolia = 'evm-11155111'
}

export interface DispatchPost {
  dest: StateMachine
  from: Uint8Array
  to: Uint8Array
  timeout: number
  body: Uint8Array
}

export interface DispatchGet {
  dest: StateMachine
  from: Uint8Array
  keys: Uint8Array[]
  height: number
  context: Uint8Array
  timeout: number
}

export interface PostResponse {
  post: PostRequest
  response: Uint8Array
  timeout_timestamp: number
}

export interface PostRequest {
  source: StateMachine
  dest: StateMachine
  nonce: number
  from: Uint8Array
  to: Uint8Array
  timeout_timestamp: number
  body: Uint8Array
}

export interface FeeMetadata {
  payer: string // Account ID
  fee: string // Balance amount
}

export interface HyperbridgeMessage {
  id: string
  source: {
    chain: 'polkadot' | 'ethereum'
    address: string
  }
  destination: {
    chain: 'polkadot' | 'ethereum'
    address: string
  }
  payload: {
    type: 'text' | 'nft' | 'token'
    content: string
    metadata?: any
  }
  status: 'pending' | 'dispatched' | 'relayed' | 'delivered' | 'failed'
  timestamp: number
  txHash?: string
  proof?: string
  fees: {
    relay: string
    protocol: string
  }
  messageType: 'post' | 'get' | 'response'
  ismpRequest?: DispatchPost | DispatchGet
  hyperbridgeId?: string
}

// Legacy interface for backward compatibility
export interface ISMPMessage {
  source: string
  dest: string
  nonce: number
  timeout: number
  body: Uint8Array
  fee: string
}

export interface CrossChainTransfer {
  id: string
  sourceChain: 'polkadot' | 'ethereum'
  destChain: 'polkadot' | 'ethereum'
  sourceAddress: string
  destAddress: string
  asset: string
  amount: string
  status: 'pending' | 'confirmed' | 'failed'
  txHash: string
  timestamp: number
  fees: {
    gas: string
    bridge: string
    total: string
  }
}

export interface HyperbridgeConfig {
  polkadot: {
    rpc: string
    hyperbridgeRpc: string
    chainId: string
    ss58Format: number
  }
  ethereum: {
    rpc: string
    hyperbridgeContract: string
    chainId: number
  }
  hyperbridge: {
    network: 'mainnet' | 'testnet'
    relayerEndpoint: string
    consensusClient: 'grandpa' | 'parachain'
    protocolFees: {
      polkadot: string
      ethereum: string
    }
  }
}

export interface RelayerInfo {
  id: string
  address: string
  stake: string
  commission: number
  isActive: boolean
  messagesRelayed: number
  uptime: number
  lastSeen: number
}

export interface CrossChainEvent {
  id: string
  type: 'message_sent' | 'message_received' | 'proof_generated' | 'proof_verified' | 'timeout'
  messageId: string
  sourceChain: 'polkadot' | 'ethereum'
  destChain: 'polkadot' | 'ethereum'
  blockNumber: number
  txHash: string
  timestamp: number
  data: any
}

export interface MessageProof {
  messageId: string
  sourceChain: 'polkadot' | 'ethereum'
  destChain: 'polkadot' | 'ethereum'
  proof: string
  merkleRoot: string
  blockNumber: number
  timestamp: number
  verified: boolean
}

export interface ChainState {
  chainId: string
  latestBlock: number
  latestBlockHash: string
  finalizedBlock: number
  finalizedBlockHash: string
  isConnected: boolean
  lastUpdate: number
}

export interface HyperbridgeStats {
  totalMessages: number
  messagesPerDay: number
  totalValueLocked: string
  activeRelayers: number
  averageRelayTime: number
  successRate: number
  supportedChains: string[]
}

export interface TokenBridgeInfo {
  sourceToken: {
    chain: 'polkadot' | 'ethereum'
    address: string
    symbol: string
    decimals: number
  }
  destToken: {
    chain: 'polkadot' | 'ethereum'
    address: string
    symbol: string
    decimals: number
  }
  bridgeContract: string
  minAmount: string
  maxAmount: string
  fee: string
  isActive: boolean
} 