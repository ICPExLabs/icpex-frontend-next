import { useConnect } from '@connect2ic/react';
import { InputNumber, Modal, Toast } from '@douyinfe/semi-ui';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { add_liquidity_to_swap } from '@/canister/swap/apis';
import { useTokenBalanceByCanisterId, useTokenInfoByCanisterId } from '@/hooks/useToken';
import { TypePoolsListItem } from '@/pages/pools';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';

import HeaderModal from '../ui/header-modal';
import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';
import { PriceFormatter } from '../ui/priceFormatter';

export const AddLiquidityModal = ({
    isShow,
    closeModal,
    data,
}: {
    isShow: boolean;
    closeModal: () => void;
    data: TypePoolsListItem;
}) => {
    const { t } = useTranslation();
    const { isConnected } = useConnect();
    const [amount, setAmount] = useState<number | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const { connectedIdentity } = useIdentityStore();
    const { updateAllTokenBalance, setShowTransferInModal, setTransferInDefaultToken } = useTokenStore();

    const tokenAInfo = useTokenInfoByCanisterId(data.tokenACanisterId);
    const tokenABalanceInfo = useTokenBalanceByCanisterId(data.tokenACanisterId);
    const tokenABalance = useMemo(() => {
        if (!tokenABalanceInfo || !tokenAInfo) return undefined;
        return Number(
            new BigNumber(tokenABalanceInfo.contractWalletBalance).dividedBy(
                new BigNumber(10).pow(new BigNumber(tokenAInfo.decimals)),
            ),
        );
    }, [tokenAInfo, tokenABalanceInfo]);

    const tokenBInfo = useTokenInfoByCanisterId(data.tokenBCanisterId);
    const tokenBBalanceInfo = useTokenBalanceByCanisterId(data.tokenBCanisterId);
    const tokenBBalance = useMemo(() => {
        if (!tokenBBalanceInfo || !tokenBInfo) return 0;
        return Number(
            new BigNumber(tokenBBalanceInfo.contractWalletBalance).dividedBy(
                new BigNumber(10).pow(new BigNumber(tokenBInfo.decimals)),
            ),
        );
    }, [tokenBInfo, tokenBBalanceInfo]);

    const amm = useMemo(() => {
        const [numerator, denominator] = data.fee_rate.split('/');
        const feeRatio = BigNumber(1)
            .minus(BigNumber(numerator).div(BigNumber(denominator)))
            .toNumber();

        return feeRatio;
    }, [data]);

    const amountOut = useMemo(() => {
        if (!amount || !data.liquidityProportion) return 0;
        return amount * data.liquidityProportion;
    }, [amount, data]);

    const amountPrice = useMemo(() => {
        if (!amountOut || !tokenBInfo) return 0;
        return amountOut * (tokenBInfo?.priceUSD || 0);
    }, [amountOut, tokenBInfo]);

    const onMaxChange = () => {
        if (!tokenABalance) return;

        setAmount(truncateDecimalToBN(tokenABalance, 8));
    };

    const onAddChange = () => {
        setTransferInDefaultToken(tokenAInfo?.symbol || 'ICP');
        setShowTransferInModal(true);
    };

    const onAddLiquidity = () => {
        if (!connectedIdentity) return;
        if (!tokenAInfo || !tokenBInfo) return;
        if (!amountOut || !amount) return;

        setLoading(true);
        const amount_text = new BigNumber(amount)
            .multipliedBy(new BigNumber(10).pow(new BigNumber(tokenAInfo.decimals)))
            .toFixed()
            .split('.')[0];
        const amount_out_text = new BigNumber(amountOut)
            .multipliedBy(new BigNumber(10).pow(new BigNumber(tokenBInfo.decimals)))
            .toFixed()
            .split('.')[0];

        add_liquidity_to_swap(connectedIdentity, {
            owner: data.dummy_canister_id,
            amm: data.ammInfo.amm,
            token0: data.ammInfo.token0,
            token1: data.ammInfo.token1,
            amount: amount_text,
            amount_out: amount_out_text,
            slippage: 0.5,
        })
            .then(() => {
                Toast.success(t('pools.addLiquidity.success'));
                updateAllTokenBalance(connectedIdentity, data.tokenACanisterId);
                updateAllTokenBalance(connectedIdentity, data.tokenBCanisterId);
                setAmount(undefined);
                closeModal();
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal
            centered={true}
            visible={isShow}
            footer={<></>}
            header={<></>}
            maskClosable={true}
            onCancel={() => {
                if (!loading) {
                    closeModal();
                }
            }}
        >
            <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">
                <HeaderModal title={t('pools.addLiquidity.title')} closeModal={closeModal} />
                <div className="mt-[22px] flex w-full items-center">
                    <TokenLogo canisterId={data.tokenACanisterId} className="h-8 w-8 overflow-hidden rounded-full" />
                    <TokenLogo
                        canisterId={data.tokenBCanisterId}
                        className="relative left-[-8px] h-8 w-8 overflow-hidden rounded-full"
                    />
                    {tokenAInfo && tokenBInfo && (
                        <p className="ml-[2px] text-base font-medium text-black">
                            {tokenAInfo?.symbol}/{tokenBInfo?.symbol}
                        </p>
                    )}
                    {amm && (
                        <div className="ml-3 flex h-[18px] items-center justify-center rounded border border-[#07c160] px-2">
                            <p className="text-xs font-medium text-[#07c160]">{truncateDecimalToBN(1 - amm, 4)}%</p>
                        </div>
                    )}
                </div>
                <p className="mt-6 mb-2 flex w-full text-xs leading-tight font-medium text-[#666666]">
                    {t('pools.addLiquidity.deposit')}
                </p>
                <div className="mb-[15px] w-full rounded-xl border border-[#dddddd] bg-white p-[15px]">
                    <div className="amount-input flex w-full items-center justify-between">
                        <InputNumber
                            value={amount}
                            onChange={(val) => {
                                setAmount(val as number);
                            }}
                            placeholder="0.00"
                            hideButtons
                            disabled={!tokenAInfo || !tokenBInfo}
                            min={0}
                            className="flex flex-1 bg-transparent !text-2xl font-medium text-[#999999]"
                        />
                        <div className="flex items-center gap-x-[9px]">
                            <TokenLogo
                                canisterId={data.tokenACanisterId}
                                className="h-6 w-6 overflow-hidden rounded-full"
                            />
                            <div className="text-lg font-medium text-black">{data.tokenASymbol}</div>
                        </div>
                    </div>
                    <div className="mt-[13px] flex w-full items-center justify-between">
                        <p className="text-sm font-medium text-[#666666]">
                            ${tokenAInfo?.priceUSD ? truncateDecimalToBN(tokenAInfo.priceUSD * (amount || 0)) : '0.00'}
                        </p>
                        {isConnected &&
                            (typeof tokenABalance === 'undefined' ? (
                                <Icon name="loading" className="mr-2 h-[14px] w-[14px] animate-spin text-[#07c160]" />
                            ) : (
                                <div className="flex items-center">
                                    <Icon name="wallet" className="h-3 w-[14px] text-[#666]" />
                                    <div className="ml-[6px] flex items-center">
                                        <p className="text-xs font-medium text-[#666]">
                                            {truncateDecimalToBN(tokenABalance)}
                                        </p>
                                        <p className="ml-[2px] text-xs font-medium text-[#666]">{data.tokenASymbol}</p>
                                    </div>
                                    <p
                                        className="ml-[9px] cursor-pointer text-xs font-medium text-[#07c160]"
                                        onClick={onAddChange}
                                    >
                                        Add+
                                    </p>
                                    <p
                                        className="ml-[9px] cursor-pointer text-xs font-medium text-[#07c160]"
                                        onClick={onMaxChange}
                                    >
                                        {t('swap.swap.max')}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="mb-[15px] w-full rounded-xl border border-[#dddddd] bg-white p-[15px]">
                    <div className="amount-input flex w-full items-center justify-between">
                        <p className="text-2xl font-medium text-[#999999]">{truncateDecimalToBN(amountOut, 4)}</p>
                        <div className="flex items-center gap-x-[9px]">
                            <TokenLogo
                                canisterId={data.tokenBCanisterId}
                                className="h-6 w-6 overflow-hidden rounded-full"
                            />
                            <div className="text-lg font-medium text-black">{data.tokenBSymbol}</div>
                        </div>
                    </div>
                    <div className="mt-[13px] flex w-full items-center justify-between">
                        <p className="text-sm font-medium text-[#666666]">${truncateDecimalToBN(amountPrice, 4)}</p>
                        <div className="flex items-center">
                            <Icon name="wallet" className="h-3 w-[14px] text-[#666]" />
                            <div className="ml-[6px] flex items-center">
                                <p className="text-xs font-medium text-[#666]">{truncateDecimalToBN(tokenBBalance)}</p>
                                <p className="ml-[2px] text-xs font-medium text-[#666]">{data.tokenBSymbol}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex h-12 w-full items-center justify-between rounded-xl border border-[#dddddd] bg-white px-[14px]">
                    <p className="text-xs font-medium text-[#666666]">
                        {t('pools.addLiquidity.proportion')} 1/
                        <PriceFormatter price={data.liquidityProportion} unit="" />
                    </p>
                    <Icon name="setting2" className="h-3.5 w-[14.07px] cursor-pointer text-[#999999]" />
                </div>
                <div
                    onClick={onAddLiquidity}
                    className={cn(
                        'relative mt-[17px] flex h-[52px] w-full items-center justify-center rounded-[14px]',
                        amountOut && 'cursor-pointer bg-gradient-to-r from-[#08be65] to-[#2161f9] text-white',
                        (loading || !amountOut) && 'cursor-not-allowed bg-[#f6f6f6] text-[#999999] duration-75',
                    )}
                >
                    {loading && <Icon name="loading" className="mr-2 h-[12px] w-[12px] animate-spin" />}

                    <p className="text-base font-semibold">
                        {loading ? t('pools.list.loading') : t('pools.addLiquidity.confirm')}
                    </p>
                </div>
            </div>
        </Modal>
    );
};
