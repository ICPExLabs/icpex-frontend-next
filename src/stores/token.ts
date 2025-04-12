import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { TokenBalanceInfo } from '@/hooks/useToken';
import { isDevMode } from '@/utils/env';

interface TokenStore {
    tokenList: TokenInfo[] | undefined;
    setTokenList: (tokenList: TokenInfo[]) => void;

    allTokenBalance: TokenBalanceInfo[];
    setAllTokenBalance: (allTokenBalance: TokenBalanceInfo[]) => void;

    totalBalance: number | undefined;
    setTotalBalance: (totalBalance: number) => void;

    contractWallet: number | undefined;
    setContractWallet: (contractWallet: number) => void;

    showSendModal: boolean;
    setShowSendModal: (show: boolean) => void;

    showReceiveModal: boolean;
    setShowReceiveModal: (show: boolean) => void;

    showTransferInModal: boolean;
    setShowTransferInModal: (show: boolean) => void;

    showTransferOutModal: boolean;
    setShowTransferOutModal: (show: boolean) => void;
}

const STORE_NAME = 'TokenStore';
const isDev = isDevMode();

export const useTokenStore = create<TokenStore>()(
    devtools(
        subscribeWithSelector((set) => ({
            tokenList: undefined,
            setTokenList: (tokenList) => set({ tokenList }),

            allTokenBalance: [],
            setAllTokenBalance: (allTokenBalance) => set({ allTokenBalance }),

            totalBalance: undefined,
            setTotalBalance: (totalBalance) => set({ totalBalance }),

            contractWallet: undefined,
            setContractWallet: (contractWallet) => set({ contractWallet }),

            showSendModal: false,
            setShowSendModal: (show) => set({ showSendModal: show }),

            showReceiveModal: false,
            setShowReceiveModal: (show) => set({ showReceiveModal: show }),

            showTransferInModal: false,
            setShowTransferInModal: (show) => set({ showTransferInModal: show }),

            showTransferOutModal: false,
            setShowTransferOutModal: (show) => set({ showTransferOutModal: show }),
        })),
        {
            enabled: isDev,
            name: STORE_NAME,
        },
    ),
);

// Devtools setup
if (isDev) {
    mountStoreDevtool(STORE_NAME, useTokenStore);
}
