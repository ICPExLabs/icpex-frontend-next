import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/utils/classNames';

import PriceComponents from './components/price';
import SettingComponents from './components/setting';

function SwapTabs({ children }: { children: React.ReactNode }) {
    const location = useLocation();
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
                            'text-[14px] text-black',
                            (active === '/' || active === '/swap') && 'text-[#7178FF]',
                        )}
                    >
                        Swap
                    </Link>
                    <Link to="/limit" className={cn('text-[14px] text-black', active === '/limit' && 'text-[#7178FF]')}>
                        Limit
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
