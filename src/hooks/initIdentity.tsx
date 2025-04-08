import { useConnect } from '@connect2ic/react';

import { checkConnected } from '@/components/connect/connect';
import { useIdentityStore } from '@/stores/identity';
import { writeLastConnectType } from '@/utils/storage';

export const InitIdentity = () => {
    const { connectedIdentity, setConnectedIdentity, setShowLoginModal } = useIdentityStore();

    useConnect({
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
        onDisconnect: () => setConnectedIdentity(undefined), // 退出登录
    });
};
