import { useConnect } from '@connect2ic/react';
import { SideSheet, Toast } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/stores/app';
import { useIdentityStore } from '@/stores/identity';
import { useTokenStore } from '@/stores/token';
import { cn } from '@/utils/classNames';
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
                <div className="text-sm font-medium text-[#272e4d]">{shrinkPrincipal(principal)}</div>
            </div>
        </>
    );
};

const UserInfoModal = () => {
    const { t } = useTranslation();
    const { walletMode } = useAppStore();
    const { showInfoModal, setShowInfoModal } = useIdentityStore();
    const { principal, activeProvider, disconnect } = useConnect();

    const { allTokenBalance } = useTokenStore();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'wallet' | 'contract'>(walletMode);
    const [currentTab, setCurrentTab] = useState<'Tokens' | 'Pools' | 'History'>('Tokens');

    useEffect(() => {
        if (copied) {
            Toast.success(t('common.tip.copied'));
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied, t]);

    return (
        <>
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
                                    className="ml-4 h-3.5 w-3.5 cursor-pointer text-[#999]"
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
                    <div className="mt-[15px] w-full px-5">
                        {/* Balance Section */}
                        <div className="mb-[15px] flex w-full items-center justify-between">
                            <div className="text-left font-medium">
                                <h2 className="mb-[5px] text-xs text-[#666]">Total Balance</h2>
                                <div className="flex items-center">
                                    <span className="text-2xl font-medium text-[#272E4D]">$9,029.50</span>
                                    <TokenPriceChangePercentage value={0.23} className="ml-1" />
                                </div>
                            </div>

                            <div className="text-left font-medium">
                                <h2 className="mb-1 text-xs text-[#666]">Contract Wallet</h2>
                                <div className="flex items-center">
                                    <span className="text-2xl font-medium">$2850.50</span>
                                    <TokenPriceChangePercentage value={-0.23} className="ml-1" />
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
                            <div className="mb-5 grid grid-cols-2 gap-4">
                                <div
                                    className="cursor-pointer rounded-2xl bg-[#07c160] px-4 pt-4 pb-[12px] text-left text-white transition-colors hover:bg-[#07c160]/90"
                                    onClick={() => {
                                        // TODO:
                                    }}
                                >
                                    <Icon name="out" className="h-6 w-6 text-white" />
                                    <div className="mt-2 text-base">Send</div>
                                </div>
                                <div
                                    className="cursor-pointer rounded-2xl bg-[#07c160] px-4 pt-4 pb-[12px] text-left text-white transition-colors hover:bg-[#07c160]/90"
                                    onClick={() => {
                                        // TODO:
                                    }}
                                >
                                    <Icon name="in" className="h-6 w-6 text-white" />
                                    <div className="mt-2 text-base">Receive</div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons - contract wallet */}
                        {activeTab === 'contract' && (
                            <div className="mb-5 grid grid-cols-2 gap-4">
                                <div
                                    className="cursor-pointer rounded-2xl bg-[#07c160] px-4 pt-4 pb-[12px] text-left text-white transition-colors hover:bg-[#07c160]/90"
                                    onClick={() => {
                                        // TODO:
                                    }}
                                >
                                    <Icon name="in" className="h-6 w-6 text-white" />
                                    <div className="mt-2 text-base">Transfer In</div>
                                </div>
                                <div
                                    className="cursor-pointer rounded-2xl bg-[#07c160] px-4 pt-4 pb-[12px] text-left text-white transition-colors hover:bg-[#07c160]/90"
                                    onClick={() => {
                                        // TODO:
                                    }}
                                >
                                    <Icon name="out" className="h-6 w-6 text-white" />
                                    <div className="mt-2 text-base">Transfer Out</div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mb-[18px] flex items-center gap-x-10 text-sm font-medium text-[#666]">
                            <button
                                className={cn('cursor-pointer', currentTab === 'Tokens' && 'text-[#272E4D]')}
                                onClick={() => setCurrentTab('Tokens')}
                            >
                                Tokens
                            </button>
                            <button
                                className={cn('cursor-pointer', currentTab === 'Pools' && 'text-[#272E4D]')}
                                onClick={() => setCurrentTab('Pools')}
                            >
                                Pools
                            </button>
                            <button
                                className={cn('cursor-pointer', currentTab === 'History' && 'text-[#272E4D]')}
                                onClick={() => setCurrentTab('History')}
                            >
                                History
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex-1 overflow-y-auto">
                        {/* Token List */}
                        <div className="">
                            {allTokenBalance ? (
                                allTokenBalance.map((token, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between px-5 py-2 hover:bg-[#F2F4FF]"
                                    >
                                        <div className="flex items-center">
                                            <TokenLogo
                                                canisterId={token.canister_id.toString()}
                                                className="h-9 w-9 rounded-full"
                                            />
                                            <div className="ml-3 text-left">
                                                <h3 className="text-sm font-medium text-[#272E4D]">{token.name}</h3>
                                                <p className="text-xs text-[#97A0C9]">
                                                    {token.balance_wallet &&
                                                        activeTab === 'wallet' &&
                                                        `${token.balance_wallet}`}
                                                    {token.balance && activeTab === 'contract' && `${token.balance}`}
                                                    {token.symbol}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-[#272E4D]">
                                                {token.usd_wallet && activeTab === 'wallet' && `$${token.usd_wallet}`}
                                                {token.usd && activeTab === 'contract' && `$${token.usd}`}
                                            </p>
                                            <TokenPriceChangePercentage
                                                value={token.price_change_24h || 0}
                                                className="ml-2"
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </SideSheet>
        </>
    );
};

export default UserInfoModal;
