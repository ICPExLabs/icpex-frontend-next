import { AnimatePresence, motion } from 'framer-motion';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getImportMetaEnv } from '@/utils/env';

import Icon from '../ui/icon';

type MenuItem = {
    label: string;
    href: string;
    icon: ReactElement;
};

const MenuModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const menuItems: MenuItem[] = [
        {
            label: t('common.menu.twitter'),
            href: getImportMetaEnv('HEADER_MENU_TWITTER_LINK'),
            icon: <Icon name="x" className="h-5 w-5" />,
        },
        {
            label: t('common.menu.discord'),
            href: getImportMetaEnv('HEADER_MENU_DISCORD_LINK'),
            icon: <Icon name="discord" className="h-5 w-5" />,
        },
        {
            label: t('common.menu.telegram'),
            href: getImportMetaEnv('HEADER_MENU_TELEGRAM_LINK'),
            icon: <Icon name="telegram" className="h-5 w-5" />,
        },
        {
            label: t('common.menu.whitePaper'),
            href: getImportMetaEnv('HEADER_MENU_WHITEPAPER_LINK'),
            icon: <Icon name="document" className="h-5 w-5" />,
        },
        {
            label: t('common.menu.github'),
            href: getImportMetaEnv('HEADER_MENU_GITHUB_LINK'),
            icon: <Icon name="github" className="h-5 w-5" />,
        },
    ];

    return (
        <div className="relative flex">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none"
                aria-label="Menu"
                aria-expanded={isOpen}
            >
                <Icon
                    name={isOpen ? 'menu-hover' : 'menu'}
                    className="h-[40px] w-[40px] flex-shrink-0 cursor-pointer transition-transform duration-200"
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute top-[50px] right-0 z-50 w-[160px] rounded-2xl bg-white p-3 shadow-lg outline outline-[#e3e8ff]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-2">
                            {menuItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex cursor-pointer items-center justify-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                    onClick={() => window.open(item.href, '_blank')}
                                >
                                    {item.icon}
                                    <div className="flex-1 text-left">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isOpen && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export default MenuModal;
