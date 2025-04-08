import { LocaleProvider } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { InitIdentity, InitTokenList } from './hooks/initIdentity';
import { setLanguage } from './locale';
import routes from './routes/routes';
import { useAppStore } from './stores/app';

function App() {
    const views = useRoutes(routes);

    const { language, designLang, initThemeListener } = useAppStore();
    useEffect(() => setLanguage(language), [language]);

    useEffect(() => {
        initThemeListener();
    }, [initThemeListener]);

    InitIdentity();

    InitTokenList();

    return <LocaleProvider locale={designLang}>{views}</LocaleProvider>;
}

export default App;
