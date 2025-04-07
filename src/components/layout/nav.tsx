import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import { cn } from '@/utils/classNames';

export interface NavItem {
    path: string;
    label: string;
    matchPaths?: string[];
    isExternal?: boolean;
}
const NavComponents = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const navItems: NavItem[] = [
        {
            path: '/',
            label: t('common.nav.swap'),
            matchPaths: ['/', '/swap', '/limit'],
        },
        { path: '/pools', label: t('common.nav.pools') },
        { path: '/explore', label: t('common.nav.explore') },
        { path: '/tools', label: t('common.nav.tools') },
        {
            path: 'https://ai.icpex.org',
            label: t('common.nav.ai'),
            isExternal: true,
        },
    ];

    const renderLink = (item: (typeof navItems)[0]) => {
        const isActive = item.matchPaths
            ? item.matchPaths.includes(pathname)
            : !item.isExternal && pathname === item.path;

        const linkClassName = cn(
            'relative flex justify-center text-base font-semibold text-[#666] duration-75 hover:text-[#000]',
            isActive && 'text-[#000]',
        );

        const indicator = (
            <span
                className={cn(
                    'absolute bottom-[-6px] block h-[3px] w-7 rounded-[3px] bg-[#7077ff] opacity-0 duration-75',
                    isActive && 'opacity-100',
                )}
            />
        );

        if (item.isExternal || item.path.startsWith('http')) {
            return (
                <a href={item.path} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                    {item.label}
                    {indicator}
                </a>
            );
        }

        return (
            <NavLink to={item.path} className={linkClassName}>
                {item.label}
                {indicator}
            </NavLink>
        );
    };

    return (
        <div className="ml-[40px] flex h-full w-[300px] items-center justify-center gap-x-[22px]">
            {navItems.map((item) => (
                <div key={item.path}>{renderLink(item)}</div>
            ))}
        </div>
    );
};

export default NavComponents;
