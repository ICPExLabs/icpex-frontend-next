import { useEffect } from 'react';

import { get_tokens_query } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useTokenStore } from '@/stores/token';

import { useExecuteOnce } from './useExecuteOnce';
import { useContractTokensAndBalance } from './useTokenPrice';

export const InitTokenList = () => {
    const { setTokenList, setAllTokenBalance } = useTokenStore();
    const { balanceData, refreshData } = useContractTokensAndBalance();

    useEffect(() => {
        if (!balanceData) return;
        console.log('🚀 ~ useEffect ~ balanceData:', balanceData);

        // Initial fetch
        setAllTokenBalance(balanceData);

        // Set up polling
        const intervalId = setInterval(() => {
            refreshData();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [balanceData, refreshData, setAllTokenBalance]);

    useExecuteOnce(() => {
        get_tokens_query().then((tokenInfoArray: TokenInfo[]) => {
            setTokenList(tokenInfoArray);
        });
    });
};
