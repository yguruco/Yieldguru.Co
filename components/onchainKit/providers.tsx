'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';
import yieldguruLogo from '../../public/images/logo.jpeg';



export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          name: 'YieldGuru', // projec name
          logo: yieldguruLogo.src, // Convert StaticImageData to string
          mode: 'dark', // or 'light', 'dark'
          theme: 'cyberpunk', // or custom if you define one
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
