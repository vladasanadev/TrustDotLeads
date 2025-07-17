import { NextRequest, NextResponse } from 'next/server'
import { hyperbridgeClient } from '@/lib/hyperbridge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sourceChain = searchParams.get('sourceChain') as 'polkadot' | 'ethereum'
    const destChain = searchParams.get('destChain') as 'polkadot' | 'ethereum'
    const messageSize = parseInt(searchParams.get('messageSize') || '1000')
    
    if (!sourceChain || !destChain) {
      return NextResponse.json(
        { error: 'Source chain and destination chain are required' },
        { status: 400 }
      )
    }
    
    if (!['polkadot', 'ethereum'].includes(sourceChain) || !['polkadot', 'ethereum'].includes(destChain)) {
      return NextResponse.json(
        { error: 'Invalid chain specified. Must be polkadot or ethereum' },
        { status: 400 }
      )
    }
    
    const fees = await hyperbridgeClient.calculateFees(sourceChain, destChain, messageSize)
    
    return NextResponse.json({
      success: true,
      fees,
      sourceChain,
      destChain,
      messageSize
    })
    
  } catch (error) {
    console.error('Error calculating fees:', error)
    return NextResponse.json(
      { error: 'Failed to calculate fees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sourceChain, destChain, payload } = body
    
    if (!sourceChain || !destChain || !payload) {
      return NextResponse.json(
        { error: 'Source chain, destination chain, and payload are required' },
        { status: 400 }
      )
    }
    
    const messageSize = JSON.stringify(payload).length
    const fees = await hyperbridgeClient.calculateFees(sourceChain, destChain, messageSize)
    
    return NextResponse.json({
      success: true,
      fees,
      sourceChain,
      destChain,
      messageSize,
      payload
    })
    
  } catch (error) {
    console.error('Error calculating fees:', error)
    return NextResponse.json(
      { error: 'Failed to calculate fees' },
      { status: 500 }
    )
  }
} 