import { useConnect } from '@connect2ic/react';
import { SideSheet, Toast } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

import { useIdentityStore } from '@/stores/identity';
import { shrinkPrincipal } from '@/utils/text';

import Icon from '../ui/icon';

export const UserInfoButton = () => {
    const { principal, activeProvider } = useConnect();
    const { setShowInfoModal } = useIdentityStore();

    if (!activeProvider || !principal) {
        return <></>;
    }

    return (
        <>
            <div
                className="group flex h-10 cursor-pointer items-center justify-center rounded-3xl bg-[#f2f4ff] px-[10px]"
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
    const { showInfoModal, setShowInfoModal } = useIdentityStore();
    const { principal, activeProvider, disconnect } = useConnect();

    const [copied, setCopied] = useState(false);

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
                <div className="relative mt-[77px] flex h-[calc(100vh-100px)] w-full flex-col items-center justify-start rounded-[20px] border border-[#e4e9ff] bg-white p-[20px] text-center">
                    <div className="flex w-full items-center justify-baseline">
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
                                    className="ml-4 h-3.5 w-3.5 cursor-pointer text-[#97a0c9]"
                                ></Icon>
                            </CopyToClipboard>
                        </div>
                        <div className="flex gap-x-[17px]">
                            <Icon
                                onClick={disconnect}
                                name="off"
                                className="h-[18px] w-[18px] cursor-pointer text-[#97a0c9]"
                            ></Icon>
                            <Icon
                                onClick={() => setShowInfoModal(false)}
                                name="arrow-right"
                                className="h-[18px] w-[18px] cursor-pointer text-[#97a0c9]"
                            ></Icon>
                        </div>
                    </div>
                    <div>UserInfo</div>
                </div>
            </SideSheet>
        </>
    );
};

export default UserInfoModal;
