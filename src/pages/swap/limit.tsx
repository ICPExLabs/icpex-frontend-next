import { Button } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '@/components/ui/icon';
import { useTokenInfoAndBalanceBySymbol } from '@/hooks/useToken';
import { cn } from '@/utils/classNames';

import AmountInput from './components/amount-input';

function LimitPage() {
    const { t } = useTranslation();

    const options = ['Market', '5%', '10%', '20%'];
    const [selectedType, setSelectedType] = useState('Market');
    // setExpiry
    const [expiry] = useState('Never');

    const [payAmount, setPayAmount] = useState<number | undefined>();
    const [payToken, setPayToken] = useState<string | undefined>('ICP');
    const payTokenInfo = useTokenInfoAndBalanceBySymbol(payToken);
    const [payTokenBalance, setPayTokenBalance] = useState<number | undefined>(0.53);

    const [receiveAmount, setReceiveAmount] = useState<number | undefined>();
    const [receiveToken, setReceiveToken] = useState<string | undefined>();
    const receiveTokenInfo = useTokenInfoAndBalanceBySymbol(receiveToken);

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

    useEffect(() => {
        // ! get token balance
        setPayTokenBalance(999);
    }, [payTokenInfo]);

    useEffect(() => {
        // ! get token balance
    }, [receiveTokenInfo]);

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
                />
                <p className="text-sm font-medium text-[#666666]">
                    ${receiveTokenInfo?.price ? (receiveTokenInfo.price * (payAmount || 0)).toFixed(2) : '0.00'}
                </p>
            </div>

            <div className="mb-4 rounded-[18px] border border-[#e3e8ff] bg-[#fff] px-5 py-[17px]">
                <div className="space-y-4 text-left">
                    <div className="text-sm text-[#666]">
                        {t('swap.limit.limitTip1')} <span className="font-medium text-black">ICP</span>{' '}
                        {t('swap.limit.limitTip2')}
                    </div>
                    <div className="item-center flex justify-between">
                        <div className="text-4xl font-medium text-black">520.34</div>
                        <div className="flex items-center gap-x-1">
                            {/* TODO: token icon */}
                            <div className="h-6 w-6 shrink-0 rounded-full bg-white"></div>
                            <span className="text-base font-medium text-[#272E4D]">CHAT</span>
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between">
                        <div className="flex justify-center gap-2">
                            {options.map((opt) => (
                                <div
                                    key={opt}
                                    onClick={() => setSelectedType(opt)}
                                    className={cn(
                                        'cursor-pointer rounded-full border border-[#E4E9FF] px-4 py-1 text-sm font-medium text-[#07c160]',
                                        selectedType === opt && 'border-[#07c160] bg-[#07c160] text-white',
                                    )}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span>{t('swap.limit.expiry')}</span>
                            <div className="flex cursor-pointer items-center gap-2">
                                <span className="font-medium text-black">{expiry}</span>
                                <Icon name="arrow-down" className="h-3 w-3 text-[#666]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                theme="solid"
                size="large"
                className="!h-14 w-full !rounded-xl bg-gradient-to-br from-[#7236FE] to-[#07c160] !text-lg font-medium text-white disabled:!from-[#F2F4FF] disabled:!to-[#F2F4FF] disabled:!text-[#97A0C9]"
                disabled={false}
            >
                {t('swap.setting.confirm')}
            </Button>

            <div className="mt-3 flex items-start gap-2 rounded-[18px] border border-[#EAEDFF] p-4 text-sm text-[#666]">
                <Icon name="info" className="mt-1 h-4 w-4 text-[#97A0C9]" />
                <div>
                    {t('swap.setting.info')}
                    <div
                        className="cursor-pointer text-blue-500 underline"
                        onClick={() =>
                            window.open(
                                'https://support.uniswap.org/hc/en-us/articles/24300813697933-Why-did-my-limit-order-fail-or-not-execute',
                                '_black',
                            )
                        }
                    >
                        {t('swap.setting.learn')}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LimitPage;
