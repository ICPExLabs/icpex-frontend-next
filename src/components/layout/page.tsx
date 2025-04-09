import { useRef } from 'react';

import LoginModal from '../modals/login-modal';
import UserInfoModal from '../modals/user-modal';
import Footer from './footer';
import Header from './header';

function PageLayout({ children }: { children: React.ReactNode }) {
    const childRef = useRef(null);

    return (
        <>
            {/* main content */}
            <div className="relative flex min-h-screen w-screen flex-col items-center">
                <div
                    className="absolute top-0 left-0 h-full w-full object-cover"
                    style={{ background: 'linear-gradient(180deg, #DCE4FF 0%, #F7F7F7 27.88%, #FFF 66.35%)' }}
                />

                <Header />

                <div className="relative flex w-full" ref={childRef}>
                    {children}
                </div>

                <Footer />
            </div>

            {/* login modal */}
            <LoginModal />

            {/* userInfo modal */}
            <UserInfoModal />
        </>
    );
}
export default PageLayout;
