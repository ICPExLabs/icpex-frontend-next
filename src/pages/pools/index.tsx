import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { get_all_pairs_info, get_tokens_balance } from '@/canister/swap/apis';
import { MarketMakerView, TokenPairPool } from '@/canister/swap/swap.did.d';
import Icon from '@/components/ui/icon';
import { TokenLogo } from '@/components/ui/logo';
import { useTokenInfoByCanisterId } from '@/hooks/useToken';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { formatNumber, truncateDecimalToBN } from '@/utils/numbers';
import { isCanisterIdText } from '@/utils/principals';
import { parseLowerCaseSearch } from '@/utils/search';
import { transReserve } from '@/utils/text.ts';

import ScreeningMyPosition from './components/screeningMyPosition';
import ScreeningSearch from './components/ScreeningSearch';
import TotalVolume from './components/totalVolume';

type TypePoolsListItem = {
    tokenACanisterId: string;
    tokenBCanisterId: string;
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAReserve: number;
    tokenBReserve: number;
    tvl: number;
};

const PoolsListLoading = () => {
    const { t } = useTranslation();
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Icon name="loading" className="h-[36px] w-[36px] animate-spin text-[#07c160]" />
            <p className="mt-2 text-base font-medium text-black">{t('pools.list.loading')}</p>
        </div>
    );
};

const PoolsListEmpty = () => {
    const { t } = useTranslation();
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Icon name="empty" className="h-[75px] w-20 text-[#bfbfbf]"></Icon>
            <p className="mt-[15px] text-base leading-[20px] font-medium text-[#666666]">{t('pools.list.empty')}</p>
            <p className="mt-[10px] text-sm leading-[17px] font-medium text-[#999999]">{t('pools.list.emptyTip')}</p>
        </div>
    );
};

const PoolsListItem = ({ data }: { data: TypePoolsListItem }) => {
    const { t } = useTranslation();

    const tokenAInfo = useTokenInfoByCanisterId(data.tokenACanisterId);
    const tokenBInfo = useTokenInfoByCanisterId(data.tokenBCanisterId);

    const onDeposit = () => {
        console.log('onDeposit');
    };

    return (
        <div className="flex h-[67px] flex-shrink-0 border-b border-[#dddddd] px-[30px]">
            <div className="flex h-full flex-4 items-center">
                <TokenLogo canisterId={data.tokenACanisterId} className="h-8 w-8 overflow-hidden rounded-full" />
                <TokenLogo
                    canisterId={data.tokenBCanisterId}
                    className="relative left-[-8px] h-8 w-8 overflow-hidden rounded-full"
                />
                {tokenAInfo && tokenBInfo && (
                    <p className="ml-2 text-base font-medium text-black">
                        {tokenAInfo?.symbol}/{tokenBInfo?.symbol}
                    </p>
                )}
            </div>
            <div className="flex h-full flex-1 items-center text-sm font-medium text-black">
                ${formatNumber(truncateDecimalToBN(Number(data.tvl), 2))}
            </div>
            <div className="flex h-full flex-1 items-center">
                <p onClick={onDeposit} className="cursor-pointer text-sm font-medium text-[#07c160]">
                    {t('pools.list.deposit')}
                </p>
            </div>
        </div>
    );
};

const PoolListTr = ({ tvlSort, setTvlSort }) => {
    const { t } = useTranslation();

    const toggleTvlSortBy = () => {
        setTvlSort((prev) => {
            switch (prev) {
                case 0:
                    return 1;
                case 1:
                    return 2;
                case 2:
                    return 0;
                default:
                    return 0;
            }
        });
    };

    return (
        <div className="flex h-[50px] w-full flex-shrink-0 bg-[#eeeeee] px-[30px]">
            <div className="flex h-full flex-4 items-center">
                <p className="text-sm font-medium text-[#666666]">{t('pools.list.pool')}</p>
            </div>
            <div onClick={toggleTvlSortBy} className="flex h-full flex-1 cursor-pointer items-center">
                <p className="mr-[9px] text-sm font-medium text-[#666666]">{t('pools.list.tvl')}</p>
                <div className="relative flex flex-col gap-y-[2px]">
                    <div
                        className={cn(
                            'h-0 w-0 border-x-[3.5px] border-b-[5px] border-x-transparent',
                            (tvlSort === 0 || tvlSort === 2) && 'border-b-[#999]',
                            tvlSort === 1 && 'border-b-[#07C160]',
                        )}
                    />
                    <div
                        className={cn(
                            'h-0 w-0 border-x-[3.5px] border-t-[5px] border-x-transparent',
                            (tvlSort === 0 || tvlSort === 1) && 'border-t-[#999]',
                            tvlSort === 2 && 'border-t-[#07C160]',
                        )}
                    />
                </div>
            </div>
            <div className="flex h-full flex-1 items-center">
                <p className="mr-[9px] text-sm font-medium text-[#666666]">{t('pools.list.action')}</p>
            </div>
        </div>
    );
};

function PoolsPage() {
    const { t } = useTranslation();
    const { tokenList } = useTokenStore();
    const { connectedIdentity } = useIdentityStore();

    // const [screeningPools, setScreeningPools] = useState<TypeOptionValue>('all');
    const [isMyPosition, setIsMyPosition] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');

    const [tvlSort, setTvlSort] = useState<0 | 1 | 2>(2);
    const [poolList, setPoolList] = useState<TypePoolsListItem[] | undefined>(undefined);
    const [totalTVL, setTotalTVL] = useState<number | undefined>(undefined);

    const [myLp, setMyLp] = useState<Record<string, string> | undefined>(undefined);

    const list: TypePoolsListItem[] | undefined = useMemo(() => {
        if (!poolList) return undefined;
        let sortedPools = [...poolList];

        if (keyword) {
            const val = parseLowerCaseSearch(keyword);
            sortedPools = sortedPools.filter((item) => {
                return (
                    item.tokenASymbol.toLowerCase().includes(val) ||
                    item.tokenBSymbol.toLowerCase().includes(val) ||
                    item.tokenACanisterId === val ||
                    item.tokenBCanisterId === val
                );
            });
        }

        if (tvlSort === 1 || tvlSort === 2) {
            sortedPools = sortedPools.sort((a, b) => {
                const tvlA = a.tvl;
                const tvlB = b.tvl;
                return tvlSort === 1 ? tvlA - tvlB : tvlB - tvlA;
            });
        }

        return sortedPools;
    }, [poolList, tvlSort, keyword]);

    const getPoolsList = useCallback(async () => {
        if (!tokenList) return;

        try {
            let tvlAll = 0;
            const res: [TokenPairPool, MarketMakerView][] = await get_all_pairs_info();
            const tokenListMap = new Map(tokenList.map((token) => [token.canister_id.toString(), token]));

            const resList = res.map(([, marketMaker]) => {
                const {
                    token0: tokenACanisterId,
                    token1: tokenBCanisterId,
                    reserve0,
                    reserve1,
                    lp,
                } = marketMaker.swap_v2;
                const tokenAInfo = tokenListMap.get(tokenACanisterId);
                const tokenBInfo = tokenListMap.get(tokenBCanisterId);
                const { decimals } = Object.values(lp)[0];

                const ONE = new BigNumber(10);
                const tokenAReserve = Number(transReserve(reserve0));
                const tokenBReserve = Number(transReserve(reserve1));

                const aAmount = new BigNumber(tokenAReserve).dividedBy(ONE.pow(decimals));
                const bAmount = new BigNumber(tokenBReserve).dividedBy(ONE.pow(decimals));
                const tvl = aAmount.plus(bAmount);
                tvlAll = tvlAll + Number(tvl);
                return {
                    tokenACanisterId,
                    tokenBCanisterId,
                    tokenASymbol: tokenAInfo?.symbol || '',
                    tokenBSymbol: tokenBInfo?.symbol || '',
                    tokenAReserve,
                    tokenBReserve,
                    tvl: Number(tvl),
                };
            });

            setTotalTVL(tvlAll);
            setPoolList(resList);
        } catch (error) {
            console.error('Error fetching pools list:', error);
            setPoolList(undefined);
        }
    }, [tokenList]);

    const getTokensBalance = useCallback(async () => {
        if (!connectedIdentity) {
            setIsMyPosition(false);
            return;
        }

        const { principal } = connectedIdentity;
        if (connectedIdentity) {
            const contractBalanceRes = await get_tokens_balance(connectedIdentity, {
                owner: principal,
            });

            const lpArr = {};
            Object.keys(contractBalanceRes).forEach((key) => {
                if (!isCanisterIdText(key)) {
                    const quantity = contractBalanceRes[key];
                    if (quantity) {
                        lpArr[key] = contractBalanceRes[key];
                    }
                }
            });
            setMyLp(lpArr);
        }
    }, [connectedIdentity]);

    useEffect(() => {
        getPoolsList();
    }, [getPoolsList]);

    useEffect(() => {
        getTokensBalance();
    }, [getTokensBalance, connectedIdentity]);

    return (
        <div className="mx-auto mt-[50px] w-full max-w-[1280px] flex-col px-[20px]">
            <div className="flex w-full justify-between">
                <div className="flex flex-col">
                    <p className="text-2xl font-medium text-black">{t('pools.title.title')}</p>
                    <p className="text-sm leading-tight font-medium text-[#666666]">{t('pools.title.tip')}</p>
                </div>

                <TotalVolume totalTVL={totalTVL} />
            </div>
            <div className="mt-5 flex w-full gap-x-3">
                {/* <ScreeningPools screeningPools={screeningPools} setScreeningPools={setScreeningPools} /> */}
                {connectedIdentity && (
                    <ScreeningMyPosition isMyPosition={isMyPosition} setIsMyPosition={setIsMyPosition} />
                )}
                <ScreeningSearch keyword={keyword} setKeyword={setKeyword} />
            </div>
            <div className="mt-[18px] flex h-[calc(100vh-280px)] w-full flex-col overflow-hidden rounded-xl border border-[#dddddd]">
                {isMyPosition ? (
                    <>{}</>
                ) : (
                    <>
                        {!list ? (
                            <PoolsListLoading />
                        ) : list.length ? (
                            <>
                                <PoolListTr tvlSort={tvlSort} setTvlSort={setTvlSort} />
                                <div className="no-scrollbar flex flex-1 flex-col overflow-y-scroll">
                                    {list!.map((item, index) => (
                                        <PoolsListItem data={item} key={index} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <PoolsListEmpty />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default PoolsPage;
