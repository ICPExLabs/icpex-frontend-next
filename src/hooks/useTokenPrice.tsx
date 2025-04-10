import { useEffect, useState } from 'react';

import { get_all_tokens } from '@/canister/icpswap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { get_token_price_ic, get_token_price_ic_by_canister_id } from '@/components/api/price';
import { useTokenStore } from '@/stores/token';

export type TypeTokenPrice = {
    price?: number;
    price_change_24h?: number;
};
export const useTokenPrice = (canisterId: string | undefined, decimals: number = 8) => {
    const [priceData, setPriceData] = useState<TypeTokenPrice>();

    useEffect(() => {
        if (!canisterId) {
            setPriceData(undefined);
            return;
        }

        const fetchData = async () => {
            try {
                let res: { price?: number; price_change_24h?: number } | undefined;

                const backupData = await get_token_price_ic_by_canister_id(canisterId);
                if (!backupData || !backupData.price) {
                    const tokenList = await get_all_tokens();
                    const matchedToken = tokenList.find((item) => item.address === canisterId);
                    if (matchedToken) {
                        res = {
                            price: Number(matchedToken.priceUSD.toFixed(decimals)),
                            price_change_24h: backupData?.price_change_24h
                                ? Number(backupData.price_change_24h)
                                : undefined,
                        };
                    }
                } else {
                    res = {
                        price: backupData.price ? Number(Number(backupData.price).toFixed(decimals)) : undefined,
                        price_change_24h: backupData.price_change_24h ? Number(backupData.price_change_24h) : undefined,
                    };
                }

                setPriceData(res || undefined);
            } catch (error) {
                console.error('Failed to fetch token price:', error);
                setPriceData(undefined);
            }
        };

        fetchData();
    }, [canisterId, decimals]);

    return priceData;
};

export type TokenPrice = {
    price?: number;
    price_change_24h?: number;
};

export type TokenPriceInfo = TokenPrice & TokenInfo;

export const useAllTokenPriceAndChange = () => {
    const { tokenList } = useTokenStore();
    const [priceData, setPriceData] = useState<TokenPriceInfo[] | undefined>();

    useEffect(() => {
        if (!tokenList?.length) {
            setPriceData(undefined);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch all price
                const allTokenPrices = await get_token_price_ic();

                const results = tokenList.map((token) => {
                    const canisterId = token.canister_id.toString();
                    const matchedToken = allTokenPrices.find((item) => item.canister_id === canisterId);

                    return {
                        ...token,
                        price: matchedToken?.price ? Number(matchedToken.price) : undefined,
                        price_change_24h: matchedToken?.price_change_24h
                            ? Number(matchedToken.price_change_24h)
                            : undefined,
                    };
                });

                setPriceData(results);
            } catch (error) {
                console.error('Failed to fetch token prices:', error);
                setPriceData([]);
            }
        };

        fetchData();
    }, [tokenList]);

    return priceData;
};

// todo user token price and balance
