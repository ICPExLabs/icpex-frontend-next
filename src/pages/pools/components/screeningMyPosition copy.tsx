import BigNumber from 'bignumber.js';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import Icon from '@/components/ui/icon';
import { TokenLogo } from '@/components/ui/logo';
import { useTokenBalanceByCanisterId, useTokenInfoByCanisterId } from '@/hooks/useToken';
import { useAppStore } from '@/stores/app';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';
import { parseLowerCaseSearch } from '@/utils/search';

const SearchResultItem = ({
    token,
    tokenName,
    setKeyword,
    closeSearch,
}: {
    token?: TokenInfo;
    tokenName?: string;
    setKeyword: (val: string) => void;
    closeSearch: () => void;
}) => {
    const { walletMode } = useAppStore();
    const { tokenList } = useTokenStore();
    const [tokenData, setTokenData] = useState<TokenInfo | undefined>();

    useEffect(() => {
        if (token) {
            setTokenData(token);
        } else {
            if (!tokenName || !tokenList?.length) return;

            const matchedToken = tokenList.find((token) => token.name === tokenName);

            if (matchedToken) {
                setTokenData(matchedToken);
            }
        }
    }, [tokenList, token, tokenName, setTokenData]);

    const tokenInfo = useTokenInfoByCanisterId(tokenData?.canister_id.toString());
    const tokenBalance = useTokenBalanceByCanisterId(tokenData?.canister_id.toString());
    const balance = useMemo(() => {
        if (!tokenInfo || !tokenBalance) return undefined;
        if (walletMode === 'wallet') {
            return Number(
                new BigNumber(tokenBalance.walletBalance).dividedBy(
                    new BigNumber(10).pow(new BigNumber(tokenInfo.decimals)),
                ),
            );
        }
        if (walletMode === 'contract') {
            return Number(
                new BigNumber(tokenBalance.contractWalletBalance).dividedBy(
                    new BigNumber(10).pow(new BigNumber(tokenInfo.decimals)),
                ),
            );
        }
        return undefined;
    }, [tokenBalance, walletMode, tokenInfo]);

    return (
        <div className="flex h-[52px] w-full cursor-pointer items-center justify-between px-4 duration-75 hover:bg-[#f6f6f6]">
            {tokenData && (
                <div
                    onClick={() => {
                        if (tokenInfo) {
                            setKeyword(tokenInfo?.canister_id.toString());
                        }
                        closeSearch();
                    }}
                    className="flex w-full"
                >
                    <div className="flex flex-1 items-center">
                        <TokenLogo canisterId={tokenData.canister_id.toString()} className="h-8 w-8 flex-shrink-0" />

                        <div className="ml-[11px] flex flex-1 flex-col">
                            <p className="line-clamp-1 w-full text-sm font-medium break-all text-[#000000]">
                                {tokenData.name}
                            </p>
                            <p className="text-xs font-medium text-[#96a0c8]">{tokenData.symbol}</p>
                        </div>
                    </div>
                    <div className="ml-[11px] flex flex-col items-end">
                        {balance && <p className="text-sm font-medium text-black">{truncateDecimalToBN(balance, 4)}</p>}
                        {tokenInfo ? (
                            <p className="text-xs font-medium text-[#999999]">
                                ${tokenInfo.priceUSD ? truncateDecimalToBN(tokenInfo.priceUSD, 4) : '--'}
                            </p>
                        ) : (
                            <Icon name="loading" className="h-[14px] w-[14px] animate-spin text-[#07c160]" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ScreeningSearch = ({ keyword, setKeyword }: { keyword: string; setKeyword: (val: string) => void }) => {
    const { t } = useTranslation();
    const { tokenList } = useTokenStore();

    const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);

    const closeSearch = () => {
        setIsOpenSearch(false);
    };

    const searchResult = useMemo(() => {
        if (!isOpenSearch) return [];
        const val = parseLowerCaseSearch(keyword);
        if (!val || !tokenList) {
            return [];
        }
        const arr = tokenList.filter(
            (item) => item.canister_id.toString() === val || item.symbol.toLowerCase().includes(val),
        );
        return arr;
    }, [keyword, isOpenSearch, tokenList]);

    useEffect(() => {
        if (!keyword) {
            setIsOpenSearch(false);
        }
    }, [keyword]);

    return (
        <>
            <AnimatePresence>
                {isOpenSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-0 left-0 z-[999] h-screen w-screen bg-[#000]/0"
                        onClick={() => {
                            setIsOpenSearch(false);
                        }}
                    ></motion.div>
                )}
            </AnimatePresence>
            <div className="relative z-[10000]">
                <div className="flex h-11 w-[372px] items-center rounded-xl border border-[#dddddd] bg-white px-3">
                    <Icon name="search" className="h-[15px] w-[14px] text-[#999]" />
                    <input
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setIsOpenSearch(true);
                        }}
                        type="text"
                        placeholder={t('pools.screening.searchPlaceholder')}
                        className="h-full w-full bg-transparent pl-[10px] text-sm font-medium text-[#000000] outline-none placeholder:text-[#999999]"
                        aria-label="Search"
                        disabled={!tokenList || !tokenList.length}
                    />
                    <Icon
                        onClick={() => setKeyword('')}
                        name="close"
                        className={cn(
                            'h-[15px] w-[15px] flex-shrink-0 cursor-pointer text-[#999999] opacity-0 duration-75',
                            keyword && 'opacity-100',
                        )}
                    />
                </div>
                {isOpenSearch && (
                    <div className="no-scrollbar absolute top-11 left-0 mt-[3px] flex h-[123px] max-h-[504px] min-h-[170px] w-[372px] flex-col overflow-y-scroll rounded-xl border border-[#dddddd] bg-white pb-[15px]">
                        {!searchResult.length ? (
                            <div className="mt-[40px] mb-[70px] flex w-full flex-col items-center justify-center">
                                <Icon name="no" className="h-[36px] w-[36px] flex-shrink-0 text-[#c9d1fb]" />
                                <p className="mt-[13px] text-sm font-medium text-[#999999]">
                                    {t('common.search.noResults')}
                                </p>
                            </div>
                        ) : (
                            <div className="flex w-full flex-col py-1">
                                {searchResult.map((item, index) => (
                                    <SearchResultItem
                                        key={index}
                                        token={item}
                                        closeSearch={closeSearch}
                                        setKeyword={setKeyword}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ScreeningSearch;
