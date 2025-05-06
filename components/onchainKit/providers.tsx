'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';
import yieldguruLogo from '../../public/images/YieldGuru Horizontal.jpeg';



export function Providers({ children, initialState }: { children: ReactNode; initialState?: any }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      initialState={initialState}
      config={{
        appearance: {
          name: 'YieldGuru', // projec name
          logo: yieldguruLogo.src, // Convert StaticImageData to string
          mode: 'auto', // or 'light', 'dark'
          theme: 'default', // or custom if you define one
        },
        wallet: {
          display: 'modal', // 📱 enable the modal ie other wallets
          termsUrl: 'https://yieldguru.network/', 
          privacyUrl: 'https://yieldguru.network/', 
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
