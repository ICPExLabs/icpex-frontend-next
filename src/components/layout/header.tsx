import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { cn } from '@/utils/classNames';

const Header = ({ mode }: { mode: string }) => {
    const navigator = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 right-0 left-0 z-[999] flex h-[60px] w-full flex-shrink-0 flex-col justify-center bg-[#000] transition-all',
                )}
            >
                header
            </header>
        </>
    );
};
export default Header;
