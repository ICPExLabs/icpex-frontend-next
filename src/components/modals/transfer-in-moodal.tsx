import { InputNumber, Modal, Toast } from '@douyinfe/semi-ui';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import transferSvg from '@/assets/svg/transfer.svg';
import { deposit_token_to_swap } from '@/canister/swap/apis';
import { useTokenInfoAndBalanceBySymbol } from '@/hooks/useToken';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';

import HeaderModal from '../ui/header-modal';
import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';
import { SelectTokenModal } from './select-token-modal';

export const TokenTransferInModal = () => {
    const { t } = useTranslation();

    const { showTransferInModal, setShowTransferInModal } = useTokenStore();
    const { connectedIdentity } = useIdentityStore();
    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);

    const [token, setToken] = useState<string | undefined>('ICP');
    const tokenInfo = useTokenInfoAndBalanceBySymbol(token);
    const balance = useMemo(() => {
        if (!tokenInfo) {
            return undefined;
        }
        return tokenInfo.balance_wallet || 0;
    }, [tokenInfo]);
    const fee = useMemo(() => {
        if (!tokenInfo) {
            return undefined;
        }
        return Number(tokenInfo.fee) / 10 ** tokenInfo.decimals;
    }, [tokenInfo]);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<number | undefined>();

    const onTransfer = async () => {
        if (!tokenInfo) return;
        if (!balance) return;
        if (!fee) return;
        if (!amount) return;
        if (!connectedIdentity) return;
        if (loading) return;

        if (balance < amount + fee) {
            Toast.error(t('common.send.insufficientFunds'));
            return;
        }
        setLoading(true);
        const amount_text = new BigNumber(amount)
            .multipliedBy(new BigNumber(10).pow(new BigNumber(tokenInfo.decimals)))
            .toFixed()
            .split('.')[0];

        deposit_token_to_swap(connectedIdentity, {
            token_canister_id: tokenInfo.canister_id.toString(),
            amount: amount_text,
            fee: tokenInfo.fee.toString(),
        })
            .then((res) => {
                Toast.success(t('common.transferIn.transferInSuccess') + res);
                setAmount(undefined);
                setShowTransferInModal(false);
            })
            .catch((error) => {
                console.error('Failed to transfer token:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onMaxChange = () => {
        if (!tokenInfo) return;
        if (!balance) return;
        if (!fee) return;
        const amount = balance - fee;
        if (amount >= 0) {
            setAmount(truncateDecimalToBN(amount, 4));
        }
    };

    const onHalfChange = () => {
        if (!tokenInfo) return;
        if (!balance) return;
        if (!fee) return;
        const amount = balance / 2 - fee;
        if (amount >= 0) {
            setAmount(truncateDecimalToBN(amount, 4));
        }
    };

    return (
        <>
            <Modal
                centered={true}
                visible={showTransferInModal}
                footer={<></>}
                header={<></>}
                maskClosable={true}
                onCancel={() => {
                    if (loading) return;
                    setShowTransferInModal(false);
                }}
            >
                <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">
                    <HeaderModal title={t('common.transferIn.title')} closeModal={setShowTransferInModal} />
                    <div className="mt-[27px] flex gap-x-[10px]">
                        <div className="flex h-9 items-center justify-center rounded-[10px] border border-dashed border-[#07c160] px-[18px]">
                            <p className="text-sm font-medium text-[#07c160]">Wallet</p>
                        </div>
                        <div className="flex flex-1">
                            <img className="w-full" src={transferSvg} alt="" />
                        </div>
                        <div className="flex h-9 items-center justify-center rounded-[10px] border border-dashed border-[#07c160] px-[18px]">
                            <p className="text-sm font-medium text-[#07c160]">Contract Wallet</p>
                        </div>
                    </div>

                    <div className="mt-[17px] flex flex-col rounded-[18px] border border-[#eeeeee] bg-white px-[12px] py-[20px] text-black">
                        <div className="amount-input flex w-full">
                            <InputNumber
                                hideButtons
                                disabled={!tokenInfo}
                                onChange={(val) => setAmount(val as number)}
                                value={amount}
                                className="flex h-full w-full min-w-auto text-[32px] font-medium !text-[#999999] outline-none"
                                min={0}
                                type="text"
                                placeholder={t('common.send.amountPlaceholder')}
                            />
                            <div
                                onClick={() => setShowSelectTokenModal(true)}
                                className="flex h-9 flex-shrink-0 cursor-pointer items-center gap-x-[9px] rounded-[37px] border border-[#dddddd] bg-white px-2"
                            >
                                {tokenInfo && (
                                    <TokenLogo
                                        canisterId={tokenInfo.canister_id.toString()}
                                        className="h-6 w-6 flex-shrink-0"
                                    />
                                )}
                                <p className="text-base font-medium text-black">{token}</p>
                                <Icon name="arrow-down" className="h-[6px] w-[10px] flex-shrink-0 text-[#666666]" />
                            </div>
                        </div>
                        <div className="mt-[13px] flex w-full justify-between">
                            <p className="text-sm font-medium text-[#666666]">
                                ${truncateDecimalToBN(tokenInfo?.price || 0, 4)}
                            </p>

                            {tokenInfo && (
                                <div className="flex items-center gap-x-[6px]">
                                    <Icon name="wallet" className="h-[12px] w-[14px] text-[#666666]"></Icon>
                                    <div className="text-xs font-medium text-[#666666]">
                                        {typeof balance === 'number' ? truncateDecimalToBN(balance, 4) : '--'}{' '}
                                        {tokenInfo.symbol}
                                    </div>
                                    <div className="ml-2 flex items-center text-xs font-medium text-[#07c160]">
                                        <p
                                            className="flex h-[20px] cursor-pointer items-center rounded-l-full border border-r-0 border-[#E4E9FF] px-2 text-xs font-medium text-[#07C160]"
                                            onClick={onHalfChange}
                                        >
                                            {t('common.transferIn.half')}
                                        </p>
                                        <p
                                            className="flex h-[20px] cursor-pointer items-center rounded-r-full border border-[#E4E9FF] px-2 text-xs font-medium text-[#07C160]"
                                            onClick={onMaxChange}
                                        >
                                            {t('common.transferIn.max')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 md:mt-[17px] md:rounded-[14px] md:px-[15px] md:py-[11px]">
                        <div className="flex items-start">
                            <Icon name="info" className="mr-2 h-4 w-4 flex-shrink-0 text-[#bfbfbf]" />
                            <p className="text-xs font-medium text-[#666666]">
                                Move your tokens to the contract wallet for faster trades and extra features — you can
                                transfer them back anytime.
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={onTransfer}
                        className={cn(
                            'mt-5 mb-2 flex h-[52px] w-full items-center justify-center rounded-[14px] text-base font-semibold duration-75',
                            !amount || loading
                                ? 'cursor-not-allowed bg-[#f6f6f6] text-[#999999]'
                                : 'cursor-pointer bg-gradient-to-r from-[#08be65] to-[#2161f9] text-[#ffffff]',
                        )}
                    >
                        {loading && <Icon name="loading" className="mr-2 h-[14px] w-[14px] animate-spin"></Icon>}
                        {loading ? t('common.transferIn.confirming') : t('common.transferIn.confirm')}
                    </div>
                </div>
            </Modal>
            <SelectTokenModal
                isShow={showSelectTokenModal}
                setIsShow={setShowSelectTokenModal}
                selectToken={(tokenInfo) => {
                    setToken(tokenInfo.symbol);
                    setShowSelectTokenModal(false);
                }}
            />
        </>
    );
};
