import { RouteObject } from 'react-router';

import ExplorePage from '@/pages/explore';
import PoolsPage from '@/pages/pools';
import SwapPage from '@/pages/swap';
import ToolsPage from '@/pages/tools';

export const routes: RouteObject[] = [
    { path: '/', element: <SwapPage /> },
    { path: '/pools', element: <PoolsPage /> },
    { path: '/explore', element: <ExplorePage /> },
    { path: '/tools', element: <ToolsPage /> },
];
