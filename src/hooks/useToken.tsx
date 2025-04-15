import { useMemo } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

import { get_wallet_token_balance } from '@/canister/icrc1/apis';
import { get_tokens_balance } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { TypeTokenBalance, TypeTokenBalanceVal, useTokenStore } from '@/stores/token';

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
    const { allTokenPrice } = useTokenStore();
    if (!canisterId || !allTokenPrice) return undefined;
    return allTokenPrice[canisterId] || undefined;
};

export const useTokenInfoBySymbol = (symbol: string | undefined): TypeTokenPriceInfoVal | undefined => {
    const { allTokenPrice, tokenList } = useTokenStore();

    return useMemo(() => {
        if (!symbol || !tokenList || !allTokenPrice) return undefined;

        const token = tokenList.find((item) => item.symbol === symbol);
        if (!token) return undefined;

        return allTokenPrice[token.canister_id.toString()] ?? undefined;
    }, [symbol, allTokenPrice, tokenList]);
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

export const initBalance = async (connectedIdentity, tokenList) => {
    const addAllTokenBalance = useTokenStore.getState().addAllTokenBalance;

    if (!connectedIdentity) return;
    if (!tokenList) return;

    const { principal } = connectedIdentity;
    const contractBalanceRes = await get_tokens_balance(connectedIdentity, {
        owner: principal,
    });

    // addAllTokenBalance;
    tokenList.forEach(async (item) => {
        const contractBalance = contractBalanceRes[item.canister_id.toString()];
        const walletBalance = await get_wallet_token_balance(item.canister_id.toString(), principal);

        const res: TypeTokenBalanceVal = {
            walletBalance: walletBalance,
            contractWalletBalance: contractBalance,
        };
        addAllTokenBalance(item.canister_id.toString(), res);
    });
};
