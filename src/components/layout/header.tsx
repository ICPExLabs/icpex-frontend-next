import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/utils/classNames';

import { LoginButton } from '../modals/login-modal';
import MenuModal from '../modals/menu-modal';
import Icon from '../ui/icon';

const NavComponents = () => {
    const location = useLocation();
    const [active, setActive] = useState('/');

    useEffect(() => {
        const { pathname } = location;

        setActive(pathname);
    }, [location]);

    return (
        <div className="ml-[40px] flex h-full w-[300px] items-center justify-center gap-x-[15px] border">
            <Link to="/" className={cn('text-[14px] text-black', active === '/' && 'text-[#7178FF]')}>
                swap
            </Link>

            <Link to="/pools" className={cn('text-[14px] text-black', active === '/pools' && 'text-[#7178FF]')}>
                pools
            </Link>

            <Link to="/explore" className={cn('text-[14px] text-black', active === '/explore' && 'text-[#7178FF]')}>
                explore
            </Link>

            <Link to="/tools" className={cn('text-[14px] text-black', active === '/tools' && 'text-[#7178FF]')}>
                tools
            </Link>
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
                    <Icon name="logo" className="h-[30px] w-[113px]"></Icon>
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
