import { useConnect } from '@connect2ic/react';
import { SideSheet, Toast } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { TokenBalanceInfo } from '@/hooks/useToken';
import { TypeWalletMode, useAppStore } from '@/stores/app';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
import { truncateDecimalToBN } from '@/utils/numbers';
import { shrinkPrincipal } from '@/utils/text';

import Icon from '../ui/icon';
import { TokenLogo } from '../ui/logo';
import { TokenPriceChangePercentage } from '../ui/price';

export const UserInfoButton = () => {
    const { principal, activeProvider } = useConnect();
    const { setShowInfoModal } = useIdentityStore();

    if (!activeProvider || !principal) {
        return <></>;
    }

    return (
        <>
            <div
                className="group flex h-10 cursor-pointer items-center justify-center rounded-3xl border border-[#eeeeee] bg-[#fff] px-[10px]"
                onClick={() => setShowInfoModal(true)}
            >
                {activeProvider?.meta.id === 'plug' && <Icon name="plug" className="mr-2 h-6 w-6 flex-shrink-0"></Icon>}
                {activeProvider?.meta.id === 'ii' && <Icon name="ii" className="mr-2 h-6 w-6 flex-shrink-0"></Icon>}
                <div className="text-sm font-medium text-[#000000]">{shrinkPrincipal(principal)}</div>
            </div>
        </>
    );
};

const TokenListItem = ({ tokenInfo, walletMode }: { tokenInfo: TokenBalanceInfo; walletMode: TypeWalletMode }) => {
    return (
        <Link
            to={`/explore/${tokenInfo.canister_id.toString()}`}
            className="flex h-13 items-center justify-between px-5 hover:bg-[#f6f6f6]"
        >
            <div className="flex items-center">
                <TokenLogo canisterId={tokenInfo.canister_id.toString()} className="h-8 w-8 rounded-full" />
                <div className="ml-[10px] flex flex-col items-start">
                    <p className="text-sm font-medium text-black">{tokenInfo.name}</p>
                    <p className="text-xs font-medium text-[#999999]">
                        {walletMode === 'wallet' &&
                            `${typeof tokenInfo.balance_wallet === 'number' ? truncateDecimalToBN(tokenInfo.balance_wallet, 4) : '--'}`}
                        {walletMode === 'contract' &&
                            `${typeof tokenInfo.balance_wallet_contract === 'number' ? truncateDecimalToBN(tokenInfo.balance_wallet_contract, 4) : '--'}`}
                        {tokenInfo.symbol}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="text-sm font-medium text-black">
                    {walletMode === 'wallet' &&
                        `$${typeof tokenInfo.usd_wallet === 'number' ? truncateDecimalToBN(tokenInfo.usd_wallet) : '--'}`}
                    {walletMode === 'contract' && `$${tokenInfo.usd_wallet_contract}`}
                </p>
                <TokenPriceChangePercentage
                    value={
                        typeof tokenInfo.price_change_24h === 'number'
                            ? truncateDecimalToBN(tokenInfo.price_change_24h)
                            : 0
                    }
                    className=""
                />
            </div>
        </Link>
    );
};

const UserInfoModal = () => {
    const { t } = useTranslation();
    const { walletMode } = useAppStore();
    const [activeTab, setActiveTab] = useState<TypeWalletMode>(walletMode);
    const { showInfoModal, setShowInfoModal } = useIdentityStore();
    const { principal, activeProvider, disconnect } = useConnect();

    const {
        allTokenBalance,
        totalBalance,
        contractWallet,
        setShowSendModal,
        setShowReceiveModal,
        setShowTransferInModal,
        setShowTransferOutModal,
    } = useTokenStore();
    const [copied, setCopied] = useState(false);
    const [currentTab, setCurrentTab] = useState<'Tokens' | 'Pools' | 'History'>('Tokens');

    const [tokenList, setTokenList] = useState<TokenBalanceInfo[] | undefined>();

    useEffect(() => {
        if (copied) {
            Toast.success(t('common.tip.copied'));
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied, t]);

    useEffect(() => {
        if (!showInfoModal) return;

        if (allTokenBalance && activeTab === 'wallet') {
            const sortedTokens = [...allTokenBalance].sort((a, b) => {
                const balanceA = Number(a.balance_wallet || 0);
                const balanceB = Number(b.balance_wallet || 0);
                return balanceB - balanceA;
            });

            setTokenList(sortedTokens);
        }
        if (allTokenBalance && activeTab === 'contract') {
            const sortedTokens = [...allTokenBalance].sort((a, b) => {
                const balanceA = Number(a.usd_wallet_contract || 0);
                const balanceB = Number(b.usd_wallet_contract || 0);
                return balanceB - balanceA;
            });

            setTokenList(sortedTokens);
        } else {
            const sortedTokens = [...allTokenBalance].sort((a, b) => {
                const balanceA = Number(a.usd_wallet || 0);
                const balanceB = Number(b.usd_wallet || 0);
                return balanceB - balanceA;
            });

            setTokenList(sortedTokens);
        }
    }, [allTokenBalance, activeTab, showInfoModal]);

    return (
        <SideSheet
            visible={showInfoModal}
            onCancel={() => setShowInfoModal(false)}
            placement={'right'}
            className="userInfo-modal"
            closeOnEsc={true}
        >
            <div className="relative mt-[77px] flex h-[calc(100vh-100px)] w-full flex-col items-center justify-start overflow-hidden rounded-[20px] border border-[#e4e9ff] bg-white py-5 text-center">
                <div className="flex w-full items-center justify-baseline px-5">
                    <div className="flex flex-1 items-center">
                        {activeProvider?.meta.id === 'plug' && (
                            <Icon name="plug" className="mr-4 h-8 w-8 flex-shrink-0"></Icon>
                        )}
                        {activeProvider?.meta.id === 'ii' && (
                            <Icon name="ii" className="mr-4 h-8 w-8 flex-shrink-0"></Icon>
                        )}
                        <div className="text-base font-medium text-[#666666]">{shrinkPrincipal(principal)}</div>
                        <CopyToClipboard text={principal} onCopy={() => setCopied(true)}>
                            <Icon
                                name={copied ? 'correct' : 'copy'}
                                className={cn(
                                    'ml-3 h-3.5 w-3.5 cursor-pointer text-[#999]',
                                    copied && 'text-[#07C160]',
                                )}
                            ></Icon>
                        </CopyToClipboard>
                    </div>
                    <div className="flex gap-x-[17px]">
                        <Icon
                            onClick={disconnect}
                            name="off"
                            className="h-[18px] w-[18px] cursor-pointer text-[#999]"
                        ></Icon>
                        <Icon
                            onClick={() => setShowInfoModal(false)}
                            name="arrow-right"
                            className="h-[18px] w-[18px] cursor-pointer text-[#999]"
                        ></Icon>
                    </div>
                </div>

                {/* Balance Section */}

                <div className="mt-[15px] w-full px-5">
                    <div className="mb-[15px] flex w-full items-center justify-between">
                        <div className="flex flex-1 flex-col items-start">
                            <p className="text-xs font-medium text-[#666666]">{t('common.userInfo.totalBalance')}</p>
                            <div className="flex items-center">
                                <p className="text-2xl font-medium text-black">
                                    ${typeof totalBalance === 'number' ? truncateDecimalToBN(totalBalance, 2) : '--'}
                                </p>
                                {/* <TokenPriceChangePercentage value={0.23} className="ml-1" /> */}
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col items-start">
                            <p className="text-xs font-medium text-[#666666]">{t('common.userInfo.contractWallet')}</p>
                            <div className="flex items-center">
                                <p className="text-2xl font-medium text-black">
                                    $
                                    {typeof contractWallet === 'number' ? truncateDecimalToBN(contractWallet, 2) : '--'}
                                </p>
                                {/* <TokenPriceChangePercentage value={-0.23} className="ml-1" /> */}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-5 flex h-11 items-center rounded-xl border border-[#eeeeee] bg-white px-1">
                        <div
                            className={cn(
                                'flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[10px]',
                                activeTab === 'wallet' ? 'bg-[#eee] text-[#000]' : 'text-[#666]',
                            )}
                            onClick={() => setActiveTab('wallet')}
                        >
                            <p className="text-sm font-medium">{t('common.switchWallet.wallet')}</p>
                        </div>
                        <div
                            className={cn(
                                'flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[10px]',
                                activeTab === 'contract' ? 'bg-[#eee] text-[#000]' : 'text-[#666]',
                            )}
                            onClick={() => setActiveTab('contract')}
                        >
                            <p className="text-sm font-medium">{t('common.switchWallet.contractWallet')}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {activeTab === 'wallet' && (
                        <div className="mb-4 grid grid-cols-2 gap-x-[19px]">
                            <div
                                className="flex h-20 cursor-pointer flex-col rounded-xl bg-[#07c160] p-4 text-white duration-75 hover:bg-[#32c88c]"
                                onClick={() => setShowSendModal(true)}
                            >
                                <Icon name="out" className="h-6 w-6 flex-shrink-0 text-white" />
                                <p className="mt-2 text-left text-base font-medium text-white">
                                    {t('common.userInfo.send')}
                                </p>
                            </div>
                            <div
                                className="flex h-20 cursor-pointer flex-col rounded-xl bg-[#07c160] p-4 text-white duration-75 hover:bg-[#32c88c]"
                                onClick={() => setShowReceiveModal(true)}
                            >
                                <Icon name="in" className="h-6 w-6 flex-shrink-0 text-white" />
                                <p className="mt-2 text-left text-base font-medium text-white">
                                    {t('common.userInfo.receive')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons - contract wallet */}
                    {activeTab === 'contract' && (
                        <div className="mb-4 grid grid-cols-2 gap-x-[19px]">
                            <div
                                className="flex h-20 cursor-pointer flex-col rounded-xl bg-[#07c160] p-4 text-white duration-75 hover:bg-[#32c88c]"
                                onClick={() => setShowTransferInModal(true)}
                            >
                                <Icon name="in" className="h-6 w-6 flex-shrink-0 text-white" />
                                <p className="mt-2 text-left text-base font-medium text-white">
                                    {t('common.userInfo.transferIn')}
                                </p>
                            </div>
                            <div
                                className="flex h-20 cursor-pointer flex-col rounded-xl bg-[#07c160] p-4 text-white duration-75 hover:bg-[#32c88c]"
                                onClick={() => setShowTransferOutModal(true)}
                            >
                                <Icon name="out" className="h-6 w-6 flex-shrink-0 text-white" />
                                <p className="mt-2 text-left text-base font-medium text-white">
                                    {t('common.userInfo.transferOut')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="mb-[10px] flex items-center gap-x-10">
                        <div
                            className={cn(
                                'cursor-pointer text-sm font-medium text-[#666666]',
                                currentTab === 'Tokens' && 'font-semibold text-black',
                            )}
                            onClick={() => setCurrentTab('Tokens')}
                        >
                            {t('common.userInfo.tokens')}
                        </div>
                        <div
                            className={cn(
                                'cursor-pointer text-sm font-medium text-[#666666]',
                                currentTab === 'Pools' && 'font-semibold text-black',
                            )}
                            onClick={() => setCurrentTab('Pools')}
                        >
                            {t('common.userInfo.pools')}
                        </div>
                        <div
                            className={cn(
                                'cursor-pointer text-sm font-medium text-[#666666]',
                                currentTab === 'History' && 'font-semibold text-black',
                            )}
                            onClick={() => setCurrentTab('History')}
                        >
                            {t('common.userInfo.history')}
                        </div>
                    </div>
                </div>

                <div className="w-full flex-1 overflow-y-auto">
                    {currentTab === 'Tokens' && (
                        <>
                            {tokenList ? (
                                tokenList.map((token, index) => (
                                    <TokenListItem tokenInfo={token} key={index} walletMode={activeTab}></TokenListItem>
                                ))
                            ) : (
                                <div className="flex h-[426px] flex-col items-center justify-center">
                                    <Icon name="loading" className="h-[28px] w-[28px] animate-spin text-[#07c160]" />
                                    <p className="mt-2 text-[16px] font-semibold text-[#000000]">
                                        {t('common.loading')}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {currentTab === 'Pools' && <>Pools</>}

                    {currentTab === 'History' && <>History</>}
                </div>
            </div>
        </SideSheet>
    );
};

export default UserInfoModal;
