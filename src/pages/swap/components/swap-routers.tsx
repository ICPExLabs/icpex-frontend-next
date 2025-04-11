import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import icpswapLogo from '@/assets/swapLogo/icpswap.png';
import kongswapLogo from '@/assets/swapLogo/kongswap.png';
import Icon from '@/components/ui/icon';
import { TokenBalanceInfo } from '@/hooks/useToken';
import { cn } from '@/utils/classNames';

import { TypeSwapRouter } from '../swap';

const SwapRouters = ({
    swapRouter,
    selectedRouter,
    payTokenInfo,
    receiveTokenInfo,
}: {
    swapRouter: TypeSwapRouter;
    selectedRouter: (swapRouter) => void;
    payTokenInfo: TokenBalanceInfo | undefined;
    receiveTokenInfo: TokenBalanceInfo | undefined;
}) => {
    const { t } = useTranslation();

    const routes: { name: TypeSwapRouter; logo: string; label?: string }[] = [
        {
            name: 'KongSwap',
            logo: kongswapLogo,
            label: 'Best Router',
        },
        {
            name: 'ICPSwap',
            logo: icpswapLogo,
            label: '',
        },
    ];

    useEffect(() => {
        console.log(payTokenInfo);
    }, [payTokenInfo]);

    useEffect(() => {
        console.log(receiveTokenInfo);
    }, [receiveTokenInfo]);

    return (
        <div className="mt-[15px] flex w-full flex-col gap-y-[15px]">
            {routes.map((route) => (
                <div
                    key={route.name}
                    onClick={() => {
                        if (route.name === swapRouter) {
                            selectedRouter('ICPEx');
                            return;
                        }
                        selectedRouter(route.name);
                    }}
                    className={cn(
                        'flex h-[48px] cursor-pointer items-center justify-between rounded-[14px] border border-[#E4E9FF] bg-white px-[14px] transition-all',
                        route.name === swapRouter && 'border-[#7178FF]',
                    )}
                >
                    <div className="flex items-center gap-x-[5px]">
                        <img src={route.logo} alt={route.name} className="h-[18px] w-[18px] rounded-full" />
                        <span className="text-sm font-medium text-[#666]">{route.name}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                        {route.label && (
                            <p className="flex h-[18px] items-center justify-center rounded bg-[#edeeff] px-[6px] text-xs font-medium text-[#7077ff]">
                                {route.label}
                            </p>
                        )}
                        {/* TODO: add amount */}
                        <p className="text-sm font-medium text-[#666666]">{'amount'}</p>
                        {route.name === swapRouter && <Icon name="checkbox" className="h-4 w-4 text-[#7178FF]" />}
                    </div>
                </div>
            ))}

            <div className="flex w-full items-center justify-center rounded-[14px] border border-[#ffdcdd] bg-[#fffbfb] px-[14px] py-[10px]">
                <Icon name="warn" className="mr-3 h-6 w-[26.46px] flex-shrink-0 text-[#ff5457]" />
                <p className="text-xs font-medium text-[#ff5457]">{t('swap.router.tip')}</p>
            </div>
        </div>
    );
};

export default SwapRouters;
