import { useConnect } from '@connect2ic/react';
import { useScroll } from 'ahooks';
import { NavLink } from 'react-router-dom';

import { cn } from '@/utils/classNames';

import { LoginButton } from '../modals/login-modal';
import MenuModal from '../modals/menu-modal';
import { UserInfoButton } from '../modals/user-modal';
import Icon from '../ui/icon';
import NavComponents from './nav';
import SearchComponents from './search';
import { SwitchWalletButton } from './switch-wallet';

const Header = () => {
    const { isConnected, isInitializing } = useConnect();

    const scroll = useScroll(document);

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 right-0 left-0 z-[999] flex w-full flex-shrink-0 flex-col items-center justify-center py-[19px] duration-75',
                    scroll?.top !== 0 && 'bg-[#fff]/30 shadow-md backdrop-blur-[10px]',
                )}
            >
                <div className="flex h-[40px] w-full max-w-[1460px] items-center px-[20px]">
                    <NavLink to="/">
                        <Icon name="logo" className="h-[30px] w-[113px]"></Icon>
                    </NavLink>

                    <NavComponents />
                    <SearchComponents />

                    <div className="flex flex-1 items-center justify-end gap-x-[10px]">
                        <MenuModal />

                        {isInitializing ? (
                            <div className="group flex h-10 w-[100px] cursor-not-allowed items-center justify-center rounded-3xl bg-[#F2F4FF]">
                                <p className="text-sm font-medium text-[#999999]">Connect</p>
                            </div>
                        ) : isConnected ? (
                            <>
                                <SwitchWalletButton />
                                <UserInfoButton />
                            </>
                        ) : (
                            <LoginButton />
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};
export default Header;
