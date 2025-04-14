import { Toast } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { useAppStore } from '@/stores/app';
import { cn } from '@/utils/classNames';

import BatchComponents from './components/batch';
import SlippageComponents from './components/slippage';

function SwapTabs({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const { walletMode } = useAppStore();

    return (
        <div className="mx-auto mt-[50px] w-full max-w-[520px] flex-col">
            <div className="flex">
                <div className="flex flex-1 items-center gap-x-[15px]">
                    <Link
                        to="/swap"
                        className={cn(
                            'flex h-9 cursor-pointer items-center justify-center rounded-full px-5 text-center text-base font-semibold text-[#666]',
                            (pathname === '/' || pathname.includes('/swap')) && 'bg-[#07c160] text-white',
                        )}
                    >
                        {t('swap.swap.title')}
                    </Link>
                    <div
                        onClick={() => {
                            Toast.info(t('common.coming'));
                        }}
                        className={cn(
                            'flex h-9 cursor-pointer items-center justify-center rounded-full px-5 text-center text-base font-semibold text-[#666]',
                            pathname.includes('/limit') && 'bg-[#07c160] text-white',
                        )}
                    >
                        {t('swap.limit.title')}
                    </div>
                </div>

                <SlippageComponents />
                {walletMode === 'contract' && <BatchComponents />}
            </div>

            <div className="mt-[10px] flex w-full">{children}</div>
        </div>
    );
}

export default SwapTabs;
