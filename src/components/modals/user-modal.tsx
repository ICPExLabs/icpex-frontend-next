import { useConnect } from '@connect2ic/react';
import { SideSheet } from '@douyinfe/semi-ui';
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
                className="flex h-10 cursor-pointer items-center justify-center rounded-3xl bg-[#f2f4ff] px-[10px]"
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
    const { principal, activeProvider } = useConnect();

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
                    <div></div>
                    <div>userInfo box</div>
                </div>
            </SideSheet>
        </>
    );
};

export default UserInfoModal;
