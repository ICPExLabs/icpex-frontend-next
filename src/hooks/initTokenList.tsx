import { fetchTokenList } from '@/canister/swap/apis';

import { useExecuteOnce } from './useExecuteOnce';

export const InitTokenList = () => {
    useExecuteOnce(() => {
        fetchTokenList().then((res) => {
            console.log('Token list:', res);
        });
    });
};
