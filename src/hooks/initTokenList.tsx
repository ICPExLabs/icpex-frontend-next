import { useCallback, useEffect } from 'react';

import { get_tokens_query } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
// import { useAppStore } from '@/stores/app';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { isCanisterIdText } from '@/utils/principals';

import { useExecuteOnce } from './useExecuteOnce';
import { getAllTokensAndBalance, getAllTokensPrice, TokenBalanceInfo } from './useToken';

export const InitTokenList = () => {
    const { connectedIdentity } = useIdentityStore();

    const { tokenList, setTokenList, setAllTokenBalance, setTotalBalance, setContractWallet } = useTokenStore();

    const priceInit = useCallback(async () => {
        console.log('🚀 ~ priceInit ~ priceInit:', 'priceInit');
        if (!tokenList) return;

        try {
            // 一次性获取所有需要的数据
            const priceList = await getAllTokensPrice(tokenList);
            if (!priceList) return;

            let finalData: TokenBalanceInfo[] = priceList as TokenBalanceInfo[];

            if (connectedIdentity) {
                const priceListAndBalance = await getAllTokensAndBalance(priceList, connectedIdentity);
                if (priceListAndBalance) {
                    finalData = priceListAndBalance;

                    // 计算总余额
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

            // 只在最后更新一次状态
            setAllTokenBalance(finalData);
        } catch (error) {
            console.error('Failed to fetch token data:', error);
        }
    }, [tokenList, connectedIdentity, setAllTokenBalance, setTotalBalance, setContractWallet]);

    useEffect(() => {
        let pollingTimer: NodeJS.Timeout;
        let isMounted = true;

        const startPolling = async () => {
            try {
                await priceInit();
            } finally {
                if (isMounted) {
                    pollingTimer = setTimeout(startPolling, 10000);
                }
            }
        };

        startPolling();

        return () => {
            isMounted = false;
            if (pollingTimer) {
                clearTimeout(pollingTimer);
            }
        };
    }, [priceInit]);

    useExecuteOnce(() => {
        get_tokens_query().then((tokenList: TokenInfo[]) => {
            const list: TokenInfo[] = tokenList.filter((item) => {
                if (isCanisterIdText(item.canister_id.toString())) {
                    return true;
                }
            });
            setTokenList(list);
        });
    });
};
