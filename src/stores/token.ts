import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { TypeTokenPriceInfoVal } from '@/hooks/useToken';
import { isDevMode } from '@/utils/env';

export type TypeTokenBalanceVal = {
    walletBalance: string;
    contractWalletBalance: string;
};
export type TypeTokenBalance = Record<string, TypeTokenBalanceVal>;
export type TypeTokenPriceInfo = Record<string, TypeTokenPriceInfoVal>;
interface TokenStore {
    tokenList: TokenInfo[] | undefined;
    setTokenList: (tokenList: TokenInfo[]) => void;

    allTokenPrice: TypeTokenPriceInfo | undefined;
    setAllTokenPrice: (allTokenPrice: TypeTokenPriceInfo) => void;

    allTokenBalance: TypeTokenBalance;
    addAllTokenBalance: (canisterId: string, val: TypeTokenBalanceVal) => void;
    clearAllTokenBalance: () => void;

    totalBalance: number | undefined;
    computationTotalBalance: () => void;

    contractWallet: number | undefined;
    computationContractWallet: () => void;

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
        subscribeWithSelector((set, get) => ({
            tokenList: undefined,
            setTokenList: (tokenList) => set({ tokenList }),

            allTokenPrice: undefined,
            setAllTokenPrice: (allTokenPrice) => set({ allTokenPrice }),

            allTokenBalance: {},
            addAllTokenBalance: (canisterId, val: TypeTokenBalanceVal) => {
                const { allTokenBalance } = get();
                set({
                    allTokenBalance: {
                        ...allTokenBalance,
                        [canisterId]: val,
                    },
                });
            },
            clearAllTokenBalance: () => {
                set({ allTokenBalance: {} });
            },

            totalBalance: undefined,
            computationTotalBalance: () => {
                const { allTokenPrice, allTokenBalance } = get();
                const totalBalance = 0;
                Object.keys(allTokenBalance).forEach((item) => {
                    // totalBalance += Number(item.walletBalance);
                });
                // console.log('🚀 ~ subscribeWithSelector ~ totalBalance:', totalBalance);
                // set({ totalBalance });
            },

            contractWallet: undefined,
            computationContractWallet: () => {
                const { allTokenBalance } = get();
                let totalBalance = 0;
                Object.values(allTokenBalance).forEach((item) => {
                    totalBalance += Number(item.contractWalletBalance);
                });
                console.log('🚀 ~ subscribeWithSelector ~ totalBalance:', totalBalance);

                set({ totalBalance });
            },

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
