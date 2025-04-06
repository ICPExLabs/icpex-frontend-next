import { useTranslation } from 'react-i18next';

import { cn } from '../../utils/classNames';

const Footer = ({ mode }: { mode: string }) => {
    const { t } = useTranslation();

    return <div className={cn('relative hidden w-full bg-black md:flex', mode === 'home' && 'flex')}>footer</div>;
};
export default Footer;
