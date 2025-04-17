import { useConnect } from '@connect2ic/react';
import { Modal, Switch } from '@douyinfe/semi-ui';
// import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TypeTokenPriceInfoVal, useTokenBalanceByCanisterId } from '@/hooks/useToken';
import { TypeWalletMode, useAppStore } from '@/stores/app';
import { TypeTokenPriceInfo, useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';
import { parseLowerCaseSearch } from '@/utils/search';

import HeaderModal from '../ui/header-modal';
import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';
import { PriceFormatter } from '../ui/priceFormatter';

const SelectTokenItem = ({
    data,
    specifyWalletMode,
    selectToken,
}: {
    data: TypeTokenPriceInfoVal;
    specifyWalletMode?: TypeWalletMode;
    selectToken: (data: TypeTokenPriceInfoVal) => void;
}) => {
    const { isConnected } = useConnect();
    const { walletMode } = useAppStore();
    const tokenBalance = useTokenBalanceByCanisterId(data.canister_id.toString());

    const balance = useMemo(() => {
        if (!tokenBalance || !data?.decimals) return 0;

        // Determine which balance to use
        const balanceSource =
            (specifyWalletMode || walletMode) === 'contract'
                ? tokenBalance.contractWalletBalance
                : tokenBalance.walletBalance;

        if (!balanceSource) return 0;

        // Convert to BigInt for precise arithmetic
        const balanceBigInt = BigInt(balanceSource);
        const decimalsBigInt = BigInt(data.decimals);
        const divisor = 10n ** decimalsBigInt;

        // Calculate integer and fractional parts separately
        const integerPart = balanceBigInt / divisor;
        const fractionalPart = balanceBigInt % divisor;

        // Combine as a number (this maintains more precision than converting the whole division)
        return Number(integerPart) + Number(fractionalPart) / Number(divisor);
    }, [tokenBalance, walletMode, specifyWalletMode, data.decimals]);

    return (
        <div
            onClick={() => selectToken(data)}
            className="group flex h-[54px] w-full flex-shrink-0 cursor-pointer items-center rounded-[10px] duration-75 hover:bg-[#f2f4ff]"
        >
            <TokenLogo
                canisterId={data.canister_id.toString()}
                className="mr-[9px] h-8 w-8 flex-shrink-0 duration-75 group-hover:ml-[13px]"
            />
            <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium text-[#000000]">{data.symbol}</p>
                <p className="text-xs font-medium text-[#999999]">{data.name}</p>
            </div>

            <div className="flex flex-col items-end duration-75 group-hover:mr-[13px]">
                {isConnected ? (
                    <>
                        {!tokenBalance ? (
                            <Icon name="loading" className="h-[14px] w-[14px] animate-spin text-[#07c160]" />
                        ) : (
                            <>
                                <PriceFormatter
                                    className="text-sm font-medium text-[#000000]"
                                    price={balance}
                                    symbol={data.symbol}
                                />
                                {/* {data.symbol} */}
                                {/* <p className="text-sm font-medium text-[#000000]">
                                    {truncateDecimalToBN(balance, 8)} {data.symbol}
                                </p> */}
                            </>
                        )}
                    </>
                ) : (
                    <></>
                )}
                <p className="text-xs font-medium text-[#999999]">${truncateDecimalToBN(data.priceUSD || 0)}</p>
            </div>
        </div>
    );
};

export const SelectTokenModal = ({
    isShow,
    specifyWalletMode,
    ignore = [],
    setIsShow,
    selectToken,
}: {
    isShow: boolean;
    specifyWalletMode?: TypeWalletMode;
    ignore?: string[];
    setIsShow: (isShow: boolean) => void;
    selectToken: (token: TypeTokenPriceInfoVal) => void;
}) => {
    const { t } = useTranslation();
    const { allTokenInfo, allTokenBalance } = useTokenStore();
    const { walletMode } = useAppStore();

    const [isHideZeroBalance, setIsHideZeroBalance] = useState(false);
    const [sortBy, setSortBy] = useState<0 | 1 | 2>(2);
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const toggleSortBy = () => {
        setSortBy((prev) => {
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

    const list: TypeTokenPriceInfo = useMemo(() => {
        if (!allTokenInfo) return {};

        const currentWalletMode = specifyWalletMode || walletMode;
        const ignoreSet = new Set(ignore); // Convert to Set for faster lookups

        let result = Object.entries(allTokenInfo).reduce((acc, [canisterId, token]) => {
            // Skip ignored tokens
            if (ignoreSet.has(canisterId)) return acc;

            // Apply zero balance filter if enabled
            if (isHideZeroBalance) {
                const balance = allTokenBalance[canisterId];
                if (!balance) return acc;

                const balanceValue = Number(
                    currentWalletMode === 'wallet' ? balance.walletBalance || 0 : balance.contractWalletBalance || 0,
                );

                if (balanceValue === 0) return acc;
            }

            // Apply search filter if keyword exists
            if (searchKeyword) {
                const searchTerm = parseLowerCaseSearch(searchKeyword);
                if (canisterId !== searchTerm && !token.symbol.toLowerCase().includes(searchTerm)) {
                    return acc;
                }
            }

            acc[canisterId] = token;
            return acc;
        }, {} as TypeTokenPriceInfo);

        // Apply sorting if needed
        if (sortBy === 1 || sortBy === 2) {
            const sortedEntries = Object.entries(result).sort(([canisterIdA], [canisterIdB]) => {
                const balanceA = allTokenBalance[canisterIdA] || {};
                const balanceB = allTokenBalance[canisterIdB] || {};

                const valueA = Number(
                    currentWalletMode === 'wallet' ? balanceA.walletBalance || 0 : balanceA.contractWalletBalance || 0,
                );

                const valueB = Number(
                    currentWalletMode === 'wallet' ? balanceB.walletBalance || 0 : balanceB.contractWalletBalance || 0,
                );

                return sortBy === 1 ? valueA - valueB : valueB - valueA;
            });

            result = Object.fromEntries(sortedEntries);
        }

        return result;
    }, [
        searchKeyword,
        allTokenInfo,
        allTokenBalance,
        specifyWalletMode,
        isHideZeroBalance,
        walletMode,
        sortBy,
        ignore,
    ]);

    return (
        <Modal
            centered={true}
            visible={isShow}
            footer={<></>}
            header={<></>}
            maskClosable={true}
            onCancel={() => setIsShow(false)}
        >
            <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">
                <HeaderModal title={t('swap.select.title')} closeModal={setIsShow} />

                <div className="mt-[20px] flex h-10 w-full items-center rounded-lg bg-[#F6F6F6]">
                    <Icon name="search" className="ml-3 h-[15px] w-[14px] text-[#999]" />
                    <input
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        type="text"
                        placeholder={t('swap.select.searchPlaceholder')}
                        className="h-full w-full bg-transparent pl-[10px] text-sm font-medium text-[#000000] outline-none placeholder:text-[#999999]"
                    />
                </div>
                <div className="mt-3 flex w-full justify-between">
                    <div className="flex gap-x-[9px]">
                        <p className="text-xs font-medium text-[#666666]">{t('swap.select.zero')}</p>
                        <Switch
                            defaultChecked={isHideZeroBalance}
                            onChange={(val) => {
                                setIsHideZeroBalance(val);
                            }}
                            size="small"
                        ></Switch>
                    </div>
                    <div onClick={toggleSortBy} className="flex cursor-pointer items-center justify-center">
                        <p className="mr-[10px] text-xs leading-[12px] font-medium text-[#666666]">
                            {t('swap.select.sort')}
                        </p>
                        <div className="relative flex flex-col gap-y-[2px]">
                            <div
                                className={cn(
                                    'h-0 w-0 border-x-[3.5px] border-b-[5px] border-x-transparent',
                                    (sortBy === 0 || sortBy === 2) && 'border-b-[#999]',
                                    sortBy === 1 && 'border-b-[#07C160]',
                                )}
                            />
                            <div
                                className={cn(
                                    'h-0 w-0 border-x-[3.5px] border-t-[5px] border-x-transparent',
                                    (sortBy === 0 || sortBy === 1) && 'border-t-[#999]',
                                    sortBy === 2 && 'border-t-[#07C160]',
                                )}
                            />
                        </div>
                    </div>
                </div>
                {!allTokenInfo ? (
                    <div className="flex h-[426px] flex-col items-center justify-center">
                        <Icon name="loading" className="h-[28px] w-[28px] animate-spin text-[#07c160]" />
                        <p className="mt-2 text-[16px] font-semibold text-[#000000]">{t('swap.select.loading')}</p>
                    </div>
                ) : (
                    <div className="no-scrollbar flex h-[426px] flex-col overflow-y-scroll pt-[10px]">
                        {!Object.values(list).length ? (
                            <div className="flex h-[426px] w-full flex-col items-center justify-center">
                                <Icon name="no" className="h-[36px] w-[36px] flex-shrink-0 text-[#c9d1fb]" />
                                <p className="mt-[13px] text-sm font-medium text-[#999999]">
                                    {t('common.search.noResults')}
                                </p>
                            </div>
                        ) : (
                            Object.values(list).map((item) => (
                                <SelectTokenItem
                                    key={item.canister_id.toString()}
                                    data={item}
                                    specifyWalletMode={specifyWalletMode}
                                    selectToken={() => selectToken(item)}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};
