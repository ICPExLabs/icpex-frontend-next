import { useCallback, useEffect } from 'react';

import { get_tokens_query } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
// import { useAppStore } from '@/stores/app';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { isCanisterIdText } from '@/utils/principals';

import { useExecuteOnce } from './useExecuteOnce';
import { getAllTokensAndBalance, getAllTokensPrice } from './useToken';

export const InitTokenList = () => {
    const { connectedIdentity } = useIdentityStore();

    const { tokenList, setTokenList, setAllTokenBalance, setTotalBalance, setContractWallet } = useTokenStore();

    const priceInit = useCallback(async () => {
        if (!tokenList) return;

        setAllTokenBalance(tokenList);
        try {
            const priceList = await getAllTokensPrice(tokenList);
            if (priceList) {
                setAllTokenBalance(priceList as any);

                if (connectedIdentity) {
                    const priceListAndBalance = await getAllTokensAndBalance(priceList, connectedIdentity);
                    if (priceListAndBalance) {
                        setAllTokenBalance(priceListAndBalance);

                        let usd = 0;
                        let usd_contract = 0;
                        priceListAndBalance.map((item) => {
                            usd += item.usd_wallet || 0;
                            usd_contract += item.usd_wallet_contract || 0;
                        });
                        setTotalBalance(usd);
                        setContractWallet(usd_contract);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch token data:', error);
        }
    }, [tokenList, setAllTokenBalance, connectedIdentity, setTotalBalance, setContractWallet]);

    useEffect(() => {
        priceInit();
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
