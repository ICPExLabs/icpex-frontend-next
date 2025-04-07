import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import Icon from '../ui/icon';

const MenuModal = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                            {['Menu Item 1', 'Menu Item 2', 'Menu Item 3'].map((item, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                                >
                                    {item}
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
