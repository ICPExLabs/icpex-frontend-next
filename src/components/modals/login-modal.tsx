import { useConnect } from '@connect2ic/react';
import { Modal } from '@douyinfe/semi-ui';
import { useEffect } from 'react';

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

const WalletList: {
    id: string;
    name: string;
    type: string;
    icon: string;
    walletName: string;
}[] = [
    {
        id: 'dfinity',
        name: 'Internet Identity',
        type: 'ii',
        icon: 'https://d15bmhsw4m27if.cloudfront.net/artemis/dfinity.svg',
        walletName: 'Internet Identity',
    },
    {
        id: 'plug',
        name: 'Plug Wallet',
        type: 'plug',
        icon: 'https://d15bmhsw4m27if.cloudfront.net/artemis/plug.jpg',
        walletName: 'Plug',
    },
];

const LoginModal = () => {
    const { setShowLoginModal } = useIdentityActions();
    const showLoginModal = useShowLoginModal();
    const {
        isConnected,
        connect,
        activeProvider: provider,
        principal,
        disconnect,
    } = useConnect({
        onConnect: (data) => {
            console.debug('🚀 ~ LoginModal ~ data:', data);
            // Signed in
        },
        onDisconnect: () => {
            // Signed out
        },
    });

    const handleConnect = async (wallet: string) => {
        try {
            await connect(wallet);
            // setShowLoginModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDisconnect = async () => {
        await disconnect();
    };

    // useEffect(() => {
    //     console.log('isConnected', isConnected, provider, principal);
    // }, [isConnected]);

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
                    <div onClick={() => handleDisconnect()}>handleDisconnect</div>
                    <div className="pt-5 text-2xl">Connect Wallet</div>
                    {WalletList.map((wallet) => (
                        <div
                            key={wallet.id}
                            className="mt-5 flex h-[50px] w-full cursor-pointer items-center justify-center gap-x-4"
                            onClick={() => handleConnect(wallet.type)}
                        >
                            <img
                                src={wallet.icon}
                                alt={wallet.name}
                                className="h-[48px] w-[48px] rounded-full border-[1px] border-[#8b9ac9]"
                            />
                            <div className="flex-1 text-left text-base">{wallet.name}</div>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
};

export default LoginModal;
