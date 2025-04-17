import { useState } from 'react';

import { icrc2_approve } from '@/canister/icrc1/apis';
import { only_deposit_token_to_swap, SWAP_CANISTER_ID } from '@/canister/swap/apis';
import { only_wallet_swap, swap_withdraw } from '@/components/api/swap';
import { useIdentityStore } from '@/stores/identity';
import { unwrapVariantKey } from '@/utils/common/variant';

export type StepType = 'APPROVE' | 'DEPOSIT' | 'SWAP' | 'WITHDRAW';
export type ArgType = {
    from_canister_id: string;
    to_canister_id: string;
    amount_in: string;
    amount_out_min: string;
    fee: string;
    decimals: number; // from token decimals
    withdraw_fee: string;
    amm: string;
    deadline?: number;
};

export const useSwap = () => {
    const { connectedIdentity } = useIdentityStore();

    const [step, setStep] = useState<StepType>();
    const [successStep, setSuccessStep] = useState<StepType>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const resetState = () => {
        setStep(undefined);
        setSuccessStep(undefined);
        setLoading(false);
        setIsSuccess(false);
        setIsError(false);
        setErrorMessage('');
    };

    const onApprove = async (arg: ArgType) => {
        try {
            if (!connectedIdentity) return;
            // const amount = (Number(arg.amount_in) + Number(arg.fee)).toString();

            setStep('APPROVE');
            setLoading(true);
            const res = await icrc2_approve(connectedIdentity, arg.from_canister_id, {
                amount: (Number(arg.amount_in) + Number(arg.fee)).toString(),
                spender: SWAP_CANISTER_ID, // Swap approved canister id
            });
            console.log('🚀 ~ onApprove ~ res:', res);
            setSuccessStep('APPROVE');
            return true;
        } catch (error: any) {
            console.log('🚀 ~ onApprove ~ error:', error);
            setIsError(true);
            setErrorMessage('Approve failed');
            throw new Error(unwrapVariantKey(error));
        }
    };

    const onDeposit = async (arg: ArgType) => {
        try {
            if (!connectedIdentity) return;
            setStep('DEPOSIT');
            setLoading(true);
            await only_deposit_token_to_swap(connectedIdentity, {
                token_canister_id: arg.from_canister_id,
                amount: arg.amount_in,
                fee: arg.fee,
            });
            setSuccessStep('DEPOSIT');
            return true;
        } catch (error: any) {
            console.log('🚀 ~ onDeposit ~ error:', error);
            setIsError(true);
            setErrorMessage('Deposit failed');
            throw new Error(unwrapVariantKey(error));
        }
    };

    const onSwap = async (arg: ArgType) => {
        try {
            if (!connectedIdentity) return;
            setStep('SWAP');
            setLoading(true);
            const res = await only_wallet_swap(connectedIdentity, {
                from_canister_id: arg.from_canister_id,
                to_canister_id: arg.to_canister_id,
                amount_in: arg.amount_in,
                amount_out_min: arg.amount_out_min,
                withdraw_fee: arg.withdraw_fee,
                amm: arg.amm,
                deadline: arg.deadline,
            });
            console.log('🚀 ~ onSwap ~ res:', res);
            setSuccessStep('SWAP');
            return res;
        } catch (error: any) {
            console.log('🚀 ~ onSwap ~ error:', error);
            setIsError(true);
            setErrorMessage('Swap failed');
            throw new Error(unwrapVariantKey(error));
        }
    };

    const onWithdraw = async (
        arg: ArgType,
        swapResult: {
            amount_received: string;
        },
    ) => {
        try {
            if (!connectedIdentity || !swapResult) return;
            setStep('WITHDRAW');
            setLoading(true);

            const res = await swap_withdraw(connectedIdentity, {
                token_canister_id: arg.to_canister_id,
                amount: swapResult.amount_received,
            });
            console.log('🚀 ~ onWithdraw ~ res:', res);
            setSuccessStep('WITHDRAW');
            return res;
        } catch (error: any) {
            console.log('🚀 ~ onWithdraw ~ error:', error);
            setIsError(true);
            setErrorMessage('Withdraw failed');
            throw new Error(unwrapVariantKey(error));
        }
    };

    const execute_complete_swap = async (arg: ArgType) => {
        if (isError) setIsError(false);

        try {
            setLoading(true);

            await onApprove(arg);
            await onDeposit(arg);
            const swapResult = await onSwap(arg);

            if (!swapResult) {
                setIsError(true);
                setErrorMessage('Swap failed');
                throw new Error('Swap failed');
            }

            await onWithdraw(arg, swapResult);

            setIsSuccess(true);
        } catch (error) {
            console.log('🚀 ~ execute_complete_swap ~ error:', error);
        } finally {
            resetState();
        }
    };

    return {
        step,
        successStep,
        execute_complete_swap,
        loading,
        isSuccess,
        isError,
        errorMessage,
    };
};
