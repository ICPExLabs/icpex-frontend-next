import { LocaleProvider } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { initIdentity } from './hooks/initIdentity';
import { setLanguage } from './locale';
import routes from './routes/routes';
import { useAppStore } from './stores/app';

function App() {
    const views = useRoutes(routes);

    const { language, designLang, initThemeListener } = useAppStore();
    useEffect(() => setLanguage(language), [language]);

    // 综合要初始化的动作
    const initial = () => {
        // init theme
        initThemeListener();

        // 加载登录信息
        initIdentity();
    };

    initial();

    return <LocaleProvider locale={designLang}>{views}</LocaleProvider>;
}

export default App;
