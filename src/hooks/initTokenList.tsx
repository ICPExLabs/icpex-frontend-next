import { useCallback, useEffect } from 'react';

import { get_tokens_query } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useAppStore } from '@/stores/app';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';

import { useExecuteOnce } from './useExecuteOnce';
import { getAllTokensAndBalance, getAllTokensPrice } from './useToken';

export const InitTokenList = () => {
    const { connectedIdentity } = useIdentityStore();

    const { tokenList, setTokenList, setAllTokenBalance } = useTokenStore();
    const { walletMode } = useAppStore();

    const priceInit = useCallback(async () => {
        if (!tokenList) return;

        setAllTokenBalance(tokenList);
        try {
            const priceList = await getAllTokensPrice(tokenList);
            if (priceList) {
                setAllTokenBalance(priceList);

                if (connectedIdentity) {
                    const priceListAndBalance = await getAllTokensAndBalance(priceList, connectedIdentity);
                    setAllTokenBalance(priceListAndBalance);
                }
            }
        } catch (error) {
            console.error('Failed to fetch token data:', error);
        }
    }, [tokenList, setAllTokenBalance, connectedIdentity]);

    useEffect(() => {
        priceInit();
    }, [walletMode, priceInit]);

    useExecuteOnce(() => {
        get_tokens_query().then((tokenList: TokenInfo[]) => {
            setTokenList(tokenList);
        });
    });
};
