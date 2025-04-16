import BigNumber from 'bignumber.js';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { TypeTokenPriceInfoVal, updateBalance } from '@/hooks/useToken';
import { ConnectedIdentity } from '@/types/identity';
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

    allTokenInfo: TypeTokenPriceInfo | undefined;
    setAllTokenInfo: (allTokenInfo: TypeTokenPriceInfo) => void;

    allTokenBalance: TypeTokenBalance;
    addAllTokenBalance: (canisterId: string, val: TypeTokenBalanceVal) => void;
    updateAllTokenBalance: (connectedIdentity: ConnectedIdentity, canisterId: string) => void;
    clearAllTokenBalance: () => void;

    totalBalance: number | undefined;
    totalContractBalance: number | undefined;
    computationTotalBalanceAmount: () => void;

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

            allTokenInfo: undefined,
            setAllTokenInfo: (allTokenInfo) => set({ allTokenInfo }),

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
            updateAllTokenBalance: async (connectedIdentity: ConnectedIdentity, canisterId: string) => {
                const { allTokenBalance, addAllTokenBalance, computationTotalBalanceAmount } = get();
                const newBalance = { ...allTokenBalance };
                delete newBalance[canisterId];
                set({
                    allTokenBalance: newBalance,
                });

                const data = await updateBalance(connectedIdentity, canisterId);
                addAllTokenBalance(canisterId, data);
                computationTotalBalanceAmount();
            },
            clearAllTokenBalance: () => {
                set({ allTokenBalance: {} });
            },

            totalBalance: undefined,
            totalContractBalance: undefined,
            computationTotalBalanceAmount: () => {
                const { allTokenInfo, allTokenBalance } = get();
                if (!allTokenInfo) return;

                let totalBalance = 0;
                let totalContractBalance = 0;

                Object.keys(allTokenBalance).forEach((item) => {
                    const info = allTokenInfo[item];

                    totalBalance =
                        totalBalance +
                        Number(
                            new BigNumber(allTokenBalance[item].walletBalance).dividedBy(
                                new BigNumber(10).pow(new BigNumber(info.decimals)),
                            ),
                        ) *
                            (info?.priceUSD || 0);
                    totalContractBalance =
                        totalContractBalance +
                        Number(
                            new BigNumber(allTokenBalance[item].contractWalletBalance).dividedBy(
                                new BigNumber(10).pow(new BigNumber(info.decimals)),
                            ),
                        ) *
                            (info?.priceUSD || 0);
                });
                console.log('🚀 ~ subscribeWithSelector ~ totalBalance:', totalBalance);
                console.log('🚀 ~ subscribeWithSelector ~ totalContractBalance:', totalContractBalance);

                set({ totalBalance: totalBalance, totalContractBalance: totalContractBalance });
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
