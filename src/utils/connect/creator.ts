import { IConnector } from '@connect2ic/core';
import { ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';

import { ActorCreator } from '@/types/identity';

export const getActorCreatorByActiveProvider = (activeProvider: IConnector): ActorCreator => {
    return async <T>(idlFactory: IDL.InterfaceFactory, canisterId: string) => {
        const result = await activeProvider.createActor<ActorSubclass<T>>(canisterId, idlFactory as any);
        if (result.isOk()) return result.value;
        throw new Error(result.error.message);
    };
};
