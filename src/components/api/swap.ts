import BigNumber from 'bignumber.js';

import { icrc2_approve } from '@/canister/icrc1/apis';
import {
    only_deposit_token_to_swap,
    SWAP_CANISTER_ID,
    swap_exact_tokens_for_tokens,
    withdraw_token_from_swap,
} from '@/canister/swap/apis';
import { ConnectedIdentity } from '@/types/identity';
import { unwrapVariantKey } from '@/utils/common/variant';

export const contract_swap = async (
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
    try {
        // Swap
        const swapResult = await swap_exact_tokens_for_tokens(identity, {
            from_canister_id: arg.from_canister_id,
            to_canister_id: arg.to_canister_id,
            amount_in: arg.amount_in,
            amount_out_min: arg.amount_out_min,
            amm: arg.amm,
            // deadline: arg.deadline,
        });

        // withdraw from swap
        // amount0 is token in
        // amount1 is token out amount
        const withdrawAmount = swapResult.amounts[1].toString();

        return {
            swap: swapResult,
            amount_received: withdrawAmount,
        };
    } catch (error: any) {
        console.error('🚀 ~ contract_swap error:', error);
        throw new Error(unwrapVariantKey(error));
    }
};

// swap and withdraw
export const swap_and_withdraw = async (
    identity: ConnectedIdentity,
    arg: {
        from_canister_id: string;
        to_canister_id: string;
        amount_in: string;
        amount_out_min: string;
        withdraw_fee: string;
        amm: string;
        deadline?: number;
    },
) => {
    try {
        // Swap
        const swapResult = await swap_exact_tokens_for_tokens(identity, {
            from_canister_id: arg.from_canister_id,
            to_canister_id: arg.to_canister_id,
            amount_in: arg.amount_in,
            amount_out_min: arg.amount_out_min,
            amm: arg.amm,
            // deadline: arg.deadline,
        });
        console.log('🚀 ~ swapResult:', swapResult);

        // withdraw from swap
        // amount0 is token in
        // amount1 is token out amount
        // const withdrawAmount = swapResult.amounts[1].toString();
        const withdrawAmount = BigNumber(swapResult.amounts[1]).minus(BigNumber(arg.withdraw_fee)).toString();
        console.log('🚀 ~ withdrawAmount:', withdrawAmount);

        // withdraw
        const withdrawResult = await withdraw_token_from_swap(identity, {
            token_canister_id: arg.to_canister_id,
            amount: withdrawAmount,
        });
        console.log('🚀 ~ withdrawResult:', withdrawResult);

        return {
            swap: swapResult,
            withdraw: withdrawResult,
            amount_received: withdrawAmount,
        };
    } catch (error: any) {
        console.error('🚀 ~ swap_and_withdraw error:', error);
        throw new Error(unwrapVariantKey(error));
    }
};

export const only_wallet_swap = async (
    identity: ConnectedIdentity,
    arg: {
        from_canister_id: string;
        to_canister_id: string;
        amount_in: string;
        amount_out_min: string;
        withdraw_fee: string;
        amm: string;
        deadline?: number;
    },
) => {
    try {
        // Swap
        const swapResult = await swap_exact_tokens_for_tokens(identity, {
            from_canister_id: arg.from_canister_id,
            to_canister_id: arg.to_canister_id,
            amount_in: arg.amount_in,
            amount_out_min: arg.amount_out_min,
            amm: arg.amm,
            // deadline: arg.deadline,
        });

        // withdraw from swap
        // amount0 is token in
        // amount1 is token out amount
        const withdrawAmount = BigNumber(swapResult.amounts[1]).minus(BigNumber(arg.withdraw_fee)).toString();

        return {
            swap: swapResult,
            amount_received: withdrawAmount,
        };
    } catch (error: any) {
        console.error('🚀 ~ contract_swap error:', error);
        throw new Error(unwrapVariantKey(error));
    }
};

// only withdraw from swap
export const swap_withdraw = async (
    identity: ConnectedIdentity,
    arg: {
        token_canister_id: string;
        amount: string;
    },
) => {
    try {
        // withdraw
        const withdrawResult = await withdraw_token_from_swap(identity, {
            token_canister_id: arg.token_canister_id,
            amount: arg.amount,
        });
        return {
            withdraw: withdrawResult,
        };
    } catch (error: any) {
        console.error('🚀 ~ swap_and_withdraw error:', error);
        throw new Error(unwrapVariantKey(error));
    }
};

export const execute_complete_swap = async (
    identity: ConnectedIdentity,
    arg: {
        from_canister_id: string;
        to_canister_id: string;
        amount_in: string;
        amount_out_min: string;
        fee: string;
        withdraw_fee: string;
        decimals: number; // from token decimals
        amm: string;
        deadline?: number;
    },
) => {
    try {
        // transfer total amount
        const totalAmount = BigNumber(arg.amount_in).plus(BigNumber(arg.fee)).toFixed().split('.')[0];

        // approve
        const approveRes = await icrc2_approve(identity, arg.from_canister_id, {
            amount: totalAmount.toString(),
            spender: SWAP_CANISTER_ID, // Swap approved canister id
        });
        console.log('🚀 ~ approveRes:', approveRes);

        const depositRes = await only_deposit_token_to_swap(identity, {
            token_canister_id: arg.from_canister_id,
            amount: arg.amount_in,
            fee: arg.fee,
        });
        console.log('🚀 ~ depositRes:', depositRes);

        // swap and withdraw
        const swapResult = await swap_and_withdraw(identity, {
            from_canister_id: arg.from_canister_id, // from token canister id
            to_canister_id: arg.to_canister_id, // to token canister id
            amount_in: arg.amount_in, // total amount,
            amount_out_min: arg.amount_out_min, // min amount out
            withdraw_fee: arg.withdraw_fee, // withdraw fee
            amm: arg.amm, // amm
        });

        return swapResult;
    } catch (error: any) {
        console.error('🚀 ~ execute_complete_swap error:', error);
        throw new Error(unwrapVariantKey(error));
    }
};
