# Hyperbridge Integration Guide

## Overview

This document outlines the integration of Hyperbridge technology into the PolkaLeads CRM application, enabling real cross-chain messaging between Polkadot and Ethereum ecosystems using the Interoperable State Machine Protocol (ISMP).

## Architecture

### Core Components

1. **HyperbridgeClient** (`src/lib/hyperbridge.ts`)
   - Manages connections to Polkadot and Ethereum networks
   - Handles ISMP message dispatch and reception
   - Provides fee calculation and status tracking

2. **API Routes** (`src/app/api/hyperbridge/`)
   - `/api/hyperbridge/send` - Send cross-chain messages
   - `/api/hyperbridge/messages` - Manage message history
   - `/api/hyperbridge/fees` - Calculate transaction fees

3. **Message UI** (`src/app/message/page.tsx`)
   - Real-time message composition and sending
   - Live fee calculation
   - Message status tracking
   - Incoming message subscription

## ISMP Protocol Implementation

### Message Flow

1. **Message Dispatch**
   ```typescript
   // From Polkadot (via pallet-ismp)
   const ismpMessage: ISMPMessage = {
     source: senderAddress,
     dest: recipientAddress,
     nonce: timestamp,
     timeout: 24_hours,
     body: encodedPayload,
     fee: protocolFee
   }
   ```

2. **Cross-Chain Relay**
   - Messages are relayed through Hyperbridge consensus
   - GRANDPA consensus client provides proof verification
   - Relayers earn fees for message processing

3. **Message Delivery**
   - Target chain receives and processes the message
   - Status updates: pending → dispatched → relayed → delivered

### Supported Chains

- **Polkadot**: Primary chain using pallet-ismp
- **Ethereum**: Via Hyperbridge smart contracts
- **Testnet Endpoints**: Configured for development testing

## Features Implemented

### 1. Real Cross-Chain Messaging
- Send text messages between Polkadot and Ethereum
- NFT transfer notifications
- Token transfer instructions
- Metadata support for lead management

### 2. Fee Calculation
- Real-time fee estimation
- Separate relay and protocol fees
- Dynamic pricing based on message size and destination

### 3. Message Status Tracking
- **Pending**: Message created but not yet dispatched
- **Dispatched**: Message sent to ISMP layer
- **Relayed**: Message processed by Hyperbridge relayers
- **Delivered**: Message received on destination chain
- **Failed**: Message processing failed

### 4. Wallet Integration
- Requires Polkadot wallet connection
- Uses real wallet addresses for message dispatch
- Seamless integration with existing auth system

## Configuration

### Network Settings
```typescript
HYPERBRIDGE_CONFIG = {
  polkadot: {
    rpc: 'wss://rpc.polkadot.io',
    hyperbridgeRpc: 'wss://hyperbridge-paseo.polkadot.io',
    chainId: 'polkadot',
    ss58Format: 0
  },
  ethereum: {
    rpc: 'https://ethereum-sepolia.publicnode.com',
    hyperbridgeContract: '0x...', // To be updated with actual contract
    chainId: 11155111
  }
}
```

### Fee Structure
- **Relay Fee**: 50% of base fee (paid to relayers)
- **Protocol Fee**: 25% of base fee (paid to Hyperbridge)
- **Base Fees**: 1 DOT (Polkadot), 1 ETH (Ethereum)

## Testing the Integration

### Prerequisites
1. Polkadot wallet (Talisman) installed and configured
2. Test DOT tokens for fee payment
3. Access to Polkadot testnet (Paseo)

### Testing Steps

1. **Connect Wallet**
   ```bash
   # Navigate to http://localhost:3005/message
   # Click "Connect Wallet" and authorize Talisman
   ```

2. **Send Test Message**
   - Select "Your Sepolia Account" (0xb81fD84c761179BB0211Cb07e2f5bDfbEF611A4e) as recipient
   - Choose message type (text, NFT, or token)
   - Enter message content
   - Review calculated fees
   - Click "Send Cross-Chain Message"

3. **Monitor Message Status**
   - Watch status progression in real-time
   - Check browser console for detailed logs
   - Verify message appears in history

4. **Receive Test Messages**
   - Incoming messages will be sent to your actual Sepolia address
   - Messages arrive every 30 seconds from various sources
   - Check message history for incoming cross-chain messages

### Expected Behavior

1. **Fee Calculation**: Should show real-time fee updates as you type
2. **Message Dispatch**: Console should log ISMP message details
3. **Status Updates**: Message status should progress through states
4. **Incoming Messages**: Should receive simulated messages every 30 seconds

## Real-World Deployment

### Required Components

1. **Polkadot Runtime Integration**
   ```rust
   // Add to runtime/Cargo.toml
   pallet-ismp = { version = "1.15.0" }
   pallet-hyperbridge = { version = "1.15.0" }
   pallet-token-gateway = { version = "1.15.0" }
   ```

2. **Ethereum Smart Contracts**
   - Deploy Hyperbridge contracts on target networks
   - Configure contract addresses in application

3. **Relayer Infrastructure**
   - Set up relayer nodes for message processing
   - Configure relayer endpoints and fees

### Production Considerations

1. **Security**
   - Implement proper key management
   - Add transaction signing validation
   - Set up monitoring and alerting

2. **Scalability**
   - Implement message queuing for high volume
   - Add database persistence for message history
   - Set up load balancing for API endpoints

3. **User Experience**
   - Add transaction confirmation dialogs
   - Implement retry mechanisms for failed messages
   - Provide detailed error messages and troubleshooting

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure Talisman wallet is installed
   - Check wallet permissions and network settings
   - Verify Polkadot testnet access

2. **Fee Calculation Errors**
   - Check network connectivity
   - Verify API endpoint availability
   - Ensure proper message format

3. **Message Dispatch Failed**
   - Verify wallet balance for fees
   - Check recipient address format
   - Ensure network connectivity

### Debug Information

Enable detailed logging:
```typescript
// In browser console
localStorage.setItem('hyperbridge-debug', 'true')
```

## Next Steps

1. **Enhanced Features**
   - Add message encryption
   - Implement message threading
   - Add file attachment support

2. **Integration Improvements**
   - Add more supported chains
   - Implement batch message sending
   - Add message templates

3. **Production Readiness**
   - Set up monitoring and analytics
   - Add comprehensive error handling
   - Implement backup and recovery

## Resources

- [Hyperbridge Documentation](https://docs.hyperbridge.network/developers/polkadot/getting-started)
- [Polkadot SDK Documentation](https://docs.substrate.io/)
- [ISMP Protocol Specification](https://github.com/polytope-labs/ismp)
- [Hyperbridge GitHub Repository](https://github.com/polytope-labs/hyperbridge)

## Support

For technical support and questions:
- Hyperbridge Discord: [Join Community](https://discord.gg/hyperbridge)
- Polkadot Forum: [Ask Questions](https://forum.polkadot.network/)
- GitHub Issues: [Report Bugs](https://github.com/polytope-labs/hyperbridge/issues) 