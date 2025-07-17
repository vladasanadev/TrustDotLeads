import { NextRequest, NextResponse } from 'next/server'
import { hyperbridgeClient } from '@/lib/hyperbridge'
import { HyperbridgeMessage } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      source, 
      destination, 
      payload, 
      senderAddress, 
      messageType = 'post',
      keys,
      height,
      context,
      timeout = 3600
    } = body
    
    // Validate required fields for POST requests
    if (messageType === 'post') {
      if (!source || !destination || !payload || !senderAddress) {
        return NextResponse.json(
          { error: 'Missing required fields for POST request: source, destination, payload, senderAddress' },
          { status: 400 }
        )
      }

      // Calculate fees
      const fees = await hyperbridgeClient.calculateFees(
        source.chain,
        destination.chain,
        JSON.stringify(payload).length
      )

      // Create message object
      const messageData: Omit<HyperbridgeMessage, 'id' | 'status' | 'timestamp' | 'messageType'> = {
        source: {
          chain: source.chain,
          address: senderAddress
        },
        destination: {
          chain: destination.chain,
          address: destination.address
        },
        payload,
        fees: {
          relay: fees.relay,
          protocol: fees.protocol
        }
      }

      // Send POST request via Hyperbridge
      const result = await hyperbridgeClient.sendPostRequest(messageData)
      
      return NextResponse.json({
        success: true,
        message: result,
        fees: fees,
        type: 'post'
      })
    }
    
    // Handle GET requests (cross-chain state reads)
    else if (messageType === 'get') {
      if (!source || !destination || !keys || height === undefined) {
        return NextResponse.json(
          { error: 'Missing required fields for GET request: source, destination, keys, height' },
          { status: 400 }
        )
      }

      // Send GET request via Hyperbridge
      const result = await hyperbridgeClient.sendGetRequest(
        source.chain,
        destination.chain,
        keys,
        height,
        context,
        timeout
      )
      
      return NextResponse.json({
        success: true,
        message: result,
        type: 'get'
      })
    }
    
    // Handle POST responses
    else if (messageType === 'response') {
      const { originalRequest, responseData } = body
      
      if (!originalRequest || !responseData) {
        return NextResponse.json(
          { error: 'Missing required fields for POST response: originalRequest, responseData' },
          { status: 400 }
        )
      }

      // Send POST response via Hyperbridge
      const result = await hyperbridgeClient.sendPostResponse(
        originalRequest,
        responseData,
        timeout
      )
      
      return NextResponse.json({
        success: true,
        message: result,
        type: 'response'
      })
    }
    
    else {
      return NextResponse.json(
        { error: 'Invalid messageType. Must be "post", "get", or "response"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error sending Hyperbridge message:', error)
    return NextResponse.json(
      { error: 'Failed to send message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    
    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const status = await hyperbridgeClient.getMessageStatus(messageId)
    
    return NextResponse.json({
      success: true,
      messageId,
      status
    })
    
  } catch (error) {
    console.error('Error getting message status:', error)
    return NextResponse.json(
      { error: 'Failed to get message status' },
      { status: 500 }
    )
  }
} 