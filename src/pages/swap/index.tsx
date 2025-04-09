import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/utils/classNames';

import PriceComponents from './components/price';
import SettingComponents from './components/setting';

function SwapTabs({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const { t } = useTranslation();
    const [active, setActive] = useState('/');

    useEffect(() => {
        const { pathname } = location;

        setActive(pathname);
    }, [location]);

    return (
        <div className="mx-auto mt-[80px] w-full max-w-[520px] flex-col">
            <div className="flex">
                <div className="flex flex-1 items-center gap-x-[15px]">
                    <Link
                        to="/swap"
                        className={cn(
                            'rounded-full px-5 py-2 text-center text-base font-semibold text-black',
                            (active === '/' || active === '/swap') && 'bg-[#7178FF] text-white',
                        )}
                    >
                        {t('swap.swap.title')}
                    </Link>
                    <Link
                        to="/limit"
                        className={cn(
                            'rounded-full px-5 py-2 text-center text-base font-semibold text-black',
                            active === '/limit' && 'bg-[#7178FF] text-white',
                        )}
                    >
                        {t('swap.limit.title')}
                    </Link>
                </div>

                <SettingComponents />
            </div>

            <div className="mt-[10px] flex w-full">{children}</div>

            <PriceComponents />
        </div>
    );
}

export default SwapTabs;
