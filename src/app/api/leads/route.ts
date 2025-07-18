import { NextRequest, NextResponse } from 'next/server'
import { Lead } from '@/types'

// In a real application, this would connect to your database
// For now, we'll simulate the API behavior
const leads: Lead[] = []

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

    // Generate IDs and timestamps for new leads
    const newLeads: Lead[] = leadsData.map((leadData: Partial<Lead>, index: number) => ({
      id: `lead_${Date.now()}_${index}`,
      name: leadData.name || 'Unknown',
      email: leadData.email || 'unknown@example.com',
      company: leadData.company || 'Unknown Company',
      walletAddress: leadData.walletAddress || '',
      status: leadData.status || 'new',
      source: leadData.source || 'unknown',
      createdAt: new Date().toISOString(),
      ...leadData,
    }))

    // In a real app, you would save to database here
    // For now, we'll just add to our in-memory array
    leads.push(...newLeads)

    console.log(`✅ Successfully added ${newLeads.length} leads to CRM`)
    console.log('New leads:', newLeads)

    return NextResponse.json({
      success: true,
      message: `Successfully added ${newLeads.length} leads to CRM`,
      leads: newLeads,
      count: newLeads.length
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
    // Return all leads (in a real app, this would come from database)
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