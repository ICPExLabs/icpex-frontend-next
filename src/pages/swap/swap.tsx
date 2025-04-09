import { Button } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import Icon from '@/components/ui/icon';
import { useTokenPrice } from '@/hooks/useTokenPrice';

import AmountInput from './components/amount-input';
import SwapRouters from './components/swap-routers';

function SwapPage() {
    const { t } = useTranslation();

    const [payAmount, setPayAmount] = useState<number | undefined>();
    const [payToken, setPayToken] = useState<string | undefined>('ICP');
    const [payTokenInfo, setPayTokenInfo] = useState<TokenInfo | undefined>();
    const payTokenPrice = useTokenPrice(payTokenInfo?.canister_id.toString());
    const [payTokenBalance, setPayTokenBalance] = useState<number | undefined>(0.53);

    const [receiveAmount, setReceiveAmount] = useState<number | undefined>();
    const [receiveToken, setReceiveToken] = useState<string | undefined>();
    const [receiveTokenInfo, setReceiveTokenInfo] = useState<TokenInfo | undefined>();
    const receiveTokenPrice = useTokenPrice(receiveTokenInfo?.canister_id.toString());

    const onSwapDirectionChange = () => {
        if (!receiveToken || !receiveTokenInfo || !payToken || !payTokenInfo) {
            return;
        }

        setPayToken(receiveToken);
        setPayTokenInfo(receiveTokenInfo);

        setReceiveToken(payToken);
        setReceiveTokenInfo(payTokenInfo);
    };

    const onHalfChange = () => {
        if (!payTokenBalance) return;
        setPayAmount(payTokenBalance / 2);
    };

    const onMaxChange = () => {
        if (!payTokenBalance) return;
        setPayAmount(payTokenBalance);
    };

    useEffect(() => {
        // ! get token balance
        setPayTokenBalance(999);
    }, [payTokenInfo]);

    useEffect(() => {
        // ! get token balance
    }, [receiveTokenInfo]);

    return (
        <div className="flex w-full">
            <div className="w-full">
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
                        onTokenInfoChange={setPayTokenInfo}
                    />
                    <div className="flex w-full items-center justify-between">
                        <p className="text-sm font-medium text-[#666666]">
                            ${payTokenPrice?.price ? (payTokenPrice.price * (payAmount || 0)).toFixed(2) : '0.00'}
                        </p>
                        <div className="flex items-center">
                            <Icon name="wallet" className="h-3 w-[14px] text-[#666]" />
                            <div className="ml-[6px] flex items-center">
                                <p className="text-xs font-medium text-[#666]">{payTokenBalance}</p>
                                <p className="ml-[2px] text-xs font-medium text-[#666]">{payToken}</p>
                            </div>
                            <div className="ml-2 flex items-center text-xs font-medium text-[#7178FF]">
                                <p
                                    className="flex h-[20px] cursor-pointer items-center rounded-l-full border border-r-0 border-[#E4E9FF] px-2 text-xs font-medium text-[#7077ff]"
                                    onClick={onHalfChange}
                                >
                                    {t('swap.swap.half')}
                                </p>
                                <p
                                    className="flex h-[20px] cursor-pointer items-center rounded-r-full border border-[#E4E9FF] px-2 text-xs font-medium text-[#7077ff]"
                                    onClick={onMaxChange}
                                >
                                    {t('swap.swap.max')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mb-4 rounded-[18px] bg-[#F2F4FF] px-5 py-[17px]">
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
                        onTokenInfoChange={setReceiveTokenInfo}
                    />
                    <p className="text-sm font-medium text-[#666666]">
                        ${receiveTokenPrice?.price ? (receiveTokenPrice.price * (payAmount || 0)).toFixed(2) : '0.00'}
                    </p>
                </div>

                <Button
                    theme="solid"
                    size="large"
                    className="!h-14 w-full !rounded-xl bg-gradient-to-br from-[#7236FE] to-[#7178FF] !text-lg font-medium text-white disabled:!from-[#F2F4FF] disabled:!to-[#F2F4FF] disabled:!text-[#97A0C9]"
                    disabled={false}
                >
                    {t('swap.swap.connect')}
                    {/* TODO: Insufficient token */}
                    {/* {t('swap.swap.insufficient', { symbol: 'ICP' })} */}
                    {/* TODO: Enter an amount */}
                    {/* {t('swap.swap.enterAmount')} */}
                </Button>

                <div className="mt-3 flex items-center justify-between text-sm font-medium text-[#666]">
                    <div>1 ICP = 73,235.52 CHAT</div>
                    <div className="flex items-center gap-x-1">
                        <Icon name="gas" className="h-3 w-3 text-[#666]" />
                        <span>$0.01</span>
                    </div>
                </div>

                {/* todo only wallet mode show */}
                <SwapRouters />
            </div>
        </div>
    );
}

export default SwapPage;
