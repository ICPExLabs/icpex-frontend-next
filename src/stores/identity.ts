import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { TokenInfo } from '@/canister/swap/swap.did.d';
import { ConnectedIdentity } from '@/types/identity';
import { isDevMode } from '@/utils/env';

interface IdentityStore {
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;

    showInfoModal: boolean;
    setShowInfoModal: (show: boolean) => void;

    connectedIdentity: ConnectedIdentity | undefined;
    setConnectedIdentity: (connectedIdentity: ConnectedIdentity | undefined) => void;

    tokenList: TokenInfo[];
    setTokenList: (tokenList: TokenInfo[]) => void;
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
            setShowLoginModal: (showLoginModal) => set({ showLoginModal }),

            showInfoModal: false,
            setShowInfoModal: (showInfoModal) => set({ showInfoModal }),

            connectedIdentity: undefined,
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
                return set({ ...delta });
            },

            tokenList: undefined,
            setTokenList: (tokenList) => set({ tokenList }),
        })),
        {
            enabled: isDev,
            name: STORE_NAME,
        },
    ),
);

// Devtools setup
if (isDev) {
    mountStoreDevtool(STORE_NAME, useIdentityStore);
}
