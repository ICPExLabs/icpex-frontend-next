import { useConnect } from '@connect2ic/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '@/components/ui/icon';
import { useTokenInfoAndBalanceBySymbol } from '@/hooks/useToken';
import { useAppStore } from '@/stores/app';
import { useIdentityStore } from '@/stores/identity';
import { cn } from '@/utils/classNames';

import AmountInput from './components/amount-input';
import PriceComponents from './components/price';
import SwapRouters from './components/swap-routers';

export type TypeSwapRouter = 'KongSwap' | 'ICPSwap' | 'ICPEx';

function SwapPage() {
    const { t } = useTranslation();
    const { walletMode } = useAppStore();
    const { isConnected, isInitializing } = useConnect();
    const { setShowLoginModal } = useIdentityStore();

    const [payAmount, setPayAmount] = useState<number | undefined>();
    const [payToken, setPayToken] = useState<string | undefined>('ICP');
    const payTokenInfo = useTokenInfoAndBalanceBySymbol(payToken);
    const [payTokenBalance, setPayTokenBalance] = useState<number | undefined>(0.53);

    const [receiveAmount, setReceiveAmount] = useState<number | undefined>();
    const [receiveToken, setReceiveToken] = useState<string | undefined>();
    const receiveTokenInfo = useTokenInfoAndBalanceBySymbol(receiveToken);

    const [swapRouter, setSwapRouter] = useState<TypeSwapRouter>('KongSwap');

    const exchangeRate = useMemo(() => {
        if (!payTokenInfo?.price || !receiveTokenInfo?.price) return 0;
        return payTokenInfo?.price / receiveTokenInfo?.price;
    }, [payTokenInfo, receiveTokenInfo]);

    const onSwapDirectionChange = () => {
        if (!receiveToken || !receiveTokenInfo || !payToken || !payTokenInfo) {
            return;
        }

        setPayToken(receiveToken);
        setReceiveToken(payToken);
    };

    const onHalfChange = () => {
        if (!payTokenBalance) return;
        setPayAmount(payTokenBalance / 2);
    };

    const onMaxChange = () => {
        if (!payTokenBalance) return;
        setPayAmount(payTokenBalance);
    };

    const onSwapChange = () => {
        console.log('swap');
    };

    const onSwapRouterChange = () => {
        console.log('swap');
    };

    useEffect(() => {
        setPayTokenBalance(999);
    }, [payTokenInfo]);

    useEffect(() => {
        if (walletMode === 'contract') {
            setSwapRouter('ICPEx');
        }
    }, [walletMode]);

    useEffect(() => {
        if (!payAmount || !exchangeRate) {
            setReceiveAmount(undefined);
        } else {
            setReceiveAmount(parseFloat((payAmount * exchangeRate).toFixed(4)));
        }
    }, [payAmount, exchangeRate]);

    return (
        <div className="flex w-full flex-col">
            <div className="mb-2 rounded-[18px] border border-[#e3e8ff] bg-[#ffffff] px-5 py-[17px]">
                <p className="mb-5 text-base font-medium text-[#666]">{t('swap.swap.pay')}</p>
                <AmountInput
                    className="mb-5 flex justify-between"
                    placeholder="0.00"
                    amount={payAmount}
                    onAmountChange={setPayAmount}
                    token={payToken}
                    onTokenChange={setPayToken}
                    tokenInfo={payTokenInfo}
                />
                <div className="flex w-full items-center justify-between">
                    <p className="text-sm font-medium text-[#666666]">
                        ${payTokenInfo?.price ? (payTokenInfo.price * (payAmount || 0)).toFixed(2) : '0.00'}
                    </p>
                    <div className="flex items-center">
                        <Icon name="wallet" className="h-3 w-[14px] text-[#666]" />
                        <div className="ml-[6px] flex items-center">
                            <p className="text-xs font-medium text-[#666]">{payTokenBalance}</p>
                            <p className="ml-[2px] text-xs font-medium text-[#666]">{payToken}</p>
                        </div>
                        <div className="ml-2 flex items-center text-xs font-medium text-[#07c160]">
                            <p
                                className="flex h-[20px] cursor-pointer items-center rounded-l-full border border-r-0 border-[#E4E9FF] px-2 text-xs font-medium text-[#07C160]"
                                onClick={onHalfChange}
                            >
                                {t('swap.swap.half')}
                            </p>
                            <p
                                className="flex h-[20px] cursor-pointer items-center rounded-r-full border border-[#E4E9FF] px-2 text-xs font-medium text-[#07C160]"
                                onClick={onMaxChange}
                            >
                                {t('swap.swap.max')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mb-4 rounded-[18px] bg-[#F6F6F6] px-5 py-[17px]">
                <div
                    onClick={onSwapDirectionChange}
                    className="absolute -top-7 left-1/2 flex translate-x-[-50%] cursor-pointer justify-center"
                >
                    <Icon name="exchange" className="h-10 w-10" />
                </div>

                <p className="mb-5 text-base font-medium text-[#666]">{t('swap.swap.receive')}</p>
                <AmountInput
                    className="mb-5 flex justify-between"
                    placeholder="0.00"
                    amount={receiveAmount}
                    onAmountChange={setReceiveAmount}
                    token={receiveToken}
                    onTokenChange={setReceiveToken}
                    tokenInfo={receiveTokenInfo}
                    disabled={true}
                />
                <p className="text-sm font-medium text-[#666666]">
                    ${receiveTokenInfo?.price ? (receiveTokenInfo.price * (payAmount || 0)).toFixed(2) : '0.00'}
                </p>
            </div>

            <div className="h-[60px] w-full">
                {(() => {
                    const isDisabled =
                        isInitializing ||
                        !payTokenBalance ||
                        !payToken ||
                        !receiveToken ||
                        !payAmount ||
                        !receiveAmount ||
                        payAmount > payTokenBalance;
                    const isNotConnected = !isInitializing && !isConnected;

                    const buttonConfig = {
                        disabled: {
                            className: 'bg-[#f6f6f6] text-[#999999] cursor-not-allowed',
                            text: (() => {
                                if (isInitializing || !payTokenBalance) return t('swap.swapBtn.init');
                                if (!payToken || !receiveToken) return t('swap.swapBtn.select');
                                if (!payAmount || !receiveAmount) return t('swap.swapBtn.enterAmount');
                                if (payAmount > payTokenBalance)
                                    return t('swap.swapBtn.insufficient', { symbol: payToken });
                                return '';
                            })(),
                            textClassName: 'text-[#999999]',
                            onClick: undefined,
                        },
                        active: {
                            className: 'bg-swap-btn text-white cursor-pointer',
                            text: isNotConnected ? t('swap.swapBtn.connect') : t('swap.swapBtn.swap'),
                            textClassName: 'text-[#fff]',
                            onClick: isNotConnected ? () => setShowLoginModal(true) : onSwapChange,
                        },
                        swap: {
                            className: 'bg-swap-btn text-white cursor-pointer',
                            text: 'Swap with ' + swapRouter,
                            textClassName: 'text-[#fff]',
                            onClick: onSwapRouterChange,
                        },
                    };

                    const config = isDisabled
                        ? buttonConfig.disabled
                        : walletMode === 'wallet' && swapRouter !== 'ICPEx'
                          ? buttonConfig.swap
                          : buttonConfig.active;

                    return (
                        <div
                            onClick={config.onClick || undefined}
                            className={cn(
                                'flex h-full w-full items-center justify-center rounded-[18px] text-lg font-semibold',
                                config.className,
                            )}
                        >
                            <p className={cn('text-lg font-semibold', config.textClassName)}>{config.text}</p>
                        </div>
                    );
                })()}
            </div>

            {payTokenInfo?.price && receiveTokenInfo?.price && (
                <div className="mt-3 flex w-full items-center justify-between">
                    <p className="text-sm font-medium text-[#666]">
                        1 {payToken} = {parseFloat(exchangeRate.toFixed(8))} {receiveToken}
                    </p>
                    <div className="flex items-center gap-x-1">
                        <Icon name="gas" className="h-3 w-3 text-[#666]" />
                        <p className="text-sm font-medium text-[#666]">$0.01</p>
                    </div>
                </div>
            )}

            {walletMode === 'wallet' && (
                <SwapRouters
                    swapRouter={swapRouter}
                    selectedRouter={setSwapRouter}
                    payTokenInfo={payTokenInfo}
                    receiveTokenInfo={receiveTokenInfo}
                />
            )}

            <PriceComponents payTokenInfo={payTokenInfo} receiveTokenInfo={receiveTokenInfo} />
        </div>
    );
}

export default SwapPage;
