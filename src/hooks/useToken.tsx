import { useMemo } from 'react';

import { get_wallet_token_balance } from '@/canister/icrc1/apis';
import { get_token_balance_of, get_tokens_balance } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { TypeTokenBalanceVal, useTokenStore } from '@/stores/token';
import { ConnectedIdentity } from '@/types/identity';

export type TypeTokenPriceInfoVal = TokenInfo & {
    feesUSD: number | undefined;
    priceUSD: number | undefined;
    priceUSDChange: number | undefined;
    standard: string | undefined;
    totalVolumeUSD: number | undefined;
    volumeUSD: number | undefined;
    volumeUSD1d: number | undefined;
    volumeUSD7d: number | undefined;
};

export const useTokenInfoByCanisterId = (canisterId: string | undefined): TypeTokenPriceInfoVal | undefined => {
    const { allTokenInfo } = useTokenStore();
    if (!canisterId || !allTokenInfo) return undefined;
    return allTokenInfo[canisterId] || undefined;
};

export const useTokenInfoBySymbol = (symbol: string | undefined): TypeTokenPriceInfoVal | undefined => {
    const { allTokenInfo, tokenList } = useTokenStore();

    return useMemo(() => {
        if (!symbol || !tokenList || !allTokenInfo) return undefined;

        const token = tokenList.find((item) => item.symbol === symbol);
        if (!token) return undefined;

        return allTokenInfo[token.canister_id.toString()] ?? undefined;
    }, [symbol, allTokenInfo, tokenList]);
};

export const useTokenBalanceByCanisterId = (canisterId: string | undefined): TypeTokenBalanceVal | undefined => {
    const { allTokenBalance } = useTokenStore();
    if (!canisterId) return undefined;
    return allTokenBalance[canisterId] || undefined;
};

export const useTokenBalanceBySymbol = (symbol: string | undefined): TypeTokenBalanceVal | undefined => {
    const { allTokenBalance, tokenList } = useTokenStore();

    return useMemo(() => {
        if (!symbol || !tokenList) return undefined;

        const token = tokenList.find((item) => item.symbol === symbol);
        if (!token) return undefined;

        return allTokenBalance[token.canister_id.toString()] ?? undefined;
    }, [symbol, allTokenBalance, tokenList]);
};

let lastRefreshTime = 0;
let isPolling = false;
export const initBalance = async (
    connectedIdentity: ConnectedIdentity | undefined,
    tokenList: TokenInfo[] | undefined,
) => {
    const { addAllTokenBalance, computationTotalBalanceAmount, allTokenBalanceFetching, setAllTokenBalanceFetching } =
        useTokenStore.getState();

    if (!connectedIdentity) return;
    if (!tokenList) return;
    if (isPolling) return;

    if (allTokenBalanceFetching) {
        console.log('🚀 ~ addAllTokenBalanceFetching ~ true');
        return;
    }

    isPolling = true;
    setAllTokenBalanceFetching(true);
    const { principal } = connectedIdentity;
    const contractBalanceRes = await get_tokens_balance(connectedIdentity, {
        owner: principal,
    });

    Promise.all(
        tokenList.map(async (item) => {
            const contractBalance = contractBalanceRes[item.canister_id.toString()];
            const walletBalance = await get_wallet_token_balance(item.canister_id.toString(), principal);

            const res: TypeTokenBalanceVal = {
                walletBalance: walletBalance,
                contractWalletBalance: contractBalance,
            };
            addAllTokenBalance(item.canister_id.toString(), res);
        }),
    ).finally(() => {
        // setAllTokenBalanceFetching(false);
        // computationTotalBalanceAmount();

        // setTimeout(() => {
        //     if (connectedIdentity && tokenList) {
        //         console.log('🚀 ~ refreshBalance ~ refreshBalance');
        //         initBalance(connectedIdentity, tokenList);
        //     }
        // }, 5000);

        lastRefreshTime = Date.now();
        isPolling = false;
        setAllTokenBalanceFetching(false);
        computationTotalBalanceAmount();

        const poll = () => {
            const now = Date.now();
            const elapsed = now - lastRefreshTime;

            if (elapsed >= 15000 && !document.hidden) {
                console.log('🚀 ~ refreshBalance ~ refreshBalance');
                initBalance(connectedIdentity, tokenList);
            } else {
                requestAnimationFrame(poll);
            }
        };

        requestAnimationFrame(poll);
    });
};

export const updateBalance = async (connectedIdentity: ConnectedIdentity, canisterId: string) => {
    try {
        const { principal } = connectedIdentity;
        const [contractBalanceRes, walletBalance] = await Promise.all([
            get_token_balance_of(connectedIdentity, {
                canisterId: canisterId,
                owner: principal,
            }),
            get_wallet_token_balance(canisterId, principal),
        ]);
        return {
            walletBalance,
            contractWalletBalance: contractBalanceRes,
        };
    } catch (error) {
        console.error(`Failed to update balance for canister ${canisterId}:`, error);
        throw error;
    }
};
