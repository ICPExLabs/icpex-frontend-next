import { Button } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '@/components/ui/icon';
import { cn } from '@/utils/classNames';

import AmountInput from './components/amount-input';

function LimitPage() {
    const { t } = useTranslation();
    const [payAmount, setPayAmount] = useState<string | undefined>();
    const [receiveAmount, setReceiveAmount] = useState<string | undefined>();

    const options = ['Market', '5%', '10%', '20%'];
    const [selectedType, setSelectedType] = useState('Market');
    // setExpiry
    const [expiry] = useState('Never');

    return (
        <div className="flex w-full">
            <div className="w-full">
                <div className="mb-2 rounded-2xl border border-[#EAEDFF] bg-[#f9fafe] p-5">
                    <div className="mb-5 text-base font-medium text-[#666]">{t('swap.swap.pay')}</div>
                    <AmountInput
                        className="mb-5 flex justify-between"
                        value={payAmount}
                        onChange={setPayAmount}
                        placeholder="0.00"
                        token={{
                            name: 'ICP',
                            symbol: 'ICP',
                            icon: 'ICP',
                        }}
                    />

                    <div className="flex w-full items-center justify-between">
                        <div className="text-xs font-medium text-[#666]">$0.00</div>
                        <div className="flex items-center space-x-1.5">
                            <Icon name="wallet" className="h-3 w-4 text-[#666]" />
                            <div className="text-xs font-medium text-[#666]">
                                <span>{'0.53'}</span>
                                <span className="ml-1">{'ICP'}</span>
                            </div>
                            <div className="flex items-center text-xs font-medium text-[#7178FF]">
                                <div className="flex h-6 cursor-pointer items-center rounded-l-full border border-[#E4E9FF] px-2">
                                    {t('swap.swap.half')}
                                </div>
                                <div className="flex h-6 cursor-pointer items-center rounded-r-full border border-[#E4E9FF] px-2">
                                    {t('swap.swap.max')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mb-2 rounded-2xl bg-[#F2F4FF] p-5">
                    <div className="absolute -top-7 left-1/2 flex translate-x-[-50%] cursor-pointer justify-center">
                        <Icon name="exchange" className="h-10 w-10" />
                    </div>
                    <div className="mb-5 text-base font-medium text-[#666]">{t('swap.swap.receive')}</div>
                    <AmountInput
                        className="mb-5 flex justify-between"
                        value={receiveAmount}
                        onChange={setReceiveAmount}
                        placeholder="0.00"
                        token={{
                            name: 'CHAT',
                            symbol: 'CHAT',
                            icon: 'chat',
                        }}
                    />
                    <div className="text-xs font-medium text-[#666]">$0.00</div>
                </div>

                <div className="mb-4 rounded-2xl border border-[#EAEDFF] bg-[#f9fafe] p-5">
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
                                            'cursor-pointer rounded-full border border-[#E4E9FF] px-4 py-1 text-sm font-medium text-[#7178FF]',
                                            selectedType === opt && 'border-[#7178FF] bg-[#7178FF] text-white',
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
                    className="!h-14 w-full !rounded-xl bg-gradient-to-br from-[#7236FE] to-[#7178FF] !text-lg font-medium text-white disabled:!from-[#F2F4FF] disabled:!to-[#F2F4FF] disabled:!text-[#97A0C9]"
                    disabled={false}
                >
                    {t('swap.setting.confirm')}
                </Button>

                <div className="mt-3 flex items-start gap-2 rounded-2xl border border-[#EAEDFF] p-4 text-sm text-[#666]">
                    <Icon name="info" className="mt-1 h-4 w-4 text-[#97A0C9]" />
                    <p>
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
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LimitPage;
