import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { SupportedLanguage } from '@/types/app';

// Import language resources
import enCommon from './langs/en/common.yml';
import enExplore from './langs/en/explore.yml';
import enPools from './langs/en/pools.yml';
import enSwap from './langs/en/swap.yml';
import enTools from './langs/en/tools.yml';
import zhCommon from './langs/zh/common.yml';
import zhExplore from './langs/zh/explore.yml';
import zhPools from './langs/zh/pools.yml';
import zhSwap from './langs/zh/swap.yml';
import zhTools from './langs/zh/tools.yml';
import { setHtmlPageLang } from './locales';

// Constants
const STORAGE_KEY = 'selectedLang';
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
const FALLBACK_LANGUAGE: SupportedLanguage = 'zh-CN';

// Type for language resources
type LanguageResources = {
    [key in SupportedLanguage]: {
        translation: {
            common: typeof enCommon;
            explore: typeof enExplore;
            pools: typeof enPools;
            swap: typeof enSwap;
            tools: typeof enTools;
        };
    };
};

// Language resources configuration
const resources: LanguageResources = {
    en: {
        translation: {
            common: enCommon,
            explore: enExplore,
            pools: enPools,
            swap: enSwap,
            tools: enTools,
        },
    },
    'zh-CN': {
        translation: {
            common: zhCommon,
            explore: zhExplore,
            pools: zhPools,
            swap: zhSwap,
            tools: zhTools,
        },
    },
};

// Get and validate stored language
const getValidLanguage = (): SupportedLanguage => {
    const storedLang = localStorage.getItem(STORAGE_KEY);

    if (storedLang === 'en' || storedLang === 'zh-CN') {
        return storedLang;
    }

    return FALLBACK_LANGUAGE;
};

// Initialize current language
let currentLanguage: SupportedLanguage = getValidLanguage();
localStorage.setItem(STORAGE_KEY, currentLanguage);

// i18n initialization
i18n.use(initReactI18next).init({
    resources,
    lng: currentLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: false,
    interpolation: {
        escapeValue: false,
    },
    detection: {
        caches: ['localStorage', 'sessionStorage', 'cookie'],
    },
});

// Language change handler
export const setLanguage = (language: SupportedLanguage): void => {
    if (language !== currentLanguage) {
        currentLanguage = language;
        localStorage.setItem(STORAGE_KEY, language);
        i18n.changeLanguage(language);
        setHtmlPageLang(language);
    }
};

export default i18n;
