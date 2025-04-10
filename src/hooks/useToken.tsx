import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import { get_all_tokens } from '@/canister/icpswap/apis';
import { get_tokens_balance } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { get_token_price_ic } from '@/components/api/price';
import { useTokenStore } from '@/stores/token';
import { ConnectedIdentity } from '@/types/identity';

export const useTokenInfoAndBalanceByCanisterId = (canisterId: string | undefined) => {
    const { allTokenBalance } = useTokenStore();
    const [priceData, setPriceData] = useState<TokenBalanceInfo | undefined>(undefined);

    useEffect(() => {
        if (allTokenBalance && canisterId) {
            allTokenBalance.map((item) => {
                if (item.canister_id.toString() === canisterId) {
                    setPriceData(item);
                }
            });
        }
    }, [canisterId, allTokenBalance]);

    return priceData;
};

export const useTokenInfoAndBalanceBySymbol = (symbol: string | undefined) => {
    const { allTokenBalance } = useTokenStore();
    const [priceData, setPriceData] = useState<TokenBalanceInfo | undefined>(undefined);

    useEffect(() => {
        if (allTokenBalance && symbol) {
            allTokenBalance.map((item) => {
                if (item.symbol === symbol) {
                    setPriceData(item);
                }
            });
        }
    }, [symbol, allTokenBalance]);

    return priceData;
};

export type TagType = 'ICRC-1' | 'ICRC-2';
export type TokenPrice = {
    standard?: TagType;
    price?: number;
    price_change_24h?: number;
};

export type TokenPriceInfo = TokenPrice & TokenInfo;

export const getAllTokensPrice = async (tokenList: TokenInfo[]) => {
    if (!tokenList?.length) {
        return undefined;
    }

    try {
        const [allTokenPrices, allTokenList] = await Promise.all([get_token_price_ic(), get_all_tokens()]);

        const results = tokenList.map((token) => {
            const canisterId = token.canister_id.toString();
            const matchedToken = allTokenPrices.find((item) => item.canister_id === canisterId);
            const matchedToken2 = allTokenList.find((item) => item.address === canisterId);

            const common = {
                ...token,
                standard: matchedToken2?.standard || '',
            };
            if (!matchedToken) {
                return {
                    ...common,
                    price: matchedToken2?.priceUSD ? Number(matchedToken2?.priceUSD) : undefined,
                    price_change_24h: matchedToken2?.priceUSDChange ? Number(matchedToken2.priceUSDChange) : undefined,
                };
            }

            return {
                ...common,
                price: matchedToken?.price ? Number(matchedToken?.price) : undefined,
                price_change_24h: matchedToken?.price_change_24h ? Number(matchedToken.price_change_24h) : undefined,
            };
        });

        return results;
    } catch (error) {
        console.error('Failed to fetch token prices:', error);
        return [];
    }
};

// contract wallet -> tokens balance
export type TokenBalanceInfo = TokenPriceInfo & { balance: string | number; usd: string | number };

export const getAllTokensAndBalance = async (
    tokenList: any[],
    connectedIdentity: ConnectedIdentity | undefined,
): Promise<TokenBalanceInfo[] | undefined> => {
    if (!tokenList?.length) return undefined;
    if (!connectedIdentity) return undefined;

    const { principal } = connectedIdentity;

    try {
        const balances = await get_tokens_balance(connectedIdentity, {
            owner: principal,
        });

        const result = tokenList.map((item) => {
            const token = balances.find((token) => token.canister_id === item.canister_id.toString());

            if (token) {
                return {
                    ...item,
                    balance: token.balance,
                    usd: item.price ? BigNumber(item.price).multipliedBy(token.balance).toFixed(2) : '0',
                };
            }

            return {
                ...item,
                balance: 0,
                usd: 0,
            };
        });

        return result;
    } catch (error) {
        console.error('🚀 ~ getContractTokensAndBalance ~ error:', error);
        return undefined;
    }
};
