'use client';

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownBasename,
    WalletDropdownFundLink,
} from '@coinbase/onchainkit/wallet';
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';

export function WalletComponents() {
    return (
        <div className="flex justify-end">
            <Wallet>
                {/* Login button - using purple background with yellow text */}
                <ConnectWallet
                    className="w-full rounded-full bg-[#4f1964] text-[#fbdc3e] font-semibold py-3 px-6 hover:bg-[#3b1149] transition-all duration-300 shadow-md border border-[#fbdc3e]/20"
                    disconnectedLabel="Login"
                >
                    {/* Connected state - displays user info */}
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-full border-2 border-[#f68b27]" />
                        <Name className="text-[#fbdc3e] text-sm font-medium" />
                    </div>
                </ConnectWallet>

                {/* Dropdown menu styling */}
                <WalletDropdown className="bg-[#4f1964]/95 border border-[#fbdc3e]/30 rounded-xl shadow-lg overflow-hidden">
                    {/* User identity section */}
                    <Identity
                        className="px-4 pt-4 pb-3 border-b border-[#fbdc3e]/20"
                        hasCopyAddressOnClick
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-12 w-12 rounded-full border-2 border-[#f68b27]" />
                            <div>
                                <Name className="text-[#fbdc3e] font-medium text-lg" />
                                <Address className="text-white/70 text-xs" />
                            </div>
                        </div>
                        <EthBalance className="text-[#fbdc3e] font-medium text-lg" />
                    </Identity>
                    
                    {/* Menu items with consistent styling */}
                    <div className="p-2">
                        <WalletDropdownBasename className="px-3 py-2 text-white hover:bg-[#3b1149] rounded-lg transition-colors duration-200" />
                        <WalletDropdownFundLink className="px-3 py-2 text-white hover:bg-[#3b1149] rounded-lg transition-colors duration-200" />
                        <WalletDropdownDisconnect className="mt-1 w-full px-3 py-2 text-[#f68b27] font-medium hover:bg-[#3b1149] rounded-lg transition-colors duration-200" />
                    </div>
                </WalletDropdown>
            </Wallet>
        </div>
    );
}