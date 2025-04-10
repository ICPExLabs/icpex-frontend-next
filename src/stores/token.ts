import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { TokenBalanceInfo } from '@/hooks/useTokenPrice';
import { isDevMode } from '@/utils/env';

interface TokenStore {
    tokenList: TokenInfo[] | undefined;
    setTokenList: (tokenList: TokenInfo[]) => void;

    allTokenBalance: TokenBalanceInfo[];
    setAllTokenBalance: (allTokenBalance: TokenBalanceInfo[]) => void;
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
