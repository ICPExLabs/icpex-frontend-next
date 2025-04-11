import { AnimatePresence, motion } from 'framer-motion';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/stores/app';
import { cn } from '@/utils/classNames';
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
    const { currentTheme, setTheme } = useAppStore();

    const menuItems: MenuItem[] = [
        {
            label: t('common.menu.twitter'),
            href: getImportMetaEnv('HEADER_MENU_TWITTER_LINK'),
            icon: <Icon name="x" className="h-3.5 w-3.5 text-[#999]" />,
        },
        {
            label: t('common.menu.discord'),
            href: getImportMetaEnv('HEADER_MENU_DISCORD_LINK'),
            icon: <Icon name="discord" className="h-4 w-4 text-[#999]" />,
        },
        {
            label: t('common.menu.telegram'),
            href: getImportMetaEnv('HEADER_MENU_TELEGRAM_LINK'),
            icon: <Icon name="telegram" className="h-4 w-4 text-[#999]" />,
        },
        {
            label: t('common.menu.whitePaper'),
            href: getImportMetaEnv('HEADER_MENU_WHITEPAPER_LINK'),
            icon: <Icon name="document" className="h-4 w-4 text-[#999]" />,
        },
        {
            label: t('common.menu.github'),
            href: getImportMetaEnv('HEADER_MENU_GITHUB_LINK'),
            icon: <Icon name="github" className="h-4 w-4 text-[#999]" />,
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
                        className="absolute top-[50px] right-0 z-50 w-[155px] rounded-[20px] border border-[#e3e8ff] bg-white p-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-1">
                            <div className="mb-2 rounded-full border-[1px] border-[#eeeeee] p-1">
                                <div className="flex items-center justify-center gap-x-3 text-sm font-medium">
                                    <div
                                        className={cn(
                                            'flex h-6 cursor-pointer items-center justify-center rounded-full px-2 leading-5 text-[#666]',
                                            currentTheme === 'system' && 'bg-[#07c160] text-[#fff]',
                                        )}
                                        onClick={() => setTheme('system')}
                                    >
                                        {t('common.menu.auto')}
                                    </div>
                                    <div
                                        className={cn(
                                            'flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#666]',
                                            currentTheme === 'light' && 'bg-[#07c160] text-[#fff]',
                                        )}
                                        onClick={() => setTheme('light')}
                                    >
                                        <Icon name="sun" className="h-[14px] w-[14px] flex-shrink-0 cursor-pointer" />
                                    </div>
                                    <div
                                        className={cn(
                                            'flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#666]',
                                            currentTheme === 'dark' && 'bg-[#07c160] text-[#fff]',
                                        )}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <Icon name="moon" className="h-[14px] w-[14px] flex-shrink-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            {menuItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex h-8 cursor-pointer items-center justify-center gap-x-3 rounded-lg px-2 hover:bg-[#eeeeee]"
                                    onClick={() => window.open(item.href, '_blank')}
                                >
                                    {item.icon}
                                    <p className="flex-1 text-sm font-medium text-black">{item.label}</p>
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
