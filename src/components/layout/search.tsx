import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useIdentityStore } from '@/stores/identity';
import { cn } from '@/utils/classNames';
import { parseLowerCaseSearch } from '@/utils/search';

import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';
import { TokenPriceChangePercentage } from '../ui/price';

// ! test code
type TypeSearchResultItem = {
    token_name: string;
    token_symbol: string;
    token_address: string;
    token_decimals: number;
    token_logo: string;
    token_blockchain: string;
    token_type: string;
    token_standard: string;
    token_total_supply: string;
    token_price: string;
    token_price_change_percentage_24h: number;
    token_price_change_percentage_7d: number;
};
type TypeSearchResult = TypeSearchResultItem[];

const SearchResultItem = ({ tokenName }: { tokenName: string }) => {
    const { tokenList } = useIdentityStore();
    const [tokenData, setTokenData] = useState<TokenInfo>();

    const [tokenPrice, setTokenPrice] = useState<number>(0);
    const [changePercentage, setChangePercentage] = useState<number>(0);

    const openToken = () => {
        console.log(123);
    };

    useEffect(() => {
        if (!tokenName || !tokenList?.length) return;

        const matchedToken = tokenList.find((token) => token.name === tokenName);

        if (matchedToken) {
            setTokenData(matchedToken);

            // ! test code
            setTokenPrice(100);
            setChangePercentage(1.8);
        }
    }, [tokenList, tokenName, setTokenData]);

    return (
        <div
            onClick={openToken}
            className="flex h-[52px] w-full cursor-pointer items-center justify-between px-4 duration-75 hover:bg-[#f2f4ff]"
        >
            {tokenData && (
                <>
                    <div className="flex items-center">
                        <TokenLogo canisterId={tokenData.canister_id.toString()} className="h-9 w-9 flex-shrink-0" />

                        <div className="ml-[11px] flex flex-col">
                            <p className="text-base font-medium text-[#272e4d]">{tokenData.name}</p>
                            <p className="text-xs font-medium text-[#96a0c8]">{tokenData.symbol}</p>
                        </div>
                    </div>
                    <div className="ml-[11px] flex flex-col items-end">
                        <p className="text-base font-medium text-[#272e4d]">${tokenPrice}</p>
                        <TokenPriceChangePercentage value={changePercentage} />
                    </div>
                </>
            )}
        </div>
    );
};

const popularTokens = ['Internet Computer', 'ICExplorer'];
const SearchComponents = () => {
    const { t } = useTranslation();
    const { tokenList } = useIdentityStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');
    const [searchResult, setSearchResult] = useState<TypeSearchResult | null>(null);

    useEffect(() => {
        if (!parseLowerCaseSearch(keyword)) {
            setSearchResult(null);
            return;
        }

        console.log(keyword);
    }, [keyword, isOpenSearch]);

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

            <div className="relative ml-[72px] h-10 w-[440px]">
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
                                                <SearchResultItem key={index} tokenName={item} />
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
                                                {/* {searchResult.map((item, index) => (
                                                    <SearchResultItem key={index} data={item} />
                                                ))} */}
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
