import { getAnonymousActorCreatorByAgent } from '@/components/connect/creator';

import { _SERVICE, TokenInfo } from './swap.did.d';
import { idlFactory } from './swap.did.ts';

const canisterID = 'piwiu-wiaaa-aaaaj-azzka-cai';

export const fetchTokenList = async () => {
    try {
        const create: _SERVICE = await getAnonymousActorCreatorByAgent()(idlFactory, canisterID);
        const res: TokenInfo[] = await create.tokens_query();
        return res;
    } catch (error) {
        console.error('Failed to fetch token list:', error);
        throw new Error(`Token query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};
