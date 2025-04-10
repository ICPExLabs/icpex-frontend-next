import { getAnonymousActorCreatorByAgent } from '@/components/connect/creator';
import { ConnectedIdentity } from '@/types/identity.js';
import { bigint2string } from '@/utils/common/bigint.ts';
import { wrapOptionMap } from '@/utils/common/options.ts';
import { string2principal } from '@/utils/common/principal.ts';
import { hex2array } from '@/utils/hex.ts';

import { _SERVICE, TokenInfo } from './swap.did.d';
import { idlFactory } from './swap.did.ts';

const canisterID = 'piwiu-wiaaa-aaaaj-azzka-cai';

export const get_tokens_query = async () => {
    try {
        const create: _SERVICE = await getAnonymousActorCreatorByAgent()(idlFactory, canisterID);
        const res: TokenInfo[] = await create.tokens_query();
        return res;
    } catch (error) {
        console.error('Failed to fetch token list:', error);
        throw new Error(`Token query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};

// wallet balance
export const get_wallet_balance = async (identity: ConnectedIdentity): Promise<string> => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);
    const balance = await create.wallet_balance();

    return bigint2string(balance);
};

// tokens balance
export const get_tokens_balance = async (
    identity: ConnectedIdentity,
    arg: {
        owner: string;
        subaccount?: string;
    },
): Promise<{ canister_id: string; balance: string }[]> => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);

    const balances = await create.tokens_balance_of({
        owner: string2principal(arg.owner),
        subaccount: wrapOptionMap(arg.subaccount, hex2array),
    });

    return balances.map((d) => {
        return {
            canister_id: d[0].toString(),
            balance: bigint2string(d[1]),
        };
    });
};
