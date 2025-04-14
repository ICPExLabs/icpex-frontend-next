import { useConnect } from '@connect2ic/react';
import { Modal, Toast } from '@douyinfe/semi-ui';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

import { useTokenStore } from '@/stores/token';
import { principal2account } from '@/utils/account';
import { shrinkAccount, shrinkPrincipal } from '@/utils/text';

import HeaderModal from '../ui/header-modal';
import Icon from '../ui/icon';

export const LoginMethodLogo = () => {
    const { activeProvider } = useConnect();

    if (!activeProvider) {
        return <></>;
    }

    return (
        <>
            {activeProvider?.meta.id === 'plug' && (
                <Icon name="plug" className="mr-[10px] h-8 w-8 flex-shrink-0"></Icon>
            )}
            {activeProvider?.meta.id === 'ii' && <Icon name="ii" className="mr-[10px] h-8 w-8 flex-shrink-0"></Icon>}
        </>
    );
};

export const TokenReceiveModal = () => {
    const { t } = useTranslation();
    const { principal } = useConnect();

    const { showReceiveModal, setShowReceiveModal } = useTokenStore();
    const [copiedPrincipal, setCopiedPrincipal] = useState(false);
    const [copiedAccount, setCopiedAccount] = useState(false);
    const [mode, setMode] = useState<'principalId' | 'accountId' | undefined>();

    useEffect(() => {
        if (copiedPrincipal) {
            Toast.success(t('common.tip.copied'));
            setTimeout(() => {
                setCopiedPrincipal(false);
            }, 2000);
        }
    }, [copiedPrincipal, t]);

    useEffect(() => {
        if (copiedAccount) {
            Toast.success(t('common.tip.copied'));
            setTimeout(() => {
                setCopiedAccount(false);
            }, 2000);
        }
    }, [copiedAccount, t]);

    const onBack = () => {
        setMode(undefined);
    };

    useEffect(() => {
        if (showReceiveModal) {
            setMode(undefined);
        }
    }, [showReceiveModal]);

    return (
        <Modal
            centered={true}
            visible={showReceiveModal}
            footer={<></>}
            header={<></>}
            maskClosable={true}
            onCancel={() => setShowReceiveModal(false)}
        >
            <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">
                <HeaderModal
                    title={t('common.receive.title')}
                    isBack={!!mode}
                    onBack={onBack}
                    closeModal={setShowReceiveModal}
                />

                {mode && (
                    <>
                        <div className="flex w-full flex-col items-center justify-center">
                            <div className="mt-[17px] flex items-center gap-x-2 text-[12px] leading-[12px] font-medium text-[#666666]">
                                {mode === 'principalId' && (
                                    <>
                                        <p className="text-base font-medium text-[#666666]">
                                            {shrinkPrincipal(principal)}
                                        </p>
                                        <CopyToClipboard text={principal} onCopy={() => setCopiedPrincipal(true)}>
                                            <Icon
                                                name={copiedPrincipal ? 'correct' : 'copy'}
                                                className="h-[14px] w-[14px] cursor-pointer text-[#999]"
                                            ></Icon>
                                        </CopyToClipboard>
                                    </>
                                )}
                                {mode === 'accountId' && (
                                    <>
                                        <p className="text-base font-medium text-[#666666]">
                                            {shrinkAccount(principal ? principal2account(principal) : '')}
                                        </p>
                                        <CopyToClipboard
                                            text={principal ? principal2account(principal) : ''}
                                            onCopy={() => setCopiedAccount(true)}
                                        >
                                            <Icon
                                                name={copiedAccount ? 'correct' : 'copy'}
                                                className="h-[14px] w-[14px] cursor-pointer text-[#999]"
                                            ></Icon>
                                        </CopyToClipboard>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 flex h-[180px] w-[180px] items-center justify-center rounded-[14px] border border-[#e4e9ff]">
                                {mode === 'principalId' && <QRCodeSVG value={principal || ''} size={155} />}
                                {mode === 'accountId' && (
                                    <QRCodeSVG value={principal ? principal2account(principal) : ''} size={155} />
                                )}
                            </div>

                            <div className="mt-[25px] w-full px-5 text-center text-sm font-medium text-[#666666]">
                                You are able to receive all tokens supported by the IC network.
                            </div>
                        </div>
                    </>
                )}
                {!mode && (
                    <>
                        <p className="mt-[30px] text-[12px] leading-[12px] font-medium text-[#666666]">
                            {t('common.receive.pid')}
                        </p>
                        <div className="mt-2 flex h-[52px] w-full items-center justify-between rounded-[14px] border border-[#dddddd] bg-white px-[15px] duration-75">
                            <div className="flex h-full items-center">
                                <LoginMethodLogo />
                                <p className="text-base font-medium text-[#666666]">{shrinkPrincipal(principal)}</p>
                            </div>
                            <div className="flex gap-x-[11px]">
                                <CopyToClipboard text={principal} onCopy={() => setCopiedPrincipal(true)}>
                                    <div className="group relative flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#eee] duration-75 hover:bg-[#07c160]">
                                        <Icon
                                            name={copiedPrincipal ? 'correct' : 'copy'}
                                            className="h-[14px] w-[14px] text-[#999] duration-75 group-hover:text-[#fff]"
                                        ></Icon>
                                    </div>
                                </CopyToClipboard>
                                <div
                                    onClick={() => {
                                        setMode('principalId');
                                    }}
                                    className="group relative flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#eee] duration-75 hover:bg-[#07c160]"
                                >
                                    <Icon
                                        name="qrcode"
                                        className="h-[14px] w-[14px] text-[#999] duration-75 group-hover:text-[#fff]"
                                    ></Icon>
                                </div>
                            </div>
                        </div>
                        <p className="mt-[17px] text-[12px] leading-[12px] font-medium text-[#666666]">
                            {t('common.receive.aid')}
                        </p>
                        <div className="mt-2 flex h-[52px] w-full items-center justify-between rounded-[14px] border border-[#dddddd] bg-white px-[15px] duration-75">
                            <div className="flex h-full items-center">
                                <LoginMethodLogo />
                                <p className="text-base font-medium text-[#666666]">
                                    {shrinkAccount(principal ? principal2account(principal) : '')}
                                </p>
                            </div>
                            <div className="flex gap-x-[11px]">
                                <CopyToClipboard
                                    text={principal ? principal2account(principal) : ''}
                                    onCopy={() => setCopiedAccount(true)}
                                >
                                    <div className="group relative flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#eee] duration-75 hover:bg-[#07c160]">
                                        <Icon
                                            name={copiedAccount ? 'correct' : 'copy'}
                                            className="h-[14px] w-[14px] text-[#999] duration-75 group-hover:text-[#fff]"
                                        ></Icon>
                                    </div>
                                </CopyToClipboard>
                                <div
                                    onClick={() => {
                                        setMode('accountId');
                                    }}
                                    className="group relative flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#eee] duration-75 hover:bg-[#07c160]"
                                >
                                    <Icon
                                        name="qrcode"
                                        className="h-[14px] w-[14px] text-[#999] duration-75 group-hover:text-[#fff]"
                                    ></Icon>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div
                    onClick={() => setShowReceiveModal(false)}
                    className="duration-75' mt-5 mb-2 flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[14px] bg-gradient-to-r from-[#08be65] to-[#2161f9] text-base font-semibold text-[#ffffff]"
                >
                    {t('common.receive.close')}
                </div>
            </div>
        </Modal>
    );
};
