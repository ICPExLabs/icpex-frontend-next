import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/stores/app';
import { cn } from '@/utils/classNames';

export const SwitchWalletButton = () => {
    const { t } = useTranslation();
    const { walletMode, setWalletMode } = useAppStore();

    return (
        <>
            <div className="relative flex h-10 flex-shrink-0 items-center rounded-3xl bg-[#f2f4ff] px-[5px]">
                <div
                    className={cn(
                        'flex h-8 cursor-pointer items-center rounded-3xl bg-transparent px-[10px] text-sm font-medium text-[#666666] duration-75 hover:text-[#272e4d]',
                        walletMode === 'contract' && 'bg-[#e4e9ff] text-[#272e4d]',
                    )}
                    onClick={() => setWalletMode('contract')}
                >
                    {t('common.switchWallet.contractWallet')}
                </div>
                <div
                    className={cn(
                        'flex h-8 cursor-pointer items-center rounded-3xl bg-transparent px-[10px] text-sm font-medium text-[#666666] duration-75 hover:text-[#272e4d]',
                        walletMode === 'wallet' && 'bg-[#e4e9ff] text-[#272e4d]',
                    )}
                    onClick={() => setWalletMode('wallet')}
                >
                    {t('common.switchWallet.wallet')}
                </div>
            </div>
        </>
    );
};
