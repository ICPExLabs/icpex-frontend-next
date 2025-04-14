import { LocaleProvider } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { useInitIdentity } from './hooks/initIdentity';
import { useInitTokenList } from './hooks/initTokenList';
import { setLanguage } from './locale';
import routes from './routes/routes';
import { useAppStore } from './stores/app';
import { useTokenStore } from './stores/token';

function App() {
    const views = useRoutes(routes);

    const { language, designLang, initThemeListener } = useAppStore();
    const { tokenList } = useTokenStore();

    useEffect(() => setLanguage(language), [language]);

    useEffect(() => {
        initThemeListener();
    }, [initThemeListener]);

    useInitIdentity();

    const { isInitializing, refreshing } = useInitTokenList();
    useEffect(() => {
        if (typeof isInitializing === 'undefined') return;
        if (typeof isInitializing === 'boolean' && !isInitializing) {
            setTimeout(() => {
                refreshing(tokenList);
                console.log('🚀 ~ App ~ Refreshing AllTokensPrice');
            }, 10000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitializing, refreshing]);

    return <LocaleProvider locale={designLang}>{views}</LocaleProvider>;
}

export default App;
