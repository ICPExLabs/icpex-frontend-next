import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';

// get_pair_info
import { get_all_pairs_info } from '@/canister/swap/apis';
import type { SwapV2MarketMakerView } from '@/canister/swap/swap.did.d';
// import { anonymous } from '@/components/connect/creator';
import { useAppStore } from '@/stores/app';

import { TypeTokenPriceInfoVal } from './useToken';

interface DeviationType {
    fromReserve: string;
    toReserve: string;
    payAmount: string;
    feeRate: string;
}

export const getPriceDeviation = ({ fromReserve, toReserve, payAmount, feeRate }: DeviationType) => {
    const [numerator, denominator] = feeRate.split('/');
    const feeRatio = BigNumber(numerator).div(BigNumber(denominator));

    const amountInWithFee = BigNumber(payAmount).multipliedBy(BigNumber(1).minus(feeRatio));

    const amountOut = BigNumber(toReserve)
        .multipliedBy(amountInWithFee)
        .div(BigNumber(fromReserve).plus(amountInWithFee));

    const priceMid = BigNumber(toReserve).div(BigNumber(fromReserve));

    const priceExec = amountOut.div(BigNumber(payAmount));

    const priceDeviation = priceMid.minus(priceExec).absoluteValue().div(priceMid);

    return BigNumber.min(priceDeviation.multipliedBy(100), 10).toFixed(2);
};

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
    const [isNoPool, setIsNoPool] = useState<boolean>(false);
    const [pair, setPair] = useState<SwapV2MarketMakerView>();
    const [amm, setAmm] = useState<string>();
    const [deviation, setDeviation] = useState<string>();

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

        if (!fromReserve && !toReserve) {
            setAmountOut(undefined);
            setIsNoPool(true);
        } else {
            setIsNoPool(false);
        }

        if (fromReserve && toReserve) {
            const amountOut = getAmountOut(finalAmount, fromReserve, toReserve, fee_rate, to.decimals);
            setAmountOut(amountOut);

            const deviation = getPriceDeviation({
                fromReserve: fromReserve,
                toReserve: toReserve,
                payAmount: finalAmount,
                feeRate: fee_rate,
            });
            setDeviation(deviation);
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

            const allPairs = await get_all_pairs_info();

            const pair = allPairs.find((item) => {
                const { ammInfo, pair: itemPair } = item;
                if (!ammInfo) return false;

                if (itemPair.token0 === fromCanisterId && itemPair.token1 === toCanisterId) {
                    return true;
                }
                if (itemPair.token0 === toCanisterId && itemPair.token1 === fromCanisterId) {
                    return true;
                }
                return false;
            });
            // console.log('🚀 ~ pair ~ pair:', pair);

            setIsNoPool(!pair ? true : false);
            setLoading(false);

            if (!pair) {
                setPair(undefined);
                setAmm(undefined);
                return;
            }
            // const res = await get_pair_info(anonymous, {
            //     from_canister_id: fromCanisterId,
            //     to_canister_id: toCanisterId,
            // });
            // console.log('🚀 ~ getSwapPairFee ~ res:', res);

            setPair(pair?.pair);
            setAmm(pair?.ammInfo.amm);
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

    // max amount in cal fee and available amount
    const getMaxAmountIn = (balance: number) => {
        if (!from || !pair) {
            return 0;
        }

        const { fee_rate } = pair;
        const [numerator, denominator] = fee_rate.split('/');

        const feeRate = BigNumber(numerator).div(BigNumber(denominator));
        const fees = BigNumber(balance || 0)
            .multipliedBy(BigNumber(10).pow(from.decimals))
            .multipliedBy(feeRate);

        if (walletMode === 'wallet') {
            const allFees = fees.plus(from.fee).toString();

            const feeAmount = BigNumber(allFees).div(BigNumber(10).pow(from.decimals));
            const availableAmount = BigNumber(balance).minus(feeAmount);

            return availableAmount.toString();
        }

        const feeAmount = BigNumber(fees).div(BigNumber(10).pow(from.decimals));
        const availableAmount = BigNumber(balance).minus(feeAmount);
        return availableAmount.toString();
    };

    return {
        deviation, // price deviation
        amm, // amm
        isNoPool, // no pool
        oneAmountOut, // 1 token out
        amountOut,
        fee: allFee,
        loading,
        refetchAmountOut,
        getMaxAmountIn,
    };
};
