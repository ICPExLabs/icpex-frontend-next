import { getAnonymousActorCreatorByAgent } from '@/components/connect/creator';

import { _SERVICE, PublicTokenOverview } from './icpswap.did.d';
import { idlFactory } from './icpswap.did.ts';

const canisterID: string = 'ggzvv-5qaaa-aaaag-qck7a-cai';

export const get_all_tokens = async () => {
    try {
        const create: _SERVICE = await getAnonymousActorCreatorByAgent()(idlFactory, canisterID);
        const res: PublicTokenOverview[] = await create.getAllTokens();
        return res;
    } catch (error) {
        throw new Error(`Token query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};
