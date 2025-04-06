import { RouteObject } from 'react-router-dom';

import PageLayout from '@/components/layout/page';
import ExplorePage from '@/pages/explore';
import PoolsPage from '@/pages/pools';
import SwapTabs from '@/pages/swap';
import LimitPage from '@/pages/swap/limit';
import SwapPage from '@/pages/swap/swap';
import ToolsPage from '@/pages/tools';

const routes: RouteObject[] = [
    {
        path: '/',
        element: (
            <PageLayout>
                <SwapTabs>
                    <SwapPage />
                </SwapTabs>
            </PageLayout>
        ),
    },
    {
        path: '/swap',
        element: (
            <PageLayout>
                <SwapTabs>
                    <SwapPage />
                </SwapTabs>
            </PageLayout>
        ),
    },
    {
        path: '/limit',
        element: (
            <PageLayout>
                <SwapTabs>
                    <LimitPage />
                </SwapTabs>
            </PageLayout>
        ),
    },
    {
        path: '/pools',
        element: (
            <PageLayout>
                <PoolsPage />
            </PageLayout>
        ),
    },
    {
        path: '/explore',
        element: (
            <PageLayout>
                <ExplorePage />
            </PageLayout>
        ),
    },
    {
        path: '/tools',
        element: (
            <PageLayout>
                <ToolsPage />
            </PageLayout>
        ),
    },
];

export default routes;
