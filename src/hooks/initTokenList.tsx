import { fetchTokenList } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';

import { useExecuteOnce } from './useExecuteOnce';

export const InitTokenList = () => {
    useExecuteOnce(() => {
        fetchTokenList().then((tokenInfoArray: TokenInfo[]) => {
            console.log('Token list:', tokenInfoArray);
        });
    });
};
