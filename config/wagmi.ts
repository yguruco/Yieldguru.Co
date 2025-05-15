import { createConfig, http } from 'wagmi';

// Define chains locally to avoid SSR issues
// const sepolia = {
//   id: 11155111,
//   name: 'Sepolia',
//   network: 'sepolia',
//   nativeCurrency: {
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18
//   },
//   rpcUrls: {
//     default: { http: ['https://rpc.sepolia.org'] },
//     public: { http: ['https://rpc.sepolia.org'] }
//   },
//   blockExplorers: {
//     default: {
//       name: 'Etherscan',
//       url: 'https://.io'
//     }
//   },
//   testnet: true
// };

const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] }
  },
  blockExplorers: {
    default: {
      name: 'Base Sepolia Explorer',
      url: 'https://sepolia-explorer.base.org'
    }
  },
  testnet: true
};

// Dynamic imports for browser-only modules
let coinbaseWallet, walletConnect, injected;

if (typeof window !== 'undefined') {
  const wagmiConnectors = require('wagmi/connectors');
  coinbaseWallet = wagmiConnectors.coinbaseWallet;
  walletConnect = wagmiConnectors.walletConnect;
  injected = wagmiConnectors.injected;
}

// Create config with Sepolia as the default chain
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: typeof window !== 'undefined' ? [
    coinbaseWallet({
      appName: 'yieldguru',
    }),
    walletConnect({
      projectId: '65119951ca43d74a2b413106ff79e1f4',
      showQrModal: true, 
    }),
    injected(),
  ] : [],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    // [baseSepolia.id]: http(),
  },
});
