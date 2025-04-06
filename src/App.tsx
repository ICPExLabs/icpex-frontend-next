import { useEffect } from 'react';
import { useRoutes } from 'react-router';

import { setLanguage } from './locale';
import { routes } from './routes/routes';
import { useAppStore } from './stores/app';

function App() {
    const views = useRoutes(routes);

    const { language, initThemeListener } = useAppStore();
    useEffect(() => setLanguage(language), [language]);
    useEffect(() => {
        initThemeListener();
    }, [initThemeListener]);

    return <>{views}</>;
}

export default App;
