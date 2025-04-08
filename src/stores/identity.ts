import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { ConnectedIdentity } from '@/types/identity';
import { isDevMode } from '@/utils/env';

interface IdentityState {
    showLoginModal: boolean;
    showInfoModal: boolean;
    connectedIdentity: ConnectedIdentity | undefined;
}

interface IdentityActions {
    setShowLoginModal: (show: boolean) => void;
    setShowInfoModal: (show: boolean) => void;
    setConnectedIdentity: (connectedIdentity: ConnectedIdentity | undefined) => void;
}

interface IdentityStore extends IdentityState {
    actions: IdentityActions;
}

const STORE_NAME = 'IdentityStore';
const isDev = isDevMode();

// reset connected state
const resetConnectedState = (connectedIdentity?: ConnectedIdentity) => {
    return {
        showLoginModal: false,
        showInfoModal: false,
        connectedIdentity,
    };
};

export const useIdentityStore = create<IdentityStore>()(
    devtools(
        subscribeWithSelector((set, get) => ({
            showLoginModal: false,
            showInfoModal: false,
            connectedIdentity: undefined,
            actions: {
                setShowLoginModal: (showLoginModal) => set({ showLoginModal }),
                setShowInfoModal: (showInfoModal) => set({ showInfoModal }),
                setConnectedIdentity: (connectedIdentity: ConnectedIdentity | undefined) => {
                    // console.warn('identity state connected', connectedIdentity);
                    let delta: Partial<IdentityState> = {};
                    if (connectedIdentity === undefined) {
                        delta = resetConnectedState(connectedIdentity); // logout
                    } else {
                        // connected
                        const { connectedIdentity: old } = get();
                        if (old === undefined) {
                            delta = resetConnectedState(connectedIdentity); // no connect, new
                        } else if (old.principal === connectedIdentity.principal) {
                            delta = { connectedIdentity }; // no change
                        } else {
                            delta = resetConnectedState(connectedIdentity); // change principal
                        }
                    }
                    console.debug('🚀 ~ connectedIdentity:', connectedIdentity);
                    return set({ ...delta });
                },
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
export const useConnectedIdentity = () => useIdentityStore((state) => state.connectedIdentity);
export const useIdentityActions = () => useIdentityStore((state) => state.actions);

// Devtools setup
if (isDev) {
    mountStoreDevtool(STORE_NAME, useIdentityStore);
}
