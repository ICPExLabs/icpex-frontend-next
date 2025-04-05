import { routes } from './routes';

import './styles/global.css';

import { useRoutes } from 'react-router';

function App() {
    const views = useRoutes(routes);
    return <>{views}</>;
}

export default App;
