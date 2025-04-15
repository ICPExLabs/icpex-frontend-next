import { getAnonymousActorCreatorByAgent } from '@/components/connect/creator';
import { ConnectedIdentity } from '@/types/identity.js';
import { bigint2string, string2bigint } from '@/utils/common/bigint.ts';
import { wrapOptionMap } from '@/utils/common/options.ts';
import { string2principal } from '@/utils/common/principal.ts';
import { unwrapRustResultMap } from '@/utils/common/results.ts';
import { unwrapVariant, unwrapVariantKey } from '@/utils/common/variant.ts';
import { hex2array } from '@/utils/hex.ts';

import { icrc2_approve } from '../icrc1/apis.ts';
import { _SERVICE, SwapV2MarketMakerView, TokenInfo } from './swap.did.d';
import { idlFactory } from './swap.did.ts';

const canisterID = 'piwiu-wiaaa-aaaaj-azzka-cai';

export const SWAP_CANISTER_ID = canisterID;

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
): Promise<Record<string, string>> => {
    try {
        const { creator } = identity;
        const service: _SERVICE = await creator(idlFactory, canisterID);

        const balances = await service.tokens_balance_of({
            owner: string2principal(arg.owner),
            subaccount: wrapOptionMap(arg.subaccount, hex2array),
        });

        const result = {};
        balances.map(([canisterId, balance]) => (result[canisterId.toString()] = bigint2string(balance)));
        return result;
    } catch (error) {
        console.error('Error fetching token balances:', error);
        throw error;
    }
};

// one token balance of
export const get_token_balance_of = async (
    identity: ConnectedIdentity,
    arg: {
        owner: string;
        subaccount?: string;
    },
): Promise<string> => {
    const { creator, principal } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);

    const balance = await create.token_balance_of(string2principal(principal), {
        owner: string2principal(arg.owner),
        subaccount: wrapOptionMap(arg.subaccount, hex2array),
    });

    return bigint2string(balance);
};

// all pairs info
export const get_all_pairs_info = async () => {
    const create: _SERVICE = await getAnonymousActorCreatorByAgent()(idlFactory, canisterID);
    return await create.pairs_query();
};

// pair info
export const get_pair_info = async (
    identity: ConnectedIdentity,
    arg: {
        from_canister_id: string;
        to_canister_id: string;
    },
): Promise<SwapV2MarketMakerView | undefined> => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);
    const res = await create.pair_query({
        amm: 'swap_v2_0.3%',
        pair: [string2principal(arg.from_canister_id), string2principal(arg.to_canister_id)],
    });

    return unwrapVariant(res[0], 'SwapV2');
};

// deposit token to swap
export const deposit_token_to_swap = async (
    identity: ConnectedIdentity,
    arg: {
        token_canister_id: string;
        amount: string;
        fee: string;
        subaccount?: string;
    },
) => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);

    // approve
    await icrc2_approve(identity, arg.token_canister_id, {
        amount: (Number(arg.amount) + Number(arg.fee)).toString(),
        spender: SWAP_CANISTER_ID,
    });

    const r = await create.token_deposit(
        {
            token: string2principal(arg.token_canister_id),
            from: {
                owner: string2principal(identity.principal),
                subaccount: wrapOptionMap(arg.subaccount, hex2array),
            },
            amount_without_fee: string2bigint(arg.amount),
        },
        [3],
    );
    return unwrapRustResultMap(
        r,
        (result) => {
            return result;
        },
        (e) => {
            console.log('🚀 ~ token_deposit error:', e);
            throw new Error(unwrapVariantKey(e));
        },
    );
};

// swap
export const swap_exact_tokens_for_tokens = async (
    identity: ConnectedIdentity,
    arg: {
        from_canister_id: string;
        to_canister_id: string;
        amount_in: string;
        amount_out_min: string;
        deadline?: number;
    },
) => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);

    const r = await create.pair_swap_exact_tokens_for_tokens(
        {
            from: {
                owner: string2principal(identity.principal),
                subaccount: [],
            },
            to: {
                owner: string2principal(identity.principal),
                subaccount: [],
            },
            amount_in: string2bigint(arg.amount_in),
            amount_out_min: string2bigint(arg.amount_out_min),
            path: [
                {
                    amm: 'swap_v2_0.3%',
                    pair: [string2principal(arg.from_canister_id), string2principal(arg.to_canister_id)],
                },
            ],
            deadline: arg.deadline ? [BigInt(arg.deadline)] : [],
        },
        [],
    );

    return unwrapRustResultMap(
        r,
        (result) => {
            return result;
        },
        (e) => {
            console.error(`call pair_swap_exact_tokens_for_tokens failed`, arg, e);
            throw new Error(unwrapVariantKey(e));
        },
    );
};

// withdraw token from swap
export const withdraw_token_from_swap = async (
    identity: ConnectedIdentity,
    arg: {
        token_canister_id: string;
        amount: string;
        subaccount?: string;
    },
) => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);

    const r = await create.token_withdraw(
        {
            token: string2principal(arg.token_canister_id),
            from: {
                owner: string2principal(identity.principal),
                subaccount: [],
            },
            to: {
                owner: string2principal(identity.principal),
                subaccount: wrapOptionMap(arg.subaccount, hex2array),
            },
            amount_without_fee: string2bigint(arg.amount),
        },
        [],
    );

    return unwrapRustResultMap(
        r,
        (result) => {
            return bigint2string(result);
        },
        (e) => {
            console.error(`call token_withdraw failed`, arg, e);
            throw new Error(unwrapVariantKey(e));
        },
    );
};
