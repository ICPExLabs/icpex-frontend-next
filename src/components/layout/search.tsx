import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { parseLowerCaseSearch } from '@/utils/search';

import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';
import { TokenPriceChangePercentage } from '../ui/price';

const SearchResultItem = ({
    token,
    tokenName,
    closeSearch,
}: {
    token?: TokenInfo;
    tokenName?: string;
    closeSearch: () => void;
}) => {
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

    const priceData = useTokenPrice(tokenData?.canister_id.toString());

    return (
        <div className="flex h-[52px] w-full cursor-pointer items-center justify-between px-4 duration-75 hover:bg-[#f2f4ff]">
            {tokenData && (
                <Link onClick={closeSearch} to={`/explore/${tokenData.canister_id.toString()}`} className="flex w-full">
                    <div className="flex flex-1 items-center">
                        <TokenLogo canisterId={tokenData.canister_id.toString()} className="h-9 w-9 flex-shrink-0" />

                        <div className="ml-[11px] flex flex-1 flex-col">
                            <p className="line-clamp-1 w-full text-base font-medium break-all text-[#272e4d]">
                                {tokenData.name}
                            </p>
                            <p className="text-xs font-medium text-[#96a0c8]">{tokenData.symbol}</p>
                        </div>
                    </div>
                    <div className="ml-[11px] flex flex-col items-end gap-y-1">
                        {priceData ? (
                            <p className="text-base font-medium text-[#272e4d]">${priceData.price || '--'}</p>
                        ) : (
                            <Icon name="loading" className="h-[14px] w-[14px] animate-spin text-[#7178FF]" />
                        )}
                        {priceData ? (
                            <TokenPriceChangePercentage value={priceData.price_change_24h || '--'} />
                        ) : (
                            <Icon name="loading" className="h-[12px] w-[12px] animate-spin text-[#96a0c8]" />
                        )}
                    </div>
                </Link>
            )}
        </div>
    );
};

const popularTokens = ['Internet Computer', 'ICExplorer'];
const SearchComponents = () => {
    const { t } = useTranslation();
    const { tokenList } = useTokenStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');
    const [searchResult, setSearchResult] = useState<TokenInfo[] | null>(null);

    const closeSearch = () => {
        setIsOpenSearch(false);
    };

    useEffect(() => {
        if (!isOpenSearch) return;

        const val = parseLowerCaseSearch(keyword);
        if (!val || !tokenList) {
            setSearchResult(null);
            return;
        }

        const arr = tokenList.filter(
            (item) => item.canister_id.toString() === val || item.symbol.toLowerCase().includes(val),
        );

        setSearchResult(arr.length ? arr : null);
    }, [keyword, isOpenSearch, tokenList]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && e.ctrlKey) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <AnimatePresence>
                {isOpenSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-0 left-0 z-[10] h-screen w-screen bg-[#000]/60 backdrop-blur-[4px]"
                        onClick={() => {
                            setIsOpenSearch(false);
                            setSearchResult(null);
                        }}
                    >
                        <Icon name="close" className="absolute top-4 right-4 h-6 w-6 cursor-pointer text-white"></Icon>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative mr-[30px] ml-[72px] h-10 w-[440px]">
                <div
                    className={cn(
                        'absolute z-10 flex w-full flex-col items-center rounded-[40px] bg-[#f2f4ff]',
                        isOpenSearch && 'rounded-[20px] bg-white',
                    )}
                >
                    <div className="flex h-10 w-full flex-shrink-0 items-center px-4">
                        <Icon name="search" className="h-[15px] w-[15px] flex-shrink-0 text-[#97A0C9]" />
                        <input
                            ref={inputRef}
                            className="ml-3 h-full flex-1 bg-transparent text-sm font-medium text-[#272E4D] outline-none placeholder:text-[#97a0c9]"
                            placeholder={t('common.search.placeholder')}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            aria-label="Search"
                            onFocus={() => setIsOpenSearch(true)}
                            disabled={!tokenList || !tokenList.length}
                        />
                        <Icon
                            onClick={() => setKeyword('')}
                            name="close"
                            className={cn(
                                'h-[15px] w-[15px] flex-shrink-0 cursor-pointer text-[#97A0C9] opacity-0 duration-75',
                                keyword && 'opacity-100',
                            )}
                        />
                    </div>

                    {isOpenSearch && (
                        <>
                            <div className="no-scrollbar flex max-h-[504px] min-h-[170px] w-full flex-col overflow-y-scroll pb-[15px]">
                                {!keyword && (
                                    <>
                                        <div className="mt-[10px] flex w-full items-center px-4">
                                            <Icon name="popular" className="h-4 w-3.5 text-[#97a0c9]"></Icon>
                                            <p className="ml-2 text-sm font-medium text-[#272e4d]">
                                                {t('common.search.popular')}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex w-full flex-col">
                                            {popularTokens.map((item, index) => (
                                                <SearchResultItem
                                                    key={index}
                                                    tokenName={item}
                                                    closeSearch={closeSearch}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                {keyword && (
                                    <>
                                        {!searchResult?.length ? (
                                            <div className="mt-[40px] mb-[70px] flex w-full flex-col items-center justify-center">
                                                <Icon
                                                    name="no"
                                                    className="h-[36px] w-[36px] flex-shrink-0 text-[#c9d1fb]"
                                                />
                                                <p className="mt-[13px] text-sm font-medium text-[#97a0c9]">
                                                    {t('common.search.noResults')}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex w-full flex-col">
                                                {searchResult.map((item, index) => (
                                                    <SearchResultItem
                                                        key={index}
                                                        token={item}
                                                        closeSearch={closeSearch}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchComponents;
