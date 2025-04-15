import { useConnect } from '@connect2ic/react';
import { Toast } from '@douyinfe/semi-ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { contract_swap, execute_complete_swap } from '@/components/api/swap';
import Icon from '@/components/ui/icon';
import { useTokenBalanceBySymbol, useTokenInfoBySymbol } from '@/hooks/useToken';
import { useSwapFees } from '@/hooks/useWalletSwap';
import { useAppStore } from '@/stores/app';
import { useIdentityStore } from '@/stores/identity';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';

import AmountInput from './components/amount-input';
import PriceComponents from './components/price';
import SwapRouters from './components/swap-routers';

export type TypeSwapRouter = 'KongSwap' | 'ICPSwap' | 'ICPEx';

function SwapPage() {
    const { t } = useTranslation();
    const { swapSlippage, walletMode } = useAppStore();

    const { isConnected, isInitializing } = useConnect();
    const { connectedIdentity, setShowLoginModal } = useIdentityStore();

    const [payAmount, setPayAmount] = useState<number | undefined>();
    const [payToken, setPayToken] = useState<string | undefined>('ICP');
    const payTokenInfo = useTokenInfoBySymbol(payToken);
    const payBalanceToken = useTokenBalanceBySymbol(payToken);
    const payBalance = useMemo(() => {
        if (!payBalanceToken || !payTokenInfo) return 0;
        if (walletMode === 'wallet') {
            return Number(
                new BigNumber(payBalanceToken.walletBalance).dividedBy(
                    new BigNumber(10).pow(new BigNumber(payTokenInfo.decimals)),
                ),
            );
        }
        if (walletMode === 'contract') {
            return Number(
                new BigNumber(payBalanceToken.contractWalletBalance).dividedBy(
                    new BigNumber(10).pow(new BigNumber(payTokenInfo.decimals)),
                ),
            );
        }
        return 0;
    }, [payBalanceToken, walletMode, payTokenInfo]);

    const [receiveAmount, setReceiveAmount] = useState<number | undefined>();
    const [receiveToken, setReceiveToken] = useState<string | undefined>();
    const receiveTokenInfo = useTokenInfoBySymbol(receiveToken);
    const receiveBalanceToken = useTokenBalanceBySymbol(receiveToken);
    const receiveBalance = useMemo(() => {
        if (!receiveBalanceToken || !payTokenInfo) return 0;
        if (walletMode === 'wallet') {
            return Number(
                new BigNumber(receiveBalanceToken.walletBalance).dividedBy(
                    new BigNumber(10).pow(new BigNumber(payTokenInfo.decimals)),
                ),
            );
        }
        if (walletMode === 'contract') {
            return Number(
                new BigNumber(receiveBalanceToken.contractWalletBalance).dividedBy(
                    new BigNumber(10).pow(new BigNumber(payTokenInfo.decimals)),
                ),
            );
        }
        return 0;
    }, [receiveBalanceToken, walletMode, payTokenInfo]);

    const [swapRouter, setSwapRouter] = useState<TypeSwapRouter>('ICPEx');
    const [loading, setLoading] = useState<boolean>(false);

    // loading
    const { fee, amountOut, oneAmountOut } = useSwapFees({
        from: payTokenInfo,
        to: receiveTokenInfo,
        fromAmount: payAmount,
    });

    const exchangeRate = useMemo(() => {
        if (!payTokenInfo?.priceUSD || !receiveTokenInfo?.priceUSD) return 0;
        return payTokenInfo?.priceUSD / receiveTokenInfo?.priceUSD;
    }, [payTokenInfo, receiveTokenInfo]);

    const onSwapDirectionChange = () => {
        if (!receiveToken || !receiveTokenInfo || !payToken || !payTokenInfo) {
            return;
        }

        setPayToken(receiveToken);
        setReceiveToken(payToken);
    };

    const onHalfChange = () => {
        if (!payBalance) return;
        setPayAmount(truncateDecimalToBN(payBalance / 2));
    };

    const onMaxChange = () => {
        if (!payBalance) return;
        setPayAmount(truncateDecimalToBN(payBalance));
    };

    const onSwapChange = async () => {
        if (!connectedIdentity) return;

        try {
            // TODO: tip warning
            if (!payTokenInfo || !receiveTokenInfo) return;

            if (!payAmount || !amountOut) return;

            setLoading(true);

            const amountOutMin = BigNumber(amountOut)
                .multipliedBy(BigNumber(100).minus(swapSlippage).dividedBy(100))
                .multipliedBy(BigNumber(10).pow(receiveTokenInfo.decimals))
                .toFixed(0)
                .toString();

            const amountIn = BigNumber(payAmount).multipliedBy(BigNumber(10).pow(payTokenInfo.decimals)).toString();

            const params = {
                from_canister_id: payTokenInfo.canister_id.toString(),
                to_canister_id: receiveTokenInfo.canister_id.toString(),
                amount_in: amountIn,
                amount_out_min: amountOutMin.toString(),
                fee,
                decimals: payTokenInfo.decimals,
            };

            const result = await contract_swap(connectedIdentity, params);
            console.log('🚀 ~ onSwapRouterChange ~ result:', result);

            setLoading(false);
            Toast.success('Swap successfully');
        } catch (error) {
            console.error('🚀 ~ onSwapChange ~ error:', error);
            setLoading(false);
            Toast.error('Swap failed');
        }
    };

    // swap wallet
    const onSwapRouterChange = async () => {
        console.log('wallet mode swap');
        if (!connectedIdentity) return;

        try {
            // TODO: tip warning
            if (!payTokenInfo || !receiveTokenInfo) return;

            if (!payAmount || !amountOut) return;

            setLoading(true);

            const amountOutMin = BigNumber(amountOut)
                .multipliedBy(BigNumber(100).minus(swapSlippage).dividedBy(100))
                .multipliedBy(BigNumber(10).pow(receiveTokenInfo.decimals))
                .toFixed(0)
                .toString();

            const amountIn = BigNumber(payAmount).multipliedBy(BigNumber(10).pow(payTokenInfo.decimals)).toString();

            const params = {
                from_canister_id: payTokenInfo.canister_id.toString(),
                to_canister_id: receiveTokenInfo.canister_id.toString(),
                amount_in: amountIn,
                amount_out_min: amountOutMin.toString(),
                fee,
                decimals: payTokenInfo.decimals,
            };

            const result = await execute_complete_swap(connectedIdentity, params);
            console.log('🚀 ~ onSwapRouterChange ~ result:', result);

            setLoading(false);
            Toast.success('Swap successfully');
        } catch (error) {
            console.error('🚀 ~ onSwapChange ~ error:', error);
            setLoading(false);
            Toast.error('Swap failed');
        }
    };

    useEffect(() => {
        if (walletMode === 'contract') {
            setSwapRouter('ICPEx');
        }
    }, [walletMode]);

    useEffect(() => {
        if (!payAmount || !exchangeRate) {
            setReceiveAmount(undefined);
        } else {
            setReceiveAmount(truncateDecimalToBN(payAmount * exchangeRate));
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
                        $
                        {payTokenInfo?.priceUSD
                            ? truncateDecimalToBN(payTokenInfo.priceUSD * (payAmount || 0))
                            : '0.00'}
                    </p>
                    {!payBalanceToken ? (
                        <Icon name="loading" className="mr-2 h-[14px] w-[14px] animate-spin text-[#7178FF]" />
                    ) : (
                        <div className="flex items-center">
                            <Icon name="wallet" className="h-3 w-[14px] text-[#666]" />
                            <div className="ml-[6px] flex items-center">
                                <p className="text-xs font-medium text-[#666]">{truncateDecimalToBN(payBalance)}</p>
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
                    )}
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
                    amount={amountOut ? Number(Number(amountOut).toFixed(3)) : undefined}
                    onAmountChange={() => {}}
                    token={receiveToken}
                    onTokenChange={setReceiveToken}
                    tokenInfo={receiveTokenInfo}
                    disabled={true}
                />
                <p className="text-sm font-medium text-[#666666]">
                    ${receiveTokenInfo?.priceUSD ? (receiveTokenInfo.priceUSD * (payAmount || 0)).toFixed(2) : '0.00'}
                </p>
            </div>

            <div className="h-[60px] w-full">
                {(() => {
                    const isDisabled =
                        isInitializing ||
                        !payBalance ||
                        !payToken ||
                        !receiveToken ||
                        !payAmount ||
                        !receiveAmount ||
                        payAmount > payBalance ||
                        loading;
                    const isNotConnected = !isInitializing && !isConnected;

                    const buttonConfig = {
                        disabled: {
                            className: 'bg-[#f6f6f6] text-[#999999] cursor-not-allowed',
                            text: (() => {
                                if (isInitializing || typeof payBalance === 'undefined') return t('swap.swapBtn.init');
                                if (!payToken || !receiveToken) return t('swap.swapBtn.select');
                                if (!payAmount || !receiveAmount) return t('swap.swapBtn.enterAmount');
                                if (!payBalance) return t('swap.swapBtn.insufficientEmpty');
                                if (payAmount > payBalance) return t('swap.swapBtn.insufficient', { symbol: payToken });
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
                            {loading && (
                                <Icon name="loading" className="mr-2 h-[24px] w-[24px] animate-spin text-[#7178FF]" />
                            )}
                            <p className={cn('text-lg font-semibold', config.textClassName)}>{config.text}</p>
                        </div>
                    );
                })()}
            </div>

            {payTokenInfo?.priceUSD && receiveTokenInfo?.priceUSD && (
                <div className="mt-3 flex w-full items-center justify-between">
                    <p className="text-sm font-medium text-[#666]">
                        1 {payToken} = {oneAmountOut ? Number(oneAmountOut) : truncateDecimalToBN(exchangeRate, 4)}{' '}
                        {receiveToken}
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

            <PriceComponents
                payTokenInfo={payTokenInfo}
                payBalance={payBalanceToken ? payBalance : undefined}
                receiveTokenInfo={receiveTokenInfo}
                receiveBalance={receiveBalanceToken ? receiveBalance : undefined}
            />
        </div>
    );
}

export default SwapPage;
