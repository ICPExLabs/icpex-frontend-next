import { Connect2ICProvider } from '@connect2ic/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import i18n from './locale/index.ts';
import { createClient } from './utils/connect/connect.ts';

import 'animate.css';
import './assets/css/tailwind.css';
import './assets/css/fonts.scss';
import './assets/css/main.scss';
import './assets/iconfont/iconfont.js';

const queryClient = new QueryClient();

const connectClient = createClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Connect2ICProvider client={connectClient}>
                <QueryClientProvider client={queryClient}>
                    <I18nextProvider i18n={i18n}>
                        <App />
                    </I18nextProvider>
                </QueryClientProvider>
            </Connect2ICProvider>
        </BrowserRouter>
    </StrictMode>,
);
