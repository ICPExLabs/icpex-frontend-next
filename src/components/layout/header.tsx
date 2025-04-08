import { useScroll } from 'ahooks';
import { NavLink } from 'react-router-dom';

// import { useAppStore } from '@/stores/app';
import { cn } from '@/utils/classNames';

import { LoginButton } from '../modals/login-modal';
import MenuModal from '../modals/menu-modal';
import Icon from '../ui/icon';
import NavComponents from './nav';
import SearchComponents from './search';

const Header = () => {
    const scroll = useScroll(document);
    // const theme = useAppStore((state) => state.theme);
    // const changeTheme = useAppStore((state) => state.toggleTheme);
    // const { theme, changeTheme } = useAppStore();

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
                        {/* theme change */}
                        {/* <div
                            onClick={() => changeTheme()}
                            className={cn(
                                'flex h-[40px] w-[40px] cursor-pointer items-center justify-center focus:outline-none',
                            )}
                        >
                            <Icon
                                name={theme ?? 'light'}
                                className="h-7 w-7 flex-shrink-0 cursor-pointer transition-transform duration-200"
                            />
                        </div> */}
                        <MenuModal />
                        <LoginButton />
                    </div>
                </div>
            </header>
        </>
    );
};
export default Header;
