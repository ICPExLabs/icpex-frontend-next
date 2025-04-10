import { useState } from 'react';

import Icon from '@/components/ui/icon';

interface RouteOption {
    name: string;
    logo: string;
    label?: string;
    amount: string;
    selected: boolean;
}

const SwapRouters = () => {
    const [selected, setSelected] = useState('KongSwap');

    const routes: RouteOption[] = [
        {
            name: 'KongSwap',
            logo: '', // placeholder image
            label: 'Best Router',
            amount: '0.53 ICP → 36,617.76 CHAT',
            selected: selected === 'KongSwap',
        },
        {
            name: 'ICPSwap',
            logo: '', // placeholder image
            amount: '0.5 ICP = 36,316.87 CHAT',
            selected: selected === 'ICPSwap',
        },
    ];

    return (
        <div className="mt-[30px] w-full gap-y-5">
            {routes.map((route) => (
                <div
                    key={route.name}
                    onClick={() => setSelected(route.name)}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                        route.selected ? 'border-[#7178FF] bg-indigo-50' : 'border-[#E4E9FF] bg-white'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {/* <img src={route.logo} alt={route.name} className="w-8 h-8 rounded-full" /> */}
                        {/* TODO: routers icon */}
                        <div className="h-8 w-8 rounded-full bg-white"></div>
                        <span className="text-sm font-medium text-[#666]">{route.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {route.label && (
                            <span className="rounded-md bg-[#EDEEFF] px-2 py-1 text-xs text-[#7178FF]">
                                {route.label}
                            </span>
                        )}
                        <span className="text-sm font-medium text-[#666]">{route.amount}</span>
                        {route.selected && <Icon name="checkbox" className="h-4 w-4 text-[#7178FF]" />}
                    </div>
                </div>
            ))}

            <div className="flex items-start gap-2 rounded-xl border border-[#FFDDDD] bg-red-50 p-3 text-sm text-[#FF5558]">
                <Icon name="warn" className="mt-0.5 h-10 w-10" />
                <p>
                    Using external routing may result in transaction failure with funds temporarily remaining in
                    external contracts.
                </p>
            </div>
        </div>
    );
};

export default SwapRouters;
