import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import { get_all_tokens } from '@/canister/icpswap/apis';
import { get_wallet_all_token_balance } from '@/canister/icrc1/apis';
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

// contract wallet and wallet -> tokens balance
export type TokenBalanceInfo = TokenPriceInfo & { balance: string | number; usd: string | number };

export const getAllTokensAndBalance = async (
    tokenList: any[],
    connectedIdentity: ConnectedIdentity | undefined,
): Promise<TokenBalanceInfo[] | undefined> => {
    if (!tokenList?.length) return undefined;
    if (!connectedIdentity) return undefined;

    const { principal } = connectedIdentity;
    const canisters = tokenList.map((item) => item.canister_id.toString());
    try {
        const [balances, walletBalances] = await Promise.all([
            get_tokens_balance(connectedIdentity, {
                owner: principal,
            }),
            get_wallet_all_token_balance(canisters, principal),
        ]);

        const result = tokenList.map((item) => {
            const token = balances.find((t) => t.canister_id.toString() === item.canister_id.toString());
            const wallet_token = walletBalances.find((t) => t.canister_id === item.canister_id.toString());

            return {
                ...item,
                balance: token ? token.balance : 0,
                usd:
                    item.price && token
                        ? BigNumber(item.price)
                              .multipliedBy(token?.balance || 0)
                              .toFixed(2)
                        : '0',
                balance_wallet: wallet_token
                    ? BigNumber(wallet_token.balance || 0)
                          .div(BigNumber(10).pow(item.decimals))
                          .toFixed(2)
                    : 0,
                usd_wallet:
                    item.price && wallet_token
                        ? BigNumber(wallet_token.balance || 0)
                              .times(BigNumber(item.price))
                              .div(BigNumber(10).pow(item.decimals))
                              .toFixed(2)
                        : '0',
            };
        });

        return result;
    } catch (error) {
        console.error('🚀 ~ getContractTokensAndBalance ~ error:', error);
        return undefined;
    }
};
