import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Lead } from '@/types'

// Path to store leads data
const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(leadsFilePath)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Generate unique Polkadot address
function generatePolkadotAddress(seed: string): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const hash = Array.from(seed).reduce((hash, char) => {
    const charCode = char.charCodeAt(0)
    return ((hash << 5) - hash) + charCode
  }, 0)
  
  let address = '1' // Polkadot prefix
  for (let i = 0; i < 47; i++) {
    address += chars[Math.abs(hash + i) % chars.length]
  }
  return address
}

// Generate unique Ethereum address
function generateEthereumAddress(seed: string): string {
  const hash = Array.from(seed).reduce((hash, char) => {
    const charCode = char.charCodeAt(0)
    return ((hash << 5) - hash) + charCode
  }, 0)
  
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    address += Math.abs(hash + i).toString(16).substring(0, 1)
  }
  return address
}

// Load leads from file
async function loadLeads(): Promise<Lead[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(leadsFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is corrupted, start with default sample leads
    console.log('Creating new leads file with sample data...')
    
    // Generate unique addresses for sample leads
    const polkadotAddress1 = generatePolkadotAddress('validator-sample-1-' + Date.now())
    const polkadotAddress2 = generatePolkadotAddress('nominator-sample-2-' + Date.now())
    const polkadotAddress3 = generatePolkadotAddress('trader-sample-3-' + Date.now())
    const polkadotAddress4 = generatePolkadotAddress('holder-sample-4-' + Date.now())
    const polkadotAddress5 = generatePolkadotAddress('defi-sample-5-' + Date.now())
    
    const ethAddress1 = generateEthereumAddress('whale-sample-1-' + Date.now())
    const ethAddress2 = generateEthereumAddress('defi-sample-2-' + Date.now())
    const ethAddress3 = generateEthereumAddress('nft-sample-3-' + Date.now())
    const ethAddress4 = generateEthereumAddress('test-sepolia-' + Date.now())
    
    const defaultLeads: Lead[] = [
      {
        id: 'lead_sample_1',
        name: `High-Value Validator ${polkadotAddress1.slice(0, 6)}...`,
        email: `validator.${polkadotAddress1.slice(0, 8).toLowerCase()}@polkadot.leads`,
        company: 'Polkadot Staking',
        walletAddress: polkadotAddress1,
        chain: 'polkadot',
        status: 'new',
        source: 'web3_search',
        createdAt: new Date().toISOString(),
        notes: 'Discovered via web3_search - Balance: 50,000 DOT ($175,000 USD) - Currently staking - 2,500 transactions',
        value: 1750000,
        polkadotAddress: polkadotAddress1
      },
      {
        id: 'lead_sample_2',
        name: `Staking Nominator ${polkadotAddress2.slice(0, 6)}...`,
        email: `staking.${polkadotAddress2.slice(0, 8).toLowerCase()}@polkadot.leads`,
        company: 'Polkadot Staking',
        walletAddress: polkadotAddress2,
        chain: 'polkadot',
        status: 'new',
        source: 'bigquery',
        createdAt: new Date().toISOString(),
        notes: 'Discovered via bigquery - Balance: 15,000 DOT ($52,500 USD) - Currently staking - 1,200 transactions',
        value: 525000,
        polkadotAddress: polkadotAddress2
      },
      {
        id: 'lead_sample_3',
        name: `Active Trader ${polkadotAddress3.slice(0, 6)}...`,
        email: `trader.${polkadotAddress3.slice(0, 8).toLowerCase()}@polkadot.leads`,
        company: 'Polkadot Trading',
        walletAddress: polkadotAddress3,
        chain: 'polkadot',
        status: 'contacted',
        source: 'web3_search',
        createdAt: new Date().toISOString(),
        notes: 'Discovered via web3_search - Balance: 8,500 DOT ($29,750 USD) - High trading volume - 3,500 transactions',
        value: 297500,
        polkadotAddress: polkadotAddress3
      },
      {
        id: 'lead_sample_4',
        name: `DOT Holder ${polkadotAddress4.slice(0, 6)}...`,
        email: `holder.${polkadotAddress4.slice(0, 8).toLowerCase()}@polkadot.leads`,
        company: 'Polkadot Network',
        walletAddress: polkadotAddress4,
        chain: 'polkadot',
        status: 'new',
        source: 'bigquery',
        createdAt: new Date().toISOString(),
        notes: 'Discovered via bigquery - Balance: 25,000 DOT ($87,500 USD) - Long-term holder - 450 transactions',
        value: 875000,
        polkadotAddress: polkadotAddress4
      },
      {
        id: 'lead_sample_5',
        name: `DeFi Participant ${polkadotAddress5.slice(0, 6)}...`,
        email: `defi.${polkadotAddress5.slice(0, 8).toLowerCase()}@polkadot.leads`,
        company: 'Polkadot DeFi',
        walletAddress: polkadotAddress5,
        chain: 'polkadot',
        status: 'qualified',
        source: 'web3_search',
        createdAt: new Date().toISOString(),
        notes: 'Discovered via web3_search - Balance: 12,000 DOT ($42,000 USD) - Active in DeFi - 950 transactions',
        value: 420000,
        polkadotAddress: polkadotAddress5
      },
      {
        id: 'lead_sample_6',
        name: `ETH Whale ${ethAddress1.slice(0, 6)}...`,
        email: `whale.${ethAddress1.slice(2, 10).toLowerCase()}@ethereum.leads`,
        company: 'Ethereum Network',
        walletAddress: ethAddress1,
        chain: 'ethereum',
        status: 'new',
        source: 'etherscan',
        createdAt: new Date().toISOString(),
        notes: 'Discovered via etherscan - Balance: 1,000 ETH ($3,500,000 USD) - 5,000 transactions',
        value: 35000000
      },
      {
        id: 'lead_sample_7',
        name: `DeFi Power User ${ethAddress2.slice(0, 6)}...`,
        email: `defi.${ethAddress2.slice(2, 10).toLowerCase()}@ethereum.leads`,
        company: 'Ethereum DeFi',
        walletAddress: ethAddress2,
        chain: 'ethereum',
        status: 'contacted',
        source: 'etherscan',
        createdAt: new Date().toISOString(),
        notes: 'Discovered via etherscan - Balance: 125 ETH ($437,500 USD) - Heavy DeFi usage - 2,800 transactions',
        value: 4375000
      },
      {
        id: 'lead_sample_8',
        name: `NFT Collector ${ethAddress3.slice(0, 6)}...`,
        email: `nft.${ethAddress3.slice(2, 10).toLowerCase()}@ethereum.leads`,
        company: 'NFT Trading',
        walletAddress: ethAddress3,
        chain: 'ethereum',
        status: 'new',
        source: 'etherscan',
        createdAt: new Date().toISOString(),
        notes: 'Discovered via etherscan - Balance: 45 ETH ($157,500 USD) - Active NFT trader - 1,900 transactions',
        value: 1575000
      },
      {
        id: 'lead_test_sepolia',
        name: `Test Sepolia ${ethAddress4.slice(0, 6)}...`,
        email: `test.${ethAddress4.slice(2, 10).toLowerCase()}@ethereum.leads`,
        company: 'Test Account',
        walletAddress: ethAddress4,
        chain: 'ethereum',
        status: 'new',
        source: 'manual',
        createdAt: new Date().toISOString(),
        notes: 'Test Sepolia address for cross-chain messaging validation',
        value: 0
      }
    ]
    await saveLeads(defaultLeads)
    return defaultLeads
  }
}

// Save leads to file
async function saveLeads(leads: Lead[]): Promise<void> {
  try {
    await ensureDataDirectory()
    await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2))
  } catch (error) {
    console.error('Error saving leads:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadsData } = body

    if (!leadsData || !Array.isArray(leadsData)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected leadsData array.' },
        { status: 400 }
      )
    }

    // Load existing leads
    const existingLeads = await loadLeads()

    // Generate IDs and timestamps for new leads
    const newLeads: Lead[] = leadsData.map((leadData: Partial<Lead>, index: number) => {
      const lead: Lead = {
        id: `lead_${Date.now()}_${index}`,
        name: leadData.name || 'Unknown',
        email: leadData.email || 'unknown@example.com',
        company: leadData.company || 'Unknown Company',
        walletAddress: leadData.walletAddress || '',
        chain: leadData.chain || 'polkadot',
        status: leadData.status || 'new',
        source: leadData.source || 'web3_search',
        createdAt: new Date().toISOString(),
        notes: leadData.notes || '',
        value: leadData.value || 0,
        ...leadData,
      }

      // Set the appropriate address field based on chain
      if (leadData.chain === 'polkadot') {
        lead.polkadotAddress = leadData.walletAddress
      }
      // For Ethereum chains, walletAddress is used as the main address field

      return lead
    })

    // Add new leads to existing ones
    const updatedLeads = [...existingLeads, ...newLeads]

    // Save to file
    await saveLeads(updatedLeads)

    console.log(`✅ Successfully added ${newLeads.length} leads to CRM (Total: ${updatedLeads.length})`)
    console.log('New leads:', newLeads.map(l => ({ id: l.id, name: l.name, chain: l.chain })))

    return NextResponse.json({
      success: true,
      message: `Successfully added ${newLeads.length} leads to CRM`,
      leads: newLeads,
      count: newLeads.length,
      totalLeads: updatedLeads.length
    })

  } catch (error) {
    console.error('❌ Error adding leads to CRM:', error)
    return NextResponse.json(
      { error: 'Failed to add leads to CRM' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Load leads from file
    const leads = await loadLeads()
    
    console.log(`📊 Fetched ${leads.length} leads from storage`)
    
    return NextResponse.json({
      success: true,
      leads,
      count: leads.length
    })
  } catch (error) {
    console.error('❌ Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('id')

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    // Load existing leads
    const existingLeads = await loadLeads()

    // Filter out the lead to delete
    const updatedLeads = existingLeads.filter(lead => lead.id !== leadId)

    if (updatedLeads.length === existingLeads.length) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Save updated leads
    await saveLeads(updatedLeads)

    console.log(`🗑️ Deleted lead ${leadId}`)

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
      deletedId: leadId
    })

  } catch (error) {
    console.error('❌ Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, updates } = body

    if (!leadId || !updates) {
      return NextResponse.json(
        { error: 'Lead ID and updates are required' },
        { status: 400 }
      )
    }

    // Load existing leads
    const existingLeads = await loadLeads()

    // Find and update the lead
    const updatedLeads = existingLeads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
      return lead
    })

    // Save updated leads
    await saveLeads(updatedLeads)

    console.log(`✏️ Updated lead ${leadId}`)

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
      updatedId: leadId
    })

  } catch (error) {
    console.error('❌ Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
} 