import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import { cn } from '@/utils/classNames';

import { LoginButton } from '../modals/login-modal';
import MenuModal from '../modals/menu-modal';
import Icon from '../ui/icon';

const NavComponents = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const navItems = [
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

const SearchComponents = () => {
    return (
        <div className="ml-[72px] flex h-full flex-1 items-center justify-center">
            <div className="flex h-full w-full max-w-[440px] items-center justify-center border">search box</div>
        </div>
    );
};

const Header = () => {
    return (
        <>
            <header
                className={cn(
                    'sticky top-0 right-0 left-0 z-[999] flex w-full flex-shrink-0 flex-col items-center justify-center border-b py-[19px]',
                )}
            >
                <div className="flex h-[40px] w-full max-w-[1460px] items-center px-[20px]">
                    <NavLink to="/">
                        <Icon name="logo" className="h-[30px] w-[113px]"></Icon>
                    </NavLink>

                    <NavComponents />
                    <SearchComponents />

                    <div className="flex gap-x-[10px]">
                        <MenuModal />
                        <LoginButton />
                    </div>
                </div>
            </header>
        </>
    );
};
export default Header;
