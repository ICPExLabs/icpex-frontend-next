import { fetchTokenList } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useIdentityStore } from '@/stores/identity';

import { useExecuteOnce } from './useExecuteOnce';

export const InitTokenList = () => {
    const { setTokenList } = useIdentityStore();

    useExecuteOnce(() => {
        fetchTokenList().then((tokenInfoArray: TokenInfo[]) => {
            console.log('🚀 ~ fetchTokenList ~ tokenInfoArray:', tokenInfoArray);
            setTokenList(tokenInfoArray);
        });
    });
};
