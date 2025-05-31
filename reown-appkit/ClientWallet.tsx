'use client';

import dynamic from 'next/dynamic';

// Dynamically import the WalletComponents with no SSR
const WalletComponentsNoSSR = dynamic(
  () => import('./wallet').then(mod => ({ default: mod.WalletComponents })),
  { ssr: false }
);

export default function ClientWallet() {
  return <WalletComponentsNoSSR />;
} 