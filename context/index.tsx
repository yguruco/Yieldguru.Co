'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { baseSepolia } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'yieldguru',
  description: 'Yield Guru Investments is pioneering a crowd investing platform into E-mobility assets with quarterly yields. Get fractional ownership in public transport E-Buses, taxi EVs, and our network of charging stations.',
  url: 'https://www.yieldguru.co/', 
  icons: ['https://www.yieldguru.co/images/yg-logo.png']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia ],
  defaultNetwork: baseSepolia,
  enableCoinbase: true,
  coinbasePreference: "smartWalletOnly",
  enableNetworkSwitch: false,
  enableWalletGuide: true, 
  metadata: metadata,
  themeMode: 'light', 
  themeVariables: {
    '--w3m-accent': '#4f1964',           // Purple as primary accent
    '--w3m-color-mix': '#fbdc3e',        // Yellow for color mixing
    '--w3m-color-mix-strength': 15,      // 15% blend strength
    '--w3m-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '--w3m-font-size-master': '12px',    // Base font size
    '--w3m-border-radius-master': '2px', // Rounded corners
    '--w3m-z-index': 1000                // Modal z-index
  },
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    connectMethodsOrder: ["email","social","wallet"], 
    collapseWallets: true, // Optional - defaults to false
    onramp: false,
    pay: false,
    send: false,
    swaps: false,
    receive: true,
    history: false,
    emailShowWallets: false
    
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider