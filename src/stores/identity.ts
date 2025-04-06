import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { isDevMode } from '@/utils/env';

interface IdentityState {
    showLoginModal: boolean;
    showInfoModal: boolean;
    actions: {
        setShowLoginModal: (show: boolean) => void;
        setShowInfoModal: (show: boolean) => void;
    };
}

const STORE_NAME = 'IdentityStore';
const isDev = isDevMode();

export const useIdentityStore = create<IdentityState>()(
    devtools(
        subscribeWithSelector((set) => ({
            showLoginModal: false,
            showInfoModal: false,
            actions: {
                setShowLoginModal: (showLoginModal) => set({ showLoginModal }),
                setShowInfoModal: (showInfoModal) => set({ showInfoModal }),
            },
        })),
        {
            enabled: isDev,
            name: STORE_NAME,
        },
    ),
);

export const useShowLoginModal = () => useIdentityStore((state) => state.showLoginModal);
export const useShowInfoModal = () => useIdentityStore((state) => state.showInfoModal);
export const useIdentityActions = () => useIdentityStore((state) => state.actions);

// Devtools setup
if (isDev) {
    mountStoreDevtool(STORE_NAME, useIdentityStore);
}
