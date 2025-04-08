import { useConnect } from '@connect2ic/react';
import { useEffect } from 'react';

import { checkConnected } from '@/components/connect/connect';
import { useConnectedIdentity, useIdentityActions } from '@/stores/identity';

export const InitIdentity = () => {
    const { setConnectedIdentity } = useIdentityActions();
    const connectedIdentity = useConnectedIdentity();

    const {
        isConnected,
        activeProvider: provider,
        principal,
    } = useConnect({
        onConnect: (connected: any) => {
            const principal = connected.principal;
            const provider = connected.activeProvider;
            console.log('app onConnect', principal, provider);

            checkConnected(
                connectedIdentity,
                {
                    isConnected: true,
                    principal,
                    provider,
                },
                () => {},
                async (identity) => setConnectedIdentity(identity),
            );
        },
        onDisconnect: () => setConnectedIdentity(undefined), // 退出登录
    });

    useEffect(() => {
        checkConnected(
            connectedIdentity,
            {
                isConnected,
                principal,
                provider,
            },
            () => {},
            async (identity) => setConnectedIdentity(identity),
        );
    }, [connectedIdentity, isConnected, principal, provider, setConnectedIdentity]);

    useEffect(() => {
        console.log(isConnected);
    }, [isConnected]);

    // useEffect(() => {
    //     console.log(isInitializing);
    // }, [isInitializing]);
};

export const InitTokenList = () => {};
