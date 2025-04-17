import { useConnect } from '@connect2ic/react';
import { Modal, Toast } from '@douyinfe/semi-ui';
import { useInterval } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSwap } from '@/hooks/useSwap';
import { TypeTokenPriceInfoVal } from '@/hooks/useToken';
import { useSwapFees } from '@/hooks/useWalletSwap';
import { TypeSwapRouter } from '@/pages/swap/swap';
import { TypeWalletMode, useAppStore } from '@/stores/app';
import { useIdentityStore } from '@/stores/identity';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';

import { contract_swap } from '../api/swap';
import HeaderModal from '../ui/header-modal';
import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';
import { PriceFormatter } from '../ui/priceFormatter';

// import { SwapRightToast } from '../ui/right-toast';

interface SwapConfirmProps {
    isShow: boolean;
    setIsShow: (isShow: boolean) => void;
    payTokenInfo: TypeTokenPriceInfoVal;
    receiveTokenInfo: TypeTokenPriceInfoVal;
    payAmount: number | undefined;
    swapRouter: TypeSwapRouter;
    payBalance: number;
    resetAmount: () => void;
    updateTokenBalance: () => void;
    setLoading: (loading: boolean) => void; // props loading
}

type DetailsItemType = {
    label: string;
    value: string | number;
    symbol?: string;
    type?: TypeWalletMode;
};

export const SwapDetailsItem = ({ item }: { item: DetailsItemType }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
                <div className="text-xs font-medium text-[#666]">{item.label}</div>
                <Icon name="info" className="ml-2 h-3 w-3 text-[#BFBFBF]" />
            </div>
            <div className="text-xs font-medium text-[#000000]">
                {item.symbol ? Number(item.value) : item.value} {item.symbol || ''}
            </div>
        </div>
    );
};

export const SwapConfirmModal = ({
    isShow,
    setIsShow,
    payTokenInfo,
    receiveTokenInfo,
    payAmount,
    swapRouter,
    payBalance,
    resetAmount,
    updateTokenBalance,
    setLoading: setSwapLoading,
}: SwapConfirmProps) => {
    const { t } = useTranslation();
    // const { showSwapConfirmModal, setShowSwapConfirmModal, updateAllTokenBalance } = useTokenStore();
    const { connectedIdentity, setShowLoginModal } = useIdentityStore();
    const { swapSlippage, walletMode } = useAppStore();
    const { isConnected, isInitializing } = useConnect();

    const [loading, setLoading] = useState<boolean>(false);
    // const [showToast, setShowToast] = useState<boolean>(false);

    const {
        // step,
        // successStep,
        execute_complete_swap,
        loading: swapLoading,
        // isSuccess,
        isError,
        // errorMessage,
    } = useSwap();

    useEffect(() => {
        if (isShow || swapLoading) return;

        setSwapLoading(false);
    }, [isShow, setSwapLoading, swapLoading]);

    const {
        // loading: calLoading,
        amm,
        fee,
        amountOut,
        isNoPool,
        deviation,
        // oneAmountOut,
        refetchAmountOut,
    } = useSwapFees({
        from: payTokenInfo,
        to: receiveTokenInfo,
        fromAmount: payAmount,
    });

    const amountOutMin = useMemo(() => {
        if (!amountOut) return 0;

        return BigNumber(amountOut)
            .multipliedBy(BigNumber(100).minus(swapSlippage).dividedBy(100))
            .multipliedBy(BigNumber(10).pow(receiveTokenInfo.decimals))
            .toFixed(0)
            .toString();
    }, [amountOut, receiveTokenInfo.decimals, swapSlippage]);

    const detailsItems: DetailsItemType[] = [
        {
            label: 'Price Deviation',
            value: `${deviation}%`,
        },
        {
            label: 'Slippage Tolerance',
            value: `${swapSlippage}%`,
        },
        {
            label: 'Minimum Received',
            value: BigNumber(amountOutMin).div(BigNumber(10).pow(receiveTokenInfo.decimals)).toString(),
            symbol: receiveTokenInfo.symbol,
        },
        {
            label: 'Order routing',
            value: swapRouter,
            type: 'wallet',
        },
        {
            label: 'Network cost',
            value: BigNumber(fee).div(BigNumber(10).pow(payTokenInfo.decimals)).toString(),
            symbol: payTokenInfo.symbol,
        },
    ];

    // update amount out 3s only show modal run
    useInterval(() => {
        if (payTokenInfo && receiveTokenInfo && payAmount && !loading && isShow) {
            console.log('update amount out');
            refetchAmountOut();
        }
    }, 3000);

    const payAmountUsd = useMemo(() => {
        if (!payTokenInfo) return 0;
        return payTokenInfo?.priceUSD ? truncateDecimalToBN(payTokenInfo.priceUSD * (payAmount || 0)) : 0;
    }, [payTokenInfo, payAmount]);

    const receiveAmountUsd = useMemo(() => {
        if (!payTokenInfo) return 0;
        return receiveTokenInfo?.priceUSD
            ? truncateDecimalToBN(receiveTokenInfo.priceUSD * (Number(amountOut) || 0))
            : 0;
    }, [payTokenInfo, receiveTokenInfo.priceUSD, amountOut]);

    const updateBalanceAndResetInput = useCallback(async () => {
        updateTokenBalance();
        refetchAmountOut();
        // reset input
        resetAmount();

        setIsShow(false);
    }, [refetchAmountOut, resetAmount, setIsShow, updateTokenBalance]);

    // contract swap
    const onContractSwap = async () => {
        if (!connectedIdentity) return;

        try {
            // TODO: tip warning
            if (!payTokenInfo || !receiveTokenInfo) return;

            if (!payAmount || !amountOut || !amm) return;

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
                amm,
                decimals: payTokenInfo.decimals,
            };
            console.log('🚀 ~ onSwapChange ~ params:', amountIn, '=======', amountOut, '========', params);

            const result = await contract_swap(connectedIdentity, params);
            console.log('🚀 ~ onWalletSwapChange ~ result:', result);

            setLoading(false);
            Toast.success('Swap successfully');
            updateBalanceAndResetInput();
        } catch (error) {
            console.error('🚀 ~ onSwapChange ~ error:', error);
            setLoading(false);
            Toast.error('Swap failed');
        }
    };

    // swap wallet
    const onWalletSwapChange = async () => {
        console.log('wallet mode swap');
        if (!connectedIdentity) return;

        try {
            // TODO: tip warning
            if (!payTokenInfo || !receiveTokenInfo) return;

            if (!payAmount || !amountOut || !amm) return;

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
                amm,
                withdraw_fee: receiveTokenInfo.fee.toString(), // withdrawFee
            };
            console.log('🚀 ~ onWalletSwapChange ~ params:', amountIn, '=======', amountOut, '========', params);

            // setShowToast(true);

            const result = await execute_complete_swap(params);
            console.log('🚀 ~ onWalletSwapChange ~ result:', result);

            setLoading(false);
            Toast.success('Swap successfully');
            updateBalanceAndResetInput();
        } catch (error) {
            console.error('🚀 ~ onSwapChange ~ error:', error);
            setLoading(false);
            Toast.error('Swap failed');
        }
    };

    return (
        <>
            {/* <SwapRightToast
                isShow={showToast}
                setIsShow={setShowToast}
                status={
                    'loading'
                    // swapLoading ? 'loading'
                    //     : isSuccess ? 'success'
                    //         : isError ? 'error'
                    //         : 'info'
                }
                content={step}
                duration={isSuccess || isError ? 3000 : undefined}
            /> */}

            <Modal
                centered={true}
                visible={isShow}
                footer={<></>}
                header={<></>}
                maskClosable={true}
                onCancel={() => {
                    if (loading) return;
                    setIsShow(false);
                }}
            >
                <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">
                    <HeaderModal title={t('swap.review.title')} closeModal={setIsShow} />

                    <div className="mt-[28px] w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex-col">
                                <div className="text-xl font-medium text-[#000]">
                                    {payAmount} {payTokenInfo.symbol}
                                </div>
                                <PriceFormatter
                                    className="text-sm font-medium text-[#666]"
                                    price={Number(payAmountUsd)}
                                />
                            </div>
                            <TokenLogo
                                canisterId={payTokenInfo.canister_id.toString()}
                                className="h-10 w-10 flex-shrink-0 rounded-full border border-[#EEEEEE] duration-75 group-hover:ml-[13px]"
                            />
                        </div>
                        <div className="relative my-[25px] border-b border-dashed border-[#DDDDDD]">
                            <Icon
                                name="swap-down"
                                className="absolute top-1/2 left-1/2 h-8 w-8 translate-x-[-50%] translate-y-[-50%]"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex-col">
                                <div className="text-xl font-medium text-[#000]">
                                    {truncateDecimalToBN(Number(amountOut), 8)} {receiveTokenInfo.symbol}
                                </div>
                                <PriceFormatter
                                    className="text-sm font-medium text-[#666]"
                                    price={Number(receiveAmountUsd)}
                                />
                            </div>
                            <TokenLogo
                                canisterId={receiveTokenInfo.canister_id.toString()}
                                className="h-10 w-10 flex-shrink-0 rounded-full border border-[#EEEEEE] duration-75 group-hover:ml-[13px]"
                            />
                        </div>

                        <div className="relative mt-[25px] flex w-full items-start justify-center space-x-2 rounded-2xl border border-dashed border-[#DDDDDD] pt-[26px] pb-[15px]">
                            <div className="absolute top-0 left-1/2 flex h-[22px] w-[100px] translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full bg-[#EEEEEE] text-sm font-medium text-[#666666]">
                                {t('swap.review.route')}
                            </div>

                            <div>
                                <TokenLogo
                                    canisterId={payTokenInfo.canister_id.toString()}
                                    className="h-9 w-9 flex-shrink-0 rounded-full border border-[#EEEEEE] duration-75 group-hover:ml-[13px]"
                                />
                                <div className="mt-[8px] text-center text-xs font-medium text-[#666]">
                                    {payTokenInfo.symbol}
                                </div>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center">
                                <Icon name="right" className="h-[12px] w-[18px] text-[#999999]" />
                            </div>
                            <div>
                                <TokenLogo
                                    canisterId={receiveTokenInfo.canister_id.toString()}
                                    className="h-9 w-9 flex-shrink-0 rounded-full border border-[#EEEEEE] duration-75 group-hover:ml-[13px]"
                                />
                                <div className="mt-[8px] text-center text-xs font-medium text-[#666]">
                                    {receiveTokenInfo.symbol}
                                </div>
                            </div>
                        </div>

                        <div className="mt-[15px] w-full flex-col space-y-[9px]">
                            {detailsItems.map((item) => (
                                <SwapDetailsItem item={item} key={item.label} />
                            ))}
                        </div>
                    </div>

                    <div className="mt-[17px] h-[52px] w-full">
                        {(() => {
                            const isNotConnected = !isInitializing && !isConnected;
                            const isDisabled =
                                !isNotConnected &&
                                (isInitializing ||
                                    !payBalance ||
                                    !payAmount ||
                                    !amountOut ||
                                    isNoPool ||
                                    payAmount > payBalance ||
                                    // calLoading || // loading calculate amount out
                                    loading || // loading contract swap
                                    swapLoading);

                            const buttonConfig = {
                                disabled: {
                                    className: 'bg-[#f6f6f6] text-[#999999] cursor-not-allowed',
                                    text: (() => {
                                        if (isInitializing || typeof payBalance === 'undefined')
                                            return t('swap.swapBtn.init');
                                        if (!payAmount) return t('swap.swapBtn.enterAmount');
                                        if (!payBalance) return t('swap.swapBtn.insufficientEmpty');
                                        if (isNoPool) return t('swap.swapBtn.noPool');
                                        if (payAmount > payBalance)
                                            return t('swap.swapBtn.insufficient', { symbol: payTokenInfo.symbol });
                                        return '';
                                    })(),
                                    textClassName: 'text-[#999999]',
                                    onClick: undefined,
                                },
                                active: {
                                    className: 'bg-swap-btn text-white cursor-pointer',
                                    text: isError ? t('swap.swapBtn.tryAgain') : t('swap.swapBtn.confirmSwap'),
                                    textClassName: 'text-[#fff]',
                                    onClick: onContractSwap,
                                },
                                connect: {
                                    className: 'bg-swap-btn text-white cursor-pointer',
                                    text: t('swap.swapBtn.connect'),
                                    textClassName: 'text-[#fff]',
                                    onClick: () => setShowLoginModal(true),
                                },
                                swap: {
                                    className: 'bg-swap-btn text-white cursor-pointer',
                                    text: isError ? t('swap.swapBtn.tryAgain') : t('swap.swapBtn.confirmSwap'),
                                    textClassName: 'text-[#fff]',
                                    onClick: onWalletSwapChange,
                                },
                            };

                            const config = isNotConnected
                                ? buttonConfig.connect
                                : isDisabled
                                  ? buttonConfig.disabled
                                  : walletMode === 'wallet'
                                    ? buttonConfig.swap
                                    : walletMode === 'contract'
                                      ? buttonConfig.active
                                      : buttonConfig.disabled;

                            return (
                                <div
                                    onClick={config.onClick || undefined}
                                    className={cn(
                                        'flex h-full w-full items-center justify-center rounded-[18px] text-lg font-semibold',
                                        config.className,
                                    )}
                                >
                                    {loading && (
                                        <Icon
                                            name="loading"
                                            className="mr-2 h-[24px] w-[24px] animate-spin text-[#07c160]"
                                        />
                                    )}
                                    <p className={cn('text-lg font-semibold', config.textClassName)}>{config.text}</p>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </Modal>
        </>
    );
};
