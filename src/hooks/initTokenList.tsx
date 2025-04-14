import { useCallback, useEffect, useState } from 'react';

import { get_tokens_query } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { isCanisterIdText } from '@/utils/principals';

import { useExecuteOnce } from './useExecuteOnce';
import { getAllTokensAndBalance, getAllTokensPrice, TokenBalanceInfo } from './useToken';

export const useInitTokenList = () => {
    const { connectedIdentity } = useIdentityStore();
    const { setTokenList, setAllTokenBalance, setTotalBalance, setContractWallet, setForceRefreshAllTokenBalance } =
        useTokenStore();
    const [isInitializing, setIsInitializing] = useState<boolean | undefined>(undefined);

    const init = useCallback(
        async (tokenList) => {
            if (!tokenList) return;
            if (isInitializing) return;

            setIsInitializing(true);
            try {
                const priceList = await getAllTokensPrice(tokenList);
                if (!priceList) return;

                let finalData: TokenBalanceInfo[] = priceList as TokenBalanceInfo[];

                if (connectedIdentity) {
                    const priceListAndBalance = await getAllTokensAndBalance(priceList, connectedIdentity);
                    if (priceListAndBalance) {
                        finalData = priceListAndBalance;

                        let usd = 0;
                        let usd_contract = 0;
                        priceListAndBalance.forEach((item) => {
                            usd += item.usd_wallet || 0;
                            usd_contract += item.usd_wallet_contract || 0;
                        });
                        setTotalBalance(usd);
                        setContractWallet(usd_contract);
                    }
                }

                setAllTokenBalance(finalData);
            } catch (error) {
                console.error('Failed to fetch token data:', error);
            } finally {
                setIsInitializing(false);
            }
        },
        [connectedIdentity, isInitializing, setAllTokenBalance, setContractWallet, setTotalBalance],
    );

    useExecuteOnce(() => {
        get_tokens_query().then((tokenList: TokenInfo[]) => {
            const list: TokenInfo[] = tokenList.filter((item) => {
                if (isCanisterIdText(item.canister_id.toString())) {
                    return true;
                }
            });
            setTokenList(list);
            init(tokenList);
        });
    });

    const forceRefresh = useCallback(
        (tokenList: TokenInfo[]) => {
            console.log('🚀 ~ forceRefresh ~:');
            init(tokenList);
        },
        [init],
    );

    useEffect(() => {
        setForceRefreshAllTokenBalance(() => forceRefresh); // 注册到store
    }, [forceRefresh, setForceRefreshAllTokenBalance]);

    return {
        refreshing: init,
        isInitializing,
    };
};
