import { get_tokens_query } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useTokenStore } from '@/stores/token';

import { useExecuteOnce } from './useExecuteOnce';

export const InitTokenList = () => {
    const { setTokenList } = useTokenStore();

    useExecuteOnce(() => {
        get_tokens_query().then((tokenInfoArray: TokenInfo[]) => {
            console.log('🚀 ~ get_tokens_query ~ tokenInfoArray:', tokenInfoArray);
            setTokenList(tokenInfoArray);
        });
    });
};
