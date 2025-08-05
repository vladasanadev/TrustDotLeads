PolkaLeads is a blockchain-driven CRM tool for Web2 marketing agencies that enhances lead generation by integrating Polkadot’s cross-chain messaging (via XMTP) and utilizing DotLake’s BigQuery tables for wallet filtration. This provides agencies with more targeted and reliable leads by leveraging the rich, on-chain data of the Polkadot ecosystem.


**Integration with Polkadot**

PolkaLeads utilizes Polkadot’s multi-chain ecosystem to access and filter real-time wallet data, ensuring that marketing agencies can target high-value leads. The integration leverages:

XMTP for decentralized communication between applications.

DotLake BigQuery for real-time on-chain analytics, improving lead identification.

Scalable Infrastructure via Polkadot parachains for seamless, high-performance operation.

Shared Security to ensure data integrity and reliability.

On-Chain Governance for maintaining transparency and decision-making.

### Current Implementation Status



- **Polkadot**: Connected to Paseo testnet (`wss://paseo-rpc.polkadot.io`)
- **Real-time Status**: Live blockchain connection monitoring
- **Dynamic Fees**: Real-time gas price-based fee calculation

### 🔧 How Cross-Chain Messaging Works

1. **Message Composition**: Create marketing messages in the UI
2. **ISMP Protocol**: Messages are structured according to Hyperbridge's ISMP specification
3. **Testnet Dispatch**: Messages are dispatched to real testnets (simulation mode for now)
4. **Status Tracking**: Real-time message status updates
5. **Cross-Chain Delivery**: Messages delivered to destination addresses

### 📱 How to Receive Messages on Testnet

To receive cross-chain messages on your testnet accounts:

#### For Sepolia (Ethereum) Users:
1. **Get Sepolia Address**: Use your MetaMask or any Ethereum wallet on Sepolia testnet
2. **Add to Leads**: Add your Sepolia address to the leads database
3. **Monitor**: Messages sent to your address will appear in the message history
4. **Explorer**: Check Sepolia Etherscan for transaction confirmations

#### For Paseo (Polkadot) Users:
1. **Get Paseo Address**: Use Polkadot.js extension or Talisman wallet
2. **Switch Network**: Connect to Paseo testnet
3. **Add to Leads**: Add your Paseo address to the leads database
4. **Monitor**: Messages will appear in your message history
5. **Explorer**: Check Paseo Subscan for transaction confirmations

### 🚀 Real Testnet Integration Features

- **Live Blockchain Connections**: Real connections to Paseo and Sepolia
- **Dynamic Fee Calculation**: Based on current network conditions
- **Block Monitoring**: Real-time block number tracking
- **Event Subscription**: Listening for real ISMP events (when available)
- **Explorer Links**: Direct links to transaction explorers

### 🔮 Future Real Implementation

For full production deployment, you would need:

1. **Funded Accounts**: Testnet tokens for transaction fees
2. **pallet-ismp Deployment**: ISMP pallet deployed on target chains
3. **Hyperbridge Contracts**: Deployed Hyperbridge contracts on Ethereum
4. **Message Signing**: Proper transaction signing with user accounts
5. **Relayer Network**: Active relayers for message delivery

```

### 📊 Message Flow

1. **User Action**: Compose message in PolkaLeads UI
2. **ISMP Creation**: Message structured as DispatchPost
3. **Blockchain Dispatch**: Submitted to source chain (Polkadot/Ethereum)
4. **Proof Generation**: Consensus proofs generated
5. **Destination Delivery**: Message delivered to destination chain
6. **Status Update**: UI updated with delivery confirmation

### 🎯 Marketing Use Cases

- **Cross-Chain Campaigns**: Send marketing messages across different ecosystems
- **Token Announcements**: Notify users about new token launches
- **NFT Drops**: Alert users about exclusive NFT collections
- **DeFi Opportunities**: Share yield farming and staking opportunities
- **Community Updates**: Keep users informed about project developments

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Connect Wallet**: Use Talisman or MetaMask to connect
4. **Add Leads**: Add testnet addresses to your leads database
5. **Send Messages**: Compose and send cross-chain marketing messages
6. **Monitor Status**: Check the testnet status display for live connections

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Features

- ✅ **Dashboard**: Lead analytics and statistics
- ✅ **Search**: BigQuery integration for wallet discovery
- ✅ **Leads Management**: CRM functionality
- ✅ **Analytics**: Charts and insights
- ✅ **Cross-Chain Messaging**: Hyperbridge ISMP integration
- ✅ **Real Testnet Connections**: Live blockchain monitoring
- ✅ **Authentication**: Wallet and Google OAuth support

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Blockchain**: Polkadot.js, Ethers.js, Hyperbridge ISMP
- **Authentication**: Talisman Wallet, Google OAuth
- **Database**: BigQuery (Google Cloud)
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with testnets
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Note**: This is a testnet implementation for demonstration purposes. For production use, ensure proper security audits and mainnet deployment procedures.
