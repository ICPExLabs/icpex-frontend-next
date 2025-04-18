import { useConnect } from '@connect2ic/react';
import { useInterval } from 'ahooks';
import { useEffect } from 'react';

import { checkConnected } from '@/components/connect/connect';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { writeLastConnectType } from '@/utils/storage';

import { initBalance } from './useToken';

export const useInitIdentity = () => {
    const { connectedIdentity, setConnectedIdentity, setShowLoginModal } = useIdentityStore();
    const { tokenList, clearAllTokenBalance } = useTokenStore();

    const { isConnected } = useConnect({
        onConnect: (connected: any) => {
            const principal = connected.principal;
            const provider = connected.activeProvider;

            checkConnected(
                connectedIdentity,
                {
                    isConnected: true,
                    principal,
                    provider,
                },
                () => {
                    setShowLoginModal(false);
                },
                async (identity) => {
                    console.log('🚀 ~ identity:', identity);
                    writeLastConnectType(identity.connectType); // set last login type to local storage
                    setConnectedIdentity(identity);
                },
            );
        },
        onDisconnect: () => {
            setConnectedIdentity(undefined);
            clearAllTokenBalance();
        },
    });

    useEffect(() => {
        if (isConnected && tokenList && connectedIdentity) {
            initBalance(connectedIdentity, tokenList);
        }
    }, [isConnected, tokenList, connectedIdentity]);
};
