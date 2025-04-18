import { Principal } from '@dfinity/principal';

import { getAnonymousActorCreatorByAgent } from '@/components/connect/creator';
import { ConnectedIdentity } from '@/types/identity.js';
import { bigint2string, string2bigint } from '@/utils/common/bigint.ts';
import { wrapOptionMap } from '@/utils/common/options.ts';
import { string2principal } from '@/utils/common/principal.ts';
import { unwrapRustResultMap } from '@/utils/common/results.ts';
import { unwrapVariant, unwrapVariantKey } from '@/utils/common/variant.ts';
import { hex2array } from '@/utils/hex.ts';
import { transReserve } from '@/utils/text.ts';

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
        canisterId: string;
        owner: string;
        subaccount?: string;
    },
): Promise<string> => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);

    const balance = await create.token_balance_of(string2principal(arg.canisterId), {
        owner: string2principal(arg.owner),
        subaccount: wrapOptionMap(arg.subaccount, hex2array),
    });

    return bigint2string(balance);
};

// all pairs info
export const get_all_pairs_info = async () => {
    const create: _SERVICE = await getAnonymousActorCreatorByAgent()(idlFactory, canisterID);
    const result = await create.pairs_query();

    if (!result || result.length === 0) {
        return [];
    }

    return result.map((item) => {
        const [ammInfo, pairInfo] = item;
        const pair = unwrapVariant<SwapV2MarketMakerView>(pairInfo, 'swap_v2')!;
        return {
            ammInfo,
            pair: {
                ...pair,
                reserve0: transReserve(pair.reserve0),
                reserve1: transReserve(pair.reserve1),
            },
        };
    });
};

// pair info
export const get_pair_info = async (
    identity: ConnectedIdentity,
    arg: {
        from_canister_id: string;
        to_canister_id: string;
        amm: string;
    },
): Promise<SwapV2MarketMakerView | undefined> => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);
    const res = await create.pair_query({
        amm: arg.amm,
        token0: string2principal(arg.from_canister_id),
        token1: string2principal(arg.to_canister_id),
    });

    if (res.length === 0) {
        return undefined;
    }

    const result = unwrapVariant<SwapV2MarketMakerView>(res[0], 'swap_v2')!;

    return {
        ...result,
        reserve0: transReserve(result.reserve0),
        reserve1: transReserve(result.reserve1),
    };
};

// approve deposit token to swap
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
            deposit_amount_without_fee: string2bigint(arg.amount),
            created: [],
            memo: [],
            to: {
                owner: string2principal(identity.principal),
                subaccount: [],
            },
            fee: [],
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
        amm: string;
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
                    amm: arg.amm,
                    token: [string2principal(arg.from_canister_id), string2principal(arg.to_canister_id)],
                },
            ],
            deadline: arg.deadline ? [BigInt(arg.deadline)] : [],
            created: [BigInt(Date.now() * 1000000)],
            memo: [],
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

// only deposit token to swap
export const only_deposit_token_to_swap = async (
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

    const r = await create.token_deposit(
        {
            token: string2principal(arg.token_canister_id),
            from: {
                owner: string2principal(identity.principal),
                subaccount: wrapOptionMap(arg.subaccount, hex2array),
            },
            deposit_amount_without_fee: string2bigint(arg.amount),
            created: [BigInt(Date.now() * 1000000)],
            memo: [],
            to: {
                owner: string2principal(identity.principal),
                subaccount: [],
            },
            fee: [],
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
            withdraw_amount_without_fee: string2bigint(arg.amount),
            created: [BigInt(Date.now() * 1000000)],
            memo: [],
            fee: [],
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

export const add_liquidity_to_swap = async (
    identity: ConnectedIdentity,
    arg: {
        owner: string;
        amm: string;
        token0: Principal;
        token1: Principal;
        amount: string;
        amount_out: string;
        slippage: number;
    },
) => {
    const { creator } = identity;
    const create: _SERVICE = await creator(idlFactory, canisterID);
    const amountMinToken0 = (BigInt(arg.amount) * BigInt(10000 - arg.slippage * 10000)) / 10000n;
    const amountMinToken1 = (BigInt(arg.amount_out) * BigInt(10000 - arg.slippage * 10000)) / 10000n;

    const r = await create.pair_liquidity_add(
        {
            from: {
                owner: string2principal(identity.principal),
                subaccount: [],
            },
            to: {
                owner: string2principal(identity.principal),
                subaccount: [],
            },
            created: [BigInt(Date.now() * 1000000)],
            memo: [],
            deadline: [],
            amount_desired: [BigInt(arg.amount), BigInt(arg.amount_out)],
            amount_min: [amountMinToken0, amountMinToken1],
            swap_pair: {
                amm: arg.amm,
                token: [arg.token0, arg.token1],
            },
        },
        [],
    );

    return unwrapRustResultMap(
        r,
        (result) => {
            return result;
        },
        (e) => {
            console.error(`call token_withdraw failed`, arg, e);
            throw new Error(unwrapVariantKey(e));
        },
    );
};
