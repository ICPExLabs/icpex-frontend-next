import { IConnector } from '@connect2ic/core';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';

import { ActorCreator, ConnectedIdentity } from '@/types/identity';
import { getConnectHost } from '@/utils/env';

// connect2ic to activeProvider
export const getActorCreatorByActiveProvider = (activeProvider: IConnector): ActorCreator => {
    return async <T>(idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        const result = await activeProvider.createActor<ActorSubclass<T>>(canisterId, idlFactory as any);
        if (result.isOk()) return result.value;
        throw new Error(result.error.message);
    };
};

// Anonymous identity
export const getAnonymousActorCreatorByAgent = (): ActorCreator => {
    return async <T>(idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        const agent = new HttpAgent({ host: getConnectHost() });
        return Actor.createActor<T>(idlFactory, { agent, canisterId });
    };
};

export const createAnonymousIdentity = (): ConnectedIdentity => {
    return {
        connectType: 'ii',
        principal: '2vxsx-fae',
        account: 'd8fc424ca350a7fba64a100efb5180b4c14dfab6b8b04c34319569a2a40ba1f7',
        creator: getAnonymousActorCreatorByAgent(),
        requestWhitelist: async () => true,
    };
};

export const anonymous: ConnectedIdentity = createAnonymousIdentity();
