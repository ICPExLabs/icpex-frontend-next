import { Button } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '@/components/ui/icon';
import { cn } from '@/utils/classNames';

type TokenType = {
    name: string;
    symbol: string;
    icon: string;
};
interface AmountInputProps {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    token: TokenType;
    className?: string;
}

export function AmountInput({ value, onChange, placeholder = '0.00', className = '', token }: AmountInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        if (inputValue === '') {
            onChange(undefined);
            return;
        }

        if (inputValue.startsWith('.')) inputValue = '0' + inputValue;
        if (/^\d*\.?\d*$/.test(inputValue)) {
            onChange(inputValue === '' ? undefined : inputValue);
        }
    };

    return (
        <div className={cn('mt-2 flex justify-between', className)}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border-none bg-transparent text-3xl font-semibold text-[#C9D2FC] focus:ring-0 focus:outline-none"
            />
            <div className="flex w-30 cursor-pointer items-center space-x-2 rounded-full bg-[#E6EBFF] px-2 text-sm font-medium">
                {/* TODO icon */}
                <div className="h-6 w-6 shrink-0 rounded-full bg-white"></div>
                <div className="flex-1 text-left">{token.symbol}</div>
                <div className="flex h-4 w-4 shrink-0 items-center">
                    <Icon name="arrow-down" className="h-3 w-3" />
                </div>
            </div>
        </div>
    );
}

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
            </div>
        </div>
    );
}

export default SwapPage;
