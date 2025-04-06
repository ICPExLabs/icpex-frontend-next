import { Locale } from '@douyinfe/semi-ui/lib/es/locale/interface';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { setLanguage } from '@/locale';
import { SupportedLanguage } from '@/types/app';
import { isDevMode } from '@/utils/env';

type ThemeMode = 'light' | 'dark';

interface AppState {
    language: SupportedLanguage;
    designLang: Locale;
    theme: ThemeMode;
    setLanguage: (language: SupportedLanguage) => void;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    initThemeListener: () => () => void;
}

const isDev = isDevMode();
const STORAGE_KEY = 'CombinedAppStore';

// Theme utility functions
const applyTheme = (theme: ThemeMode) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (theme === 'dark') {
        document.body.setAttribute('theme-mode', 'dark');
    } else {
        document.body.removeAttribute('theme-mode');
    }
};

const getSystemTheme = (): ThemeMode => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const createThemeListener = (set: (state: Partial<AppState>) => void) => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const theme = e.matches ? 'dark' : 'light';
        set({ theme });
        applyTheme(theme);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
};

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                language: 'en',
                designLang: en_US,
                theme: getSystemTheme(),

                setLanguage: (language) => {
                    setLanguage(language);
                    set({ language, designLang: language === 'zh-CN' ? zh_CN : en_US });
                },

                setTheme: (theme) => {
                    set({ theme });
                    applyTheme(theme);
                },

                toggleTheme: () => {
                    const newTheme = get().theme === 'light' ? 'dark' : 'light';
                    set({ theme: newTheme });
                    applyTheme(newTheme);
                },

                initThemeListener: () => {
                    applyTheme(get().theme);
                    return createThemeListener(set);
                },
            }),
            {
                name: STORAGE_KEY,
            },
        ),
        {
            enabled: isDev,
            name: 'AppStore',
        },
    ),
);

if (isDev) {
    mountStoreDevtool('AppStore', useAppStore);
}
