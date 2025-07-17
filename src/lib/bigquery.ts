import { BigQuery } from '@google-cloud/bigquery';

// BigQuery configuration
const bigquery = new BigQuery({
  projectId: 'parity-data-infra',
  location: 'europe-west3',
});

export const BIGQUERY_CONFIG = {
  projectId: 'parity-data-infra',
  datasetId: 'w3s_hackathon',
  tableId: 'balances_polkadot_polkadot',
  location: 'europe-west3',
};

// TypeScript interfaces matching the actual BigQuery schema
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

export interface SearchFilters {
  minBalance?: number;
  maxBalance?: number;
  asset?: string;
  chain?: string;
  limit?: number;
}

// Function to search wallets based on filters
export async function searchWallets(filters: SearchFilters = {}): Promise<WalletBalance[]> {
  const {
    minBalance,
    maxBalance,
    asset = 'DOT',
    chain = 'polkadot',
    limit = 100
  } = filters;

  let query = `
    SELECT 
      accId,
      acc_pubKey,
      asset,
      decimals,
      price,
      free,
      reserved,
      frozen,
      misc_frozen,
      free_usd,
      reserved_usd,
      frozen_usd,
      misc_frozen_usd,
      chain,
      relay,
      block_date
    FROM \`${BIGQUERY_CONFIG.projectId}.${BIGQUERY_CONFIG.datasetId}.${BIGQUERY_CONFIG.tableId}\`
    WHERE asset = @asset
      AND chain = @chain
  `;

  const queryParams: any = {
    asset,
    chain,
  };

  // Add balance filters if provided
  if (minBalance !== undefined && minBalance > 0) {
    query += ` AND free >= @minBalance`;
    queryParams.minBalance = minBalance;
  }

  if (maxBalance !== undefined && maxBalance > 0) {
    query += ` AND free <= @maxBalance`;
    queryParams.maxBalance = maxBalance;
  }

  // Order by free balance descending and limit results
  query += ` ORDER BY free DESC LIMIT @limit`;
  queryParams.limit = limit;

  const options = {
    query,
    params: queryParams,
    location: BIGQUERY_CONFIG.location,
  };

  try {
    const [rows] = await bigquery.query(options);
    return rows as WalletBalance[];
  } catch (error) {
    console.error('BigQuery error:', error);
    throw new Error('Failed to fetch wallet data from BigQuery');
  }
}

export default bigquery; 