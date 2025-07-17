import { NextRequest, NextResponse } from 'next/server';
import { searchWallets, WalletBalance } from '@/lib/bigquery';

// Helper function to format BigQuery dates
function formatDate(date: any): string {
  if (typeof date === 'object' && date.value) {
    return date.value;
  }
  return typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
}

// Helper function to transform wallet data
function transformWallet(wallet: WalletBalance) {
  return {
    id: wallet.accId,
    address: wallet.accId,
    publicKey: wallet.acc_pubKey,
    balance: wallet.free,
    balanceUsd: wallet.free_usd,
    reserved: wallet.reserved,
    reservedUsd: wallet.reserved_usd,
    frozen: wallet.frozen,
    frozenUsd: wallet.frozen_usd,
    miscFrozen: wallet.misc_frozen,
    miscFrozenUsd: wallet.misc_frozen_usd,
    asset: wallet.asset,
    decimals: wallet.decimals,
    price: wallet.price,
    chain: wallet.chain,
    relay: wallet.relay,
    blockDate: formatDate(wallet.block_date),
    // Additional fields for frontend compatibility
    transactionCount: 0, // Not available in current schema
    lastActivity: formatDate(wallet.block_date),
    isStaking: wallet.frozen > 0, // Assume frozen balance indicates staking
    kycStatus: 'Unknown',
    poapCount: 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const minBalance = searchParams.get('minBalance');
    const maxBalance = searchParams.get('maxBalance');
    const asset = searchParams.get('asset') || 'DOT';
    const chain = searchParams.get('chain') || 'polkadot';
    const limit = searchParams.get('limit') || '100';

    // Build filters object
    const filters = {
      asset,
      chain,
      limit: parseInt(limit, 10),
      ...(minBalance && { minBalance: parseFloat(minBalance) }),
      ...(maxBalance && { maxBalance: parseFloat(maxBalance) }),
    };

    // Query BigQuery
    const wallets = await searchWallets(filters);

    // Transform data to match frontend expectations
    const transformedWallets = wallets.map(transformWallet);

    return NextResponse.json({
      success: true,
      data: transformedWallets,
      count: transformedWallets.length,
      filters: filters,
    });

  } catch (error) {
    console.error('Search wallets API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      data: [],
      count: 0,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Parse request body
    const {
      minBalance,
      maxBalance,
      asset = 'DOT',
      chain = 'polkadot',
      limit = 100,
    } = body;

    // Build filters object
    const filters = {
      asset,
      chain,
      limit,
      ...(minBalance && { minBalance: parseFloat(minBalance) }),
      ...(maxBalance && { maxBalance: parseFloat(maxBalance) }),
    };

    // Query BigQuery
    const wallets = await searchWallets(filters);

    // Transform data to match frontend expectations
    const transformedWallets = wallets.map(transformWallet);

    return NextResponse.json({
      success: true,
      data: transformedWallets,
      count: transformedWallets.length,
      filters: filters,
    });

  } catch (error) {
    console.error('Search wallets API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      data: [],
      count: 0,
    }, { status: 500 });
  }
} 