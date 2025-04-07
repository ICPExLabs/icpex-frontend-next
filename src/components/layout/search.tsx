import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/classNames';

import Icon from '../ui/icon';
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
const mockSearchResults: TypeSearchResult = [
    {
        token_name: 'Chainlink',
        token_symbol: 'LINK',
        token_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
        token_decimals: 18,
        token_logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
        token_blockchain: 'Ethereum',
        token_type: 'Token',
        token_standard: 'ERC-20',
        token_total_supply: '1000000000',
        token_price: '18.56',
        token_price_change_percentage_24h: -1.23,
        token_price_change_percentage_7d: 3.45,
    },
    {
        token_name: 'Polygon',
        token_symbol: 'MATIC',
        token_address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        token_decimals: 18,
        token_logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
        token_blockchain: 'Polygon',
        token_type: 'Coin',
        token_standard: 'ERC-20',
        token_total_supply: '10000000000',
        token_price: '0.92',
        token_price_change_percentage_24h: 4.56,
        token_price_change_percentage_7d: -2.34,
    },
    {
        token_name: 'Uniswap',
        token_symbol: 'UNI',
        token_address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        token_decimals: 18,
        token_logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
        token_blockchain: 'Ethereum',
        token_type: 'Token',
        token_standard: 'ERC-20',
        token_total_supply: '1000000000',
        token_price: '6.78',
        token_price_change_percentage_24h: +0.89,
        token_price_change_percentage_7d: -1.23,
    },
];
const mockPopularResults: TypeSearchResult = [
    {
        token_name: 'Ethereum',
        token_symbol: 'ETH',
        token_address: '0x0000000000000000000000000000000000000000',
        token_decimals: 18,
        token_logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        token_blockchain: 'Ethereum',
        token_type: 'Coin',
        token_standard: 'ERC-20',
        token_total_supply: '120000000',
        token_price: '3200.42',
        token_price_change_percentage_24h: 2.34,
        token_price_change_percentage_7d: 5.67,
    },
    {
        token_name: 'USD Coin',
        token_symbol: 'USDC',
        token_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        token_decimals: 6,
        token_logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        token_blockchain: 'Ethereum',
        token_type: 'Stablecoin',
        token_standard: 'ERC-20',
        token_total_supply: '56000000000',
        token_price: '1.00',
        token_price_change_percentage_24h: 0.0,
        token_price_change_percentage_7d: 0.01,
    },
];

const SearchResultItem = ({ data }: { data: TypeSearchResultItem }) => {
    const openToken = () => {
        console.log(123);
    };

    return (
        <div
            onClick={openToken}
            className="flex h-[52px] w-full cursor-pointer items-center justify-between px-4 duration-75 hover:bg-[#f2f4ff]"
        >
            <div className="flex">
                <img src={data.token_logo} alt="token_logo" className="h-9 w-9 flex-shrink-0" />
                <div className="ml-[11px] flex flex-col">
                    <p className="text-base font-medium text-[#272e4d]">{data.token_name}</p>
                    <p className="text-xs font-medium text-[#96a0c8]">{data.token_blockchain}</p>
                </div>
            </div>
            <div className="ml-[11px] flex flex-col items-end">
                <p className="text-base font-medium text-[#272e4d]">${data.token_price}</p>
                <TokenPriceChangePercentage value={data.token_price_change_percentage_24h} />
            </div>
        </div>
    );
};

const SearchComponents = () => {
    const { t } = useTranslation();

    const inputRef = useRef<HTMLInputElement>(null);

    const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');
    const [searchResult, setSearchResult] = useState<TypeSearchResult | null>(null);
    const [popularList, setPopularList] = useState<TypeSearchResult | null>(null);

    // ! test code
    const getSearchResult = useCallback(async (query: string): Promise<TypeSearchResult> => {
        return new Promise((resolve) => {
            if (query.toLowerCase() === 't') {
                resolve(mockSearchResults);
            }
            resolve([]);
        });
    }, []);

    useEffect(() => {
        if (!keyword.trim()) {
            setSearchResult(null);
            return;
        }

        const timer = setTimeout(async () => {
            const results = await getSearchResult(keyword);
            setSearchResult(results);
        }, 100);

        return () => clearTimeout(timer);
    }, [keyword, getSearchResult, isOpenSearch]);

    const init = () => {
        setPopularList(mockPopularResults);
    };

    useEffect(() => {
        init();

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
                        />
                    </div>

                    {isOpenSearch && (
                        <>
                            <div className="no-scrollbar flex max-h-[504px] min-h-[170px] w-full flex-col overflow-y-scroll pb-[15px]">
                                {!keyword && (
                                    <>
                                        {/* <div className="mt-[10px] mb-[8px] flex w-full items-center px-4">
                                                <Icon name="history" className="h-4 w-3.5 text-[#97a0c9]"></Icon>
                                                <p className="ml-2 text-sm font-medium text-[#272e4d]">
                                                    {t('common.search.recent')}
                                                </p>
                                            </div>
                                            <div className="flex w-full flex-col">
                                                {mockPopularResults.map((item, index) => (
                                                    <SearchResultItem key={index} data={item} />
                                                ))}
                                            </div> */}

                                        {popularList && popularList.length ? (
                                            <>
                                                <div className="mt-[10px] flex w-full items-center px-4">
                                                    <Icon name="popular" className="h-4 w-3.5 text-[#97a0c9]"></Icon>
                                                    <p className="ml-2 text-sm font-medium text-[#272e4d]">
                                                        {t('common.search.popular')}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex w-full flex-col">
                                                    {popularList.map((item, index) => (
                                                        <SearchResultItem key={index} data={item} />
                                                    ))}
                                                </div>
                                            </>
                                        ) : null}
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
                                                    <SearchResultItem key={index} data={item} />
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
