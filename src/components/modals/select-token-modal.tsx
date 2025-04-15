import { Modal, Switch } from '@douyinfe/semi-ui';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TypeTokenPriceInfoVal, useTokenBalanceByCanisterId } from '@/hooks/useToken';
import { useAppStore } from '@/stores/app';
import { TypeTokenPriceInfo, useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';
import { parseLowerCaseSearch } from '@/utils/search';

import HeaderModal from '../ui/header-modal';
import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';

const SelectTokenItem = ({
    data,
    selectToken,
}: {
    data: TypeTokenPriceInfoVal;
    selectToken: (data: TypeTokenPriceInfoVal) => void;
}) => {
    const { walletMode } = useAppStore();
    const tokenBalance = useTokenBalanceByCanisterId(data.canister_id.toString());

    const balance = useMemo(() => {
        if (!tokenBalance) return 0;
        if (walletMode === 'wallet') {
            return Number(
                new BigNumber(tokenBalance.walletBalance).dividedBy(
                    new BigNumber(10).pow(new BigNumber(data.decimals)),
                ),
            );
        }
        if (walletMode === 'contract') {
            return Number(
                new BigNumber(tokenBalance.contractWalletBalance).dividedBy(
                    new BigNumber(10).pow(new BigNumber(data.decimals)),
                ),
            );
        }
        return 0;
    }, [tokenBalance, walletMode, data.decimals]);

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
                {!tokenBalance && <Icon name="loading" className="h-[14px] w-[14px] animate-spin text-[#07c160]" />}
                {tokenBalance && (
                    <p className="text-sm font-medium text-[#000000]">
                        {truncateDecimalToBN(balance)} {data.symbol}
                    </p>
                )}
                <p className="text-xs font-medium text-[#999999]">${truncateDecimalToBN(data.priceUSD || 0)}</p>
            </div>
        </div>
    );
};

export const SelectTokenModal = ({
    isShow,
    setIsShow,
    selectToken,
}: {
    isShow: boolean;
    setIsShow: (isShow: boolean) => void;
    selectToken: (token: TypeTokenPriceInfoVal) => void;
}) => {
    const { t } = useTranslation();
    const { allTokenPrice, allTokenBalance } = useTokenStore();
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
        if (!allTokenPrice) {
            return {};
        }

        let result = { ...allTokenPrice };

        if (isHideZeroBalance) {
            result = Object.keys(result).reduce((acc, canisterId) => {
                const balance = allTokenBalance[canisterId];

                if (!balance) return acc;

                const balanceValue =
                    walletMode === 'wallet'
                        ? Number(balance.walletBalance || 0)
                        : Number(balance.contractWalletBalance || 0);

                if (balanceValue !== 0) {
                    acc[canisterId] = result[canisterId];
                }

                return acc;
            }, {} as TypeTokenPriceInfo);
        }

        if (searchKeyword) {
            const searchTerm = parseLowerCaseSearch(searchKeyword);
            result = Object.keys(result).reduce((acc, canisterId) => {
                const token = result[canisterId];

                if (canisterId === searchTerm || token.symbol.toLowerCase().includes(searchTerm)) {
                    acc[canisterId] = token;
                }
                return acc;
            }, {} as TypeTokenPriceInfo);
        }

        if (sortBy === 1 || sortBy === 2) {
            const sortedEntries = Object.entries(result).sort(([canisterIdA], [canisterIdB]) => {
                const balanceA = allTokenBalance[canisterIdA];
                const balanceB = allTokenBalance[canisterIdB];

                const valueA =
                    walletMode === 'wallet'
                        ? Number(balanceA?.walletBalance || 0)
                        : Number(balanceA?.contractWalletBalance || 0);

                const valueB =
                    walletMode === 'wallet'
                        ? Number(balanceB?.walletBalance || 0)
                        : Number(balanceB?.contractWalletBalance || 0);

                return valueB - valueA;
            });

            result = Object.fromEntries(sortedEntries);
        }

        return result;
    }, [searchKeyword, allTokenPrice, allTokenBalance, isHideZeroBalance, walletMode, sortBy]);

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
                {!allTokenPrice || !Object.values(list).length ? (
                    <div className="flex h-[426px] flex-col items-center justify-center">
                        <Icon name="loading" className="h-[28px] w-[28px] animate-spin text-[#07c160]" />
                        <p className="mt-2 text-[16px] font-semibold text-[#000000]">{t('swap.select.loading')}</p>
                    </div>
                ) : (
                    <div className="no-scrollbar flex h-[426px] flex-col overflow-y-scroll pt-[10px]">
                        {!Object.values(list).length ? (
                            <div className="mt-[40px] mb-[70px] flex w-full flex-col items-center justify-center">
                                <Icon name="no" className="h-[36px] w-[36px] flex-shrink-0 text-[#c9d1fb]" />
                                <p className="mt-[13px] text-sm font-medium text-[#999999]">
                                    {t('common.search.noResults')}
                                </p>
                            </div>
                        ) : (
                            Object.values(list).map((item) => (
                                <SelectTokenItem
                                    key={item.canister_id.toString()}
                                    selectToken={() => selectToken(item)}
                                    data={item}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};
