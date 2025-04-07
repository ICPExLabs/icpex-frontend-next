export type ConnectType = 'ii' | 'plug';

export type ConnectedIdentity = {
    connectType: ConnectType; // login type
    principal: string; // principal id
    account: string;
    creator: ActorCreator; // actor creator
    requestWhitelist: (whitelist: string[]) => Promise<boolean>;
};

export type ActorCreator = <T>(
    idlFactory: IDL.InterfaceFactory, // candid
    canister_id: string, // canister_id
) => Promise<ActorSubclass<T>>;
