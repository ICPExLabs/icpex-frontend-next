import { useEffect, useState } from 'react';

import { get_all_tokens } from '@/canister/icpswap/apis';
import { get_token_price_ic_by_canister_id } from '@/components/api/price';

export const useTokenPrice = (canisterId: string | undefined, decimals: number = 8) => {
    const [priceData, setPriceData] = useState<{
        price?: number;
        price_change_24h?: number;
    }>();

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
