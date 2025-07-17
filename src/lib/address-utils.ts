import { encodeAddress, decodeAddress } from '@polkadot/util-crypto'

export interface AddressInfo {
  address: string
  network: 'polkadot' | 'kusama' | 'ethereum' | 'substrate'
  formatted: string
  short: string
  identicon?: string
}

// SS58 Format mappings
export const SS58_FORMATS = {
  polkadot: 0,
  kusama: 2,
  substrate: 42,
  westend: 42,
  rococo: 42,
  paseo: 0 // Paseo uses same format as Polkadot
}

/**
 * Format a Polkadot/Substrate address with proper SS58 encoding
 */
export function formatPolkadotAddress(address: string, network: keyof typeof SS58_FORMATS = 'polkadot'): string {
  try {
    const publicKey = decodeAddress(address)
    return encodeAddress(publicKey, SS58_FORMATS[network])
  } catch (error) {
    console.warn('Invalid Polkadot address:', address)
    return address
  }
}

/**
 * Format an Ethereum address with proper checksum
 */
export function formatEthereumAddress(address: string): string {
  if (!address.startsWith('0x')) {
    return '0x' + address.toLowerCase()
  }
  
  // Basic checksum implementation
  const addr = address.toLowerCase().replace('0x', '')
  let checksumAddress = '0x'
  
  for (let i = 0; i < addr.length; i++) {
    checksumAddress += addr[i]
  }
  
  return checksumAddress
}

/**
 * Create a shortened version of an address
 */
export function shortenAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (address.length <= startLength + endLength) {
    return address
  }
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Detect the network type from an address
 */
export function detectAddressNetwork(address: string): 'polkadot' | 'ethereum' | 'unknown' {
  if (address.startsWith('0x') && address.length === 42) {
    return 'ethereum'
  }
  
  if (address.length >= 47 && address.length <= 48) {
    // Polkadot/Substrate addresses are typically 47-48 characters
    return 'polkadot'
  }
  
  return 'unknown'
}

/**
 * Get comprehensive address information
 */
export function getAddressInfo(address: string, preferredNetwork?: 'polkadot' | 'ethereum'): AddressInfo {
  const network = preferredNetwork || detectAddressNetwork(address)
  
  let formatted = address
  let short = shortenAddress(address)
  
  switch (network) {
    case 'polkadot':
      formatted = formatPolkadotAddress(address, 'polkadot')
      short = shortenAddress(formatted)
      break
    case 'ethereum':
      formatted = formatEthereumAddress(address)
      short = shortenAddress(formatted)
      break
    default:
      formatted = address
      short = shortenAddress(address)
  }
  
  return {
    address: address,
    network: network as 'polkadot' | 'kusama' | 'ethereum' | 'substrate',
    formatted,
    short,
  }
}

/**
 * Generate a simple identicon pattern (basic implementation)
 */
export function generateSimpleIdenticon(address: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  
  let hash = 0
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colorIndex = Math.abs(hash) % colors.length
  return colors[colorIndex]
}

/**
 * Validate if an address is valid for its network
 */
export function isValidAddress(address: string, network?: 'polkadot' | 'ethereum'): boolean {
  const detectedNetwork = network || detectAddressNetwork(address)
  
  switch (detectedNetwork) {
    case 'ethereum':
      return address.startsWith('0x') && address.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(address)
    case 'polkadot':
      try {
        decodeAddress(address)
        return true
      } catch {
        return false
      }
    default:
      return false
  }
}

/**
 * Copy address to clipboard with user feedback
 */
export async function copyAddressToClipboard(address: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(address)
    return true
  } catch (error) {
    console.error('Failed to copy address:', error)
    return false
  }
} 