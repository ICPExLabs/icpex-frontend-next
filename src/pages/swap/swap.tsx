import { Button } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '@/components/ui/icon';

import AmountInput from './components/amount-input';
import SwapRouters from './components/swap-routers';

function SwapPage() {
    const { t } = useTranslation();
    const [payAmount, setPayAmount] = useState<string | undefined>();
    const [receiveAmount, setReceiveAmount] = useState<string | undefined>();

    return (
        <div className="flex w-full">
            <div className="w-full">
                <div className="mb-2 rounded-2xl border border-[#EAEDFF] bg-[#f9fafe] p-5">
                    <div className="mb-5 text-base font-medium text-[#666]">You Pay</div>
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
                                    Half
                                </div>
                                <div className="flex h-6 cursor-pointer items-center rounded-r-full border border-[#E4E9FF] px-2">
                                    Max
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mb-4 rounded-2xl bg-[#F2F4FF] p-5">
                    <div className="absolute -top-7 left-1/2 flex translate-x-[-50%] cursor-pointer justify-center">
                        <Icon name="exchange" className="h-10 w-10" />
                    </div>
                    <div className="mb-5 text-base font-medium text-[#666]">You Receive</div>
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
