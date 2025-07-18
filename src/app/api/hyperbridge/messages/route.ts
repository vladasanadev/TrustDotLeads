import { NextRequest, NextResponse } from 'next/server'
import { hyperbridgeClient } from '@/lib/hyperbridge'
import { HyperbridgeMessage } from '@/types'

// In-memory storage for messages (in production, use a database)
const messageStore: HyperbridgeMessage[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const chain = searchParams.get('chain') as 'polkadot' | 'ethereum'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let filteredMessages = messageStore
    
    // Filter by address if provided
    if (address) {
      filteredMessages = messageStore.filter(msg => 
        msg.source.address === address || msg.destination.address === address
      )
    }
    
    // Filter by chain if provided
    if (chain) {
      filteredMessages = filteredMessages.filter(msg => 
        msg.source.chain === chain || msg.destination.chain === chain
      )
    }
    
    // Apply pagination
    const paginatedMessages = filteredMessages
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(offset, offset + limit)
    
    return NextResponse.json({
      success: true,
      messages: paginatedMessages,
      total: filteredMessages.length,
      offset,
      limit
    })
    
  } catch (error) {
    console.error('Error retrieving messages:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, messageId, message } = body
    
    switch (action) {
      case 'store':
        // Store a new message
        if (!message) {
          return NextResponse.json(
            { error: 'Message data is required' },
            { status: 400 }
          )
        }
        
        messageStore.push(message)
        
        return NextResponse.json({
          success: true,
          message: 'Message stored successfully'
        })
        
      case 'update_status':
        // Update message status
        if (!messageId) {
          return NextResponse.json(
            { error: 'Message ID is required' },
            { status: 400 }
          )
        }
        
        const messageIndex = messageStore.findIndex(msg => msg.id === messageId)
        if (messageIndex === -1) {
          return NextResponse.json(
            { error: 'Message not found' },
            { status: 404 }
          )
        }
        
        // Get updated status from Hyperbridge
        const updatedStatus = await hyperbridgeClient.getMessageStatus(messageId)
        messageStore[messageIndex].status = updatedStatus
        
        return NextResponse.json({
          success: true,
          message: messageStore[messageIndex]
        })
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Error processing message request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    
    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }
    
    const messageIndex = messageStore.findIndex(msg => msg.id === messageId)
    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }
    
    messageStore.splice(messageIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
} 