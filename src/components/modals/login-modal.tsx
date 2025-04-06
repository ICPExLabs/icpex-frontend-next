import { Modal } from '@douyinfe/semi-ui';

import { useIdentityActions, useShowLoginModal } from '@/stores/identity';

export const LoginButton = () => {
    const { setShowLoginModal } = useIdentityActions();

    const openLogin = () => {
        setShowLoginModal(true);
    };

    return (
        <div onClick={openLogin} className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center border">
            login
        </div>
    );
};

const LoginModal = () => {
    const { setShowLoginModal } = useIdentityActions();
    const showLoginModal = useShowLoginModal();

    return (
        <>
            <Modal
                title=""
                visible={showLoginModal}
                onOk={() => setShowLoginModal(false)}
                onCancel={() => setShowLoginModal(false)}
                centered
                modalContentClass="!rounded-3xl px-0 relative bg-white dark:bg-[#222222] duration-150 w-[calc(100%-24px)] mx-auto md:w-[440px]"
                footer={false}
                maskClosable={false}
                closeIcon={false}
                header={false}
            >
                <div className="relative flex h-[500px] w-full flex-col items-center justify-start text-center">
                    login modal
                </div>
            </Modal>
        </>
    );
};

export default LoginModal;
