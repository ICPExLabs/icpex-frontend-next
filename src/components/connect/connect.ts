import { createClient as create, IConnector } from '@connect2ic/core';

import { ConnectedIdentity, ConnectType } from '@/types/identity';

import { principal2account } from '../../utils/account';
import { getConnectDerivationOrigin } from '../../utils/env';
import { isPrincipalText } from '../../utils/principals';
import { getActorCreatorByActiveProvider } from './creator';
import { CustomInternetIdentity } from './providers/ii';
import { CustomPlugWallet } from './providers/plug';

export const getIIFrame = (): string => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const w = 768;
    const h = 630;
    const left = Math.floor((width - w) / 2);
    const top = Math.floor((height - h) / 2);
    return `toolbar=0,location=0,menubar=0,width=${w},height=${h},left=${left},top=${top}`;
};

export const createClient = () => {
    // todo whitelist
    const whitelist = [];
    const derivationOrigin = getConnectDerivationOrigin();
    // console.debug(`derivationOrigin ====> ${derivationOrigin}`);

    const globalProviderConfig = {
        appName: 'ICPEx',
        dev: true,
        host: 'https://icp0.io', // 'https://boundary.ic0.app'
        // host: window.location.origin,
        // host: import.meta.env.CONNECT_HOST,
        customDomain: derivationOrigin,
        whitelist,
    };

    // custom II
    const iiProvider = new CustomInternetIdentity({
        windowOpenerFeatures: window.innerWidth < 768 ? undefined : getIIFrame(),
        derivationOrigin,
    });
    // custom Plug
    const plugProvider = new CustomPlugWallet();

    return create({
        globalProviderConfig,
        providers: [
            iiProvider as any,
            plugProvider,
            // other providers...
        ],
    });
};

// check connected
export const checkConnected = (
    last: ConnectedIdentity | undefined,
    {
        isConnected,
        principal,
        provider,
    }: {
        isConnected: boolean;
        principal: string | undefined;
        provider: IConnector | undefined;
    },
    callback: () => void,
    handleIdentity: (identity: ConnectedIdentity) => Promise<void>, // new
    err?: () => void,
) => {
    const failed = () => err && err(); // error callback
    if (!isConnected) return failed();
    if (!principal || !isPrincipalText(principal)) return failed();
    if (!provider) return failed();
    const connectType = provider.meta.id;

    if (!['ii', 'plug'].includes(connectType)) {
        console.error(`what a provider id: ${connectType}`);
        return failed();
    }
    if (last?.principal === principal && last?.connectType === connectType) {
        callback();
        return;
    }
    const next: ConnectedIdentity = {
        connectType: connectType as ConnectType,
        principal,
        account: principal2account(principal),
        creator: getActorCreatorByActiveProvider(provider),
        requestWhitelist: (() => {
            switch (connectType) {
                case 'plug':
                    return async (whitelist: string[]) => provider['ic'].requestConnect({ whitelist }); // plug requestConnect
            }
            return async () => true;
        })(),
    };

    handleIdentity(next).finally(callback);
};
