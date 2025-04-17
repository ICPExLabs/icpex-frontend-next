import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

import { get_pair_info } from '@/canister/swap/apis';
import type { SwapV2MarketMakerView } from '@/canister/swap/swap.did.d';
import { anonymous } from '@/components/connect/creator';
import { useAppStore } from '@/stores/app';

import { TypeTokenPriceInfoVal } from './useToken';

export const useSwapFees = ({
    from,
    to,
    fromAmount,
}: {
    from: TypeTokenPriceInfoVal | undefined;
    to: TypeTokenPriceInfoVal | undefined;
    fromAmount: number | undefined;
}) => {
    const { walletMode } = useAppStore();
    const fromCanisterId = from ? from?.canister_id.toString() : '';
    const toCanisterId = to ? to?.canister_id.toString() : '';

    const [allFee, setAllFee] = useState<string>('0');
    // setOneAmountOut
    const [oneAmountOut] = useState<string | undefined>();
    const [amountOut, setAmountOut] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [pair, setPair] = useState<SwapV2MarketMakerView>();

    const getAmountOut = (
        amountIn: string | number,
        reserveIn: string | number,
        reserveOut: string | number,
        feeRate: string = '3/1000',
        out_decimals: number | string,
    ): string => {
        const [numerator, denominator] = feeRate.split('/');
        const feeRatio = BigNumber(1).minus(BigNumber(numerator).div(BigNumber(denominator)));

        //  X*(1-fee)
        const amountInWithFee = BigNumber(amountIn).multipliedBy(feeRatio);

        //  X*reserve1*(1-fee)
        const numeratorBN = amountInWithFee.multipliedBy(reserveOut);

        //  reserve0 + X*(1-fee)
        const denominatorBN = BigNumber(reserveIn).plus(amountInWithFee);

        // Y = (X*reserve1*(1-fee))/(reserve0 + X*(1-fee))
        return numeratorBN.div(denominatorBN).div(BigNumber(10).pow(out_decimals)).toString();
    };

    // const calculateOneAmountOut = useCallback(() => {
    //     if (!from || !to || !pair) {
    //         setOneAmountOut(undefined);
    //         return;
    //     }
    //     const { fee_rate } = pair;
    //     const [numerator, denominator] = fee_rate.split('/');
    //     const feeRate = BigNumber(numerator).div(BigNumber(denominator));
    //     const fees = BigNumber(1).multipliedBy(BigNumber(10).pow(from.decimals)).multipliedBy(feeRate);

    //     const finalAmount = BigNumber(1).multipliedBy(BigNumber(10).pow(from.decimals)).minus(fees).toString();
    //     const amountOut = getAmountOut(
    //         finalAmount,
    //         bigint2string(pair.reserve0),
    //         bigint2string(pair.reserve1),
    //         fee_rate,
    //         to.decimals,
    //     );
    //     console.log('🚀 ~ calculateOneAmountOut ~ amountOut:', pair, finalAmount, amountOut);
    //     setOneAmountOut(amountOut);
    // }, [from, pair, to]);

    const calculateFeeAndAmountOut = useCallback(() => {
        if (!from || !to || !fromAmount || !pair) {
            setAmountOut(undefined);
            setAllFee('0');
            return;
        }
        const { fee_rate, token0, token1 } = pair;
        const [numerator, denominator] = fee_rate.split('/');

        const feeRate = BigNumber(numerator).div(BigNumber(denominator));
        const fees = BigNumber(fromAmount || 0)
            .multipliedBy(BigNumber(10).pow(from.decimals))
            .multipliedBy(feeRate);

        const finalAmount = BigNumber(fromAmount).multipliedBy(BigNumber(10).pow(from.decimals)).toString();

        const fromReserve =
            token0 === fromCanisterId ? pair.reserve0 : token1 === fromCanisterId ? pair.reserve1 : null;
        const toReserve = token0 === toCanisterId ? pair.reserve0 : token1 === toCanisterId ? pair.reserve1 : null;

        if (fromReserve && toReserve) {
            const amountOut = getAmountOut(finalAmount, fromReserve, toReserve, fee_rate, to.decimals);
            setAmountOut(amountOut);
        }

        if (walletMode === 'wallet') {
            const allFees = fees.plus(from.fee).toString();

            setAllFee(allFees);
            return;
        }

        setAllFee(fees.toString());
    }, [from, fromAmount, fromCanisterId, pair, to, toCanisterId, walletMode]);

    const getSwapPairFee = useCallback(async () => {
        try {
            if (!fromCanisterId || !toCanisterId) return;

            setLoading(true);
            const res = await get_pair_info(anonymous, {
                from_canister_id: fromCanisterId,
                to_canister_id: toCanisterId,
            });
            setLoading(false);
            setPair(res);
        } catch (error) {
            console.error('🚀 ~ getSwapPairFee ~ error:', error);
        }
    }, [fromCanisterId, toCanisterId]);

    // useEffect(() => {
    //     calculateOneAmountOut();
    // }, [calculateOneAmountOut, pair]);

    useEffect(() => {
        calculateFeeAndAmountOut();
    }, [calculateFeeAndAmountOut, fromAmount, pair]);

    useEffect(() => {
        if (!fromCanisterId || !toCanisterId) return;
        getSwapPairFee();
    }, [fromCanisterId, getSwapPairFee, toCanisterId]);

    // refetchAmountOut
    const refetchAmountOut = () => {
        if (!fromCanisterId || !toCanisterId) return;

        getSwapPairFee();
    };

    return {
        oneAmountOut, // 1 token out
        amountOut,
        fee: allFee,
        loading,
        refetchAmountOut,
    };
};
