import { InputNumber } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { SelectTokenModal } from '@/components/modals/select-token-modal';
import Icon from '@/components/ui/icon';
import { TokenLogo } from '@/components/ui/logo';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';

interface AmountInputProps {
    className?: string;
    placeholder?: string;
    amount: number | undefined;
    onAmountChange: (value: number) => void;
    token?: string;
    onTokenChange: (value: string) => void;
    tokenInfo?: TokenInfo | undefined;
    onTokenInfoChange: (value: TokenInfo) => void;
}

const AmountInput = ({
    className = '',
    placeholder = '0.00',
    amount,
    onAmountChange,
    token,
    onTokenChange,
    tokenInfo,
    onTokenInfoChange,
}: AmountInputProps) => {
    const { t } = useTranslation();
    const { tokenList } = useTokenStore();

    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);

    useEffect(() => {
        if (token && tokenList) {
            tokenList.map((item) => {
                if (item.symbol === token) {
                    onTokenInfoChange(item);
                }
            });
        }
    }, [token, tokenList, onTokenInfoChange]);

    return (
        <>
            <div className={cn('amount-input mt-2 flex justify-between', className)}>
                <InputNumber
                    type="text"
                    value={amount}
                    onChange={(val) => {
                        onAmountChange(val as number);
                    }}
                    placeholder={placeholder}
                    hideButtons
                    disabled={!tokenInfo}
                    min={0}
                    className="flex flex-1 bg-transparent !text-4xl font-semibold"
                />
                <div
                    onClick={() => setShowSelectTokenModal(true)}
                    className="flex h-10 w-[150px] flex-shrink-0 cursor-pointer items-center justify-between gap-x-2 rounded-full bg-[#E6EBFF] px-[10px] text-sm font-medium"
                >
                    {token && tokenInfo ? (
                        <>
                            <TokenLogo className="h-6 w-6 shrink-0" canisterId={tokenInfo.canister_id.toString()} />
                            <p className="line-clamp-1 flex-1 text-left text-base font-medium break-all text-[#272e4d]">
                                {token}
                            </p>
                            <Icon name="arrow-down" className="h-3 w-3 text-[#272e4d]" />
                        </>
                    ) : (
                        <>
                            <p className="flex flex-shrink-0 items-center justify-center text-base font-medium text-[#999]">
                                {t('swap.swap.select')}
                            </p>
                            <Icon name="arrow-down" className="h-3 w-3 text-[#999]" />
                        </>
                    )}
                </div>
            </div>

            <SelectTokenModal
                isShow={showSelectTokenModal}
                setIsShow={setShowSelectTokenModal}
                selectToken={(tokenInfo) => {
                    onTokenChange(tokenInfo.symbol);
                    setShowSelectTokenModal(false);
                }}
            />
        </>
    );
};

export default AmountInput;
