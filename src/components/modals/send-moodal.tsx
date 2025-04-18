import { InputNumber, Modal, Toast } from '@douyinfe/semi-ui';
import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { icrc1_transfer, transfer } from '@/canister/icrc1/apis';
import { SelectTokenModal } from '@/components/modals/select-token-modal';
import { useTokenBalanceBySymbol, useTokenInfoBySymbol } from '@/hooks/useToken';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { isAccountHex } from '@/utils/account';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';
import { isCanisterIdText, isPrincipalText } from '@/utils/principals';

import HeaderModal from '../ui/header-modal';
import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';

export const TokenSendModal = () => {
    const { t } = useTranslation();
    const { showSendModal, setShowSendModal, updateAllTokenBalance } = useTokenStore();
    const { connectedIdentity } = useIdentityStore();

    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);

    const [token, setToken] = useState<string | undefined>('ICP');
    const tokenInfo = useTokenInfoBySymbol(token);
    const balanceToken = useTokenBalanceBySymbol(token);
    const balance = useMemo(() => {
        if (!balanceToken || !tokenInfo) {
            return 0;
        }
        return Number(
            new BigNumber(balanceToken.walletBalance).dividedBy(
                new BigNumber(10).pow(new BigNumber(tokenInfo.decimals)),
            ),
        );
    }, [balanceToken, tokenInfo]);
    const fee = useMemo(() => {
        if (!tokenInfo) {
            return undefined;
        }
        return Number(new BigNumber(tokenInfo.fee).dividedBy(new BigNumber(10).pow(new BigNumber(tokenInfo.decimals))));
    }, [tokenInfo]);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<string>('');
    const [amount, setAmount] = useState<number | undefined>();

    const veriverification = useMemo(() => {
        if (!address) {
            return false;
        }
        if (!isPrincipalText(address) && !isAccountHex(address) && !isCanisterIdText(address)) {
            return false;
        }

        return true;
    }, [address]);

    const onMaxChange = () => {
        if (!tokenInfo) return;
        if (!balance) return;
        if (!fee) return;

        setAmount(truncateDecimalToBN(balance - fee, 4));
    };

    const onTransfer = async () => {
        if (!tokenInfo) return;
        if (!balance) return;
        if (!fee) return;
        if (!address) return;
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

        const do_transfer = isPrincipalText(address)
            ? async () =>
                  icrc1_transfer(connectedIdentity, tokenInfo.canister_id.toString(), {
                      from_subaccount: undefined,
                      to: { owner: address, subaccount: undefined },
                      amount: amount_text,
                      fee: undefined,
                      memo: undefined,
                      created_at_time: undefined,
                  })
            : async () =>
                  transfer(connectedIdentity, tokenInfo.canister_id.toString(), {
                      from_subaccount: undefined,
                      to: address,
                      amount: amount_text,
                      fee: tokenInfo.fee.toString(),
                      memo: '0',
                      created_at_time: undefined,
                  });

        try {
            const height = await do_transfer();
            setAmount(undefined);
            setAddress('');
            setShowSendModal(false);
            updateAllTokenBalance(connectedIdentity, tokenInfo.canister_id.toString());
            Toast.success(t('common.send.sendSuccess') + height);
        } catch (e: string | any) {
            console.log('🚀 ~ onTransfer ~ e:', e);
            Toast.error(`${e}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                centered={true}
                visible={showSendModal}
                footer={<></>}
                header={<></>}
                maskClosable={true}
                onCancel={() => {
                    if (loading) return;
                    setShowSendModal(false);
                }}
            >
                <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">
                    <HeaderModal title={t('common.send.title')} closeModal={setShowSendModal} />
                    <p className="mt-[30px] text-[12px] leading-[12px] font-medium text-[#666666]">
                        {t('common.send.recipient')}
                    </p>
                    <div
                        className={cn(
                            'mt-2 h-[52px] w-full rounded-[14px] border border-[#dddddd] bg-white px-[15px] duration-75',
                            !veriverification && 'border-[#ff5457]',
                            veriverification && 'border-[#07c160]',
                        )}
                    >
                        <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={cn(
                                'h-full w-full text-sm font-medium text-[#000] outline-none placeholder:text-[#999999]',
                            )}
                            type="text"
                            placeholder={t('common.send.inputPlaceholder')}
                        />
                    </div>
                    {!veriverification && (
                        <p className="w-full text-sm font-medium text-[#ff5457]">{t('common.send.inputError')}</p>
                    )}
                    <div className="mt-5 flex w-full flex-col">
                        <div className="flex w-full items-center justify-between gap-x-[6px]">
                            <p className="text-[12px] leading-[12px] font-medium text-[#666666]">
                                {t('common.send.amount')}
                            </p>
                            {tokenInfo && (
                                <div className="flex items-center gap-x-[6px]">
                                    <Icon name="wallet" className="h-[12px] w-[14px] text-[#666666]"></Icon>
                                    {/* <div className="text-xs font-medium text-[#666666]">
                                        {typeof balance === 'number' ? truncateDecimalToBN(balance) : '--'}{' '}
                                        {tokenInfo.symbol}
                                    </div> */}
                                    {!balance ? (
                                        <Icon
                                            name="loading"
                                            className="mr-2 h-[12px] w-[12px] animate-spin text-[#07c160]"
                                        />
                                    ) : (
                                        <p className="text-xs font-medium text-[#999999]">
                                            {truncateDecimalToBN(balance, 4)} {tokenInfo.symbol}
                                        </p>
                                    )}
                                    <p
                                        onClick={onMaxChange}
                                        className="cursor-pointer text-xs font-medium text-[#07c160]"
                                    >
                                        {t('common.send.max')}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="amount-input mt-2 flex h-[52px] w-full rounded-[14px] border border-[#dddddd] bg-white px-[15px]">
                            <InputNumber
                                hideButtons
                                disabled={!tokenInfo}
                                onChange={(val) => setAmount(val as number)}
                                value={amount}
                                className="flex h-full w-full min-w-auto text-sm font-medium !text-[#999999] outline-none"
                                min={0}
                                type="text"
                                placeholder={t('common.send.amountPlaceholder')}
                            />
                            <div
                                onClick={() => setShowSelectTokenModal(true)}
                                className="flex h-full cursor-pointer items-center gap-x-[11px]"
                            >
                                {tokenInfo && (
                                    <TokenLogo
                                        canisterId={tokenInfo.canister_id.toString()}
                                        className="h-6 w-6 flex-shrink-0"
                                    />
                                )}
                                <p className="text-base font-medium text-black">{token}</p>
                                <Icon
                                    name="arrow-down"
                                    className="mr-[15px] h-[6px] w-[10px] flex-shrink-0 text-[#666666]"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={onTransfer}
                        className={cn(
                            'mt-5 mb-2 flex h-[52px] w-full items-center justify-center rounded-[14px] text-base font-semibold duration-75',
                            !veriverification || !amount || loading
                                ? 'cursor-not-allowed bg-[#f6f6f6] text-[#999999]'
                                : 'cursor-pointer bg-gradient-to-r from-[#08be65] to-[#2161f9] text-[#ffffff]',
                        )}
                    >
                        {loading && <Icon name="loading" className="mr-2 h-[14px] w-[14px] animate-spin"></Icon>}
                        {loading ? t('common.send.confirming') : t('common.send.confirm')}
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
