import { get_all_tokens } from '@/canister/icpswap/apis';
import { PublicTokenOverview } from '@/canister/icpswap/icpswap.did.d';
import { get_tokens_query } from '@/canister/swap/apis';
import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useTokenStore } from '@/stores/token';
import { isCanisterIdText } from '@/utils/principals';

import { useExecuteOnce } from './useExecuteOnce';

export const useInitTokenList = () => {
    const { setTokenList, setAllTokenPrice } = useTokenStore();

    useExecuteOnce(() => {
        get_tokens_query().then(async (tokenList: TokenInfo[]) => {
            const list: TokenInfo[] = tokenList.filter((item) => {
                if (isCanisterIdText(item.canister_id.toString())) {
                    return true;
                }
            });
            setTokenList(list);

            const updatePrices = async () => {
                const priceList = await get_all_tokens();
                if (priceList) {
                    const priceListObj: Record<string, PublicTokenOverview> = {};

                    priceList.forEach((priceListItem: PublicTokenOverview) => {
                        priceListObj[priceListItem.address] = priceListItem;
                    });

                    const arr = {};
                    list.map((tokenListItem) => {
                        const priceData: PublicTokenOverview = priceListObj[tokenListItem.canister_id.toString()];

                        arr[tokenListItem.canister_id.toString()] = {
                            ...tokenListItem,
                            feesUSD: priceData?.feesUSD || undefined,
                            priceUSD: priceData?.priceUSD || undefined,
                            priceUSDChange: priceData?.priceUSDChange || undefined,
                            standard: priceData?.standard || undefined,
                            totalVolumeUSD: priceData?.totalVolumeUSD || undefined,
                            volumeUSD: priceData?.volumeUSD || undefined,
                            volumeUSD1d: priceData?.volumeUSD1d || undefined,
                            volumeUSD7d: priceData?.volumeUSD7d || undefined,
                        };
                    });
                    setAllTokenPrice(arr);
                }
            };

            await updatePrices();

            const intervalId = setInterval(updatePrices, 20000);

            return () => clearInterval(intervalId);
        });
    });
};
