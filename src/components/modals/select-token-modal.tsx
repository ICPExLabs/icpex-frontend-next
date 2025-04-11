import { Modal, Switch } from '@douyinfe/semi-ui';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { parseLowerCaseSearch } from '@/utils/search';

import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';

export const SelectTokenModal = ({
    isShow,
    setIsShow,
    selectToken,
}: {
    isShow: boolean;
    setIsShow: (isShow: boolean) => void;
    selectToken: (token: TokenInfo) => void;
}) => {
    const { t } = useTranslation();
    const { tokenList } = useTokenStore();

    const [isHideZeroBalance, setIsHideZeroBalance] = useState(false);
    const [sortBy, setSortBy] = useState<0 | 1 | 2>(0);
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

    const list: TokenInfo[] | undefined = useMemo(() => {
        if (!tokenList) {
            return [];
        }
        if (searchKeyword) {
            const val = parseLowerCaseSearch(searchKeyword);
            if (!val || !tokenList) {
                return [];
            }
            const arr = tokenList.filter(
                (item) => item.canister_id.toString() === val || item.symbol.toLowerCase().includes(val),
            );
            return arr;
        }
        return tokenList;
    }, [searchKeyword, tokenList]);

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
                <div className="flex w-full items-center justify-between">
                    <p className="text-lg font-semibold text-[#272e4d]">{t('swap.select.title')}</p>
                    <Icon
                        onClick={() => setIsShow(false)}
                        name="close"
                        className="h-6 w-6 cursor-pointer text-[#BFBFBF]"
                    />
                </div>
                <div className="mt-[20px] flex h-10 w-full items-center rounded-lg bg-[#F6F6F6]">
                    <Icon name="search" className="ml-3 h-[15px] w-[14px] text-[#c9d1fb]" />
                    <input
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        type="text"
                        placeholder={t('swap.select.searchPlaceholder')}
                        className="h-full w-full bg-transparent pl-[10px] text-sm font-medium text-[#272e4d] outline-none placeholder:text-[#97a0c9]"
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
                {!tokenList || !tokenList.length ? (
                    <div className="flex h-[426px] flex-col items-center justify-center">
                        <Icon name="loading" className="h-[28px] w-[28px] animate-spin text-[#07c160]" />
                        <p className="mt-2 text-[16px] font-semibold text-[#272e4d]">{t('swap.select.loading')}</p>
                    </div>
                ) : (
                    <div className="no-scrollbar flex h-[426px] flex-col overflow-y-scroll pt-[10px]">
                        {!list.length ? (
                            <div className="mt-[40px] mb-[70px] flex w-full flex-col items-center justify-center">
                                <Icon name="no" className="h-[36px] w-[36px] flex-shrink-0 text-[#c9d1fb]" />
                                <p className="mt-[13px] text-sm font-medium text-[#97a0c9]">
                                    {t('common.search.noResults')}
                                </p>
                            </div>
                        ) : (
                            list.map((item) => (
                                <div
                                    onClick={() => selectToken(item)}
                                    key={item.canister_id.toString()}
                                    className="group flex h-[54px] w-full flex-shrink-0 cursor-pointer items-center rounded-[10px] duration-75 hover:bg-[#f2f4ff]"
                                >
                                    <TokenLogo
                                        canisterId={item.canister_id.toString()}
                                        className="mr-[9px] h-8 w-8 flex-shrink-0 duration-75 group-hover:ml-[13px]"
                                    />
                                    <div className="flex flex-1 flex-col">
                                        <p className="text-sm font-medium text-[#272e4d]">{item.symbol}</p>
                                        <p className="text-xs font-medium text-[#97a0c9]">{item.name}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-medium text-[#272e4d]">0.5</p>
                                        <p className="text-xs font-medium text-[#97a0c9]">$4.99</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};
