import { useConnect } from '@connect2ic/react';
import { SideSheet, Toast } from '@douyinfe/semi-ui';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useIdentityStore } from '@/stores/identity';
import { cn } from '@/utils/classNames';

import Icon from '../ui/icon';

export const LoginButton = () => {
    const { connectedIdentity, setShowLoginModal } = useIdentityStore();

    const openLogin = () => {
        setShowLoginModal(true);
    };

    if (connectedIdentity) {
        return null;
    }

    return (
        <>
            {!connectedIdentity && (
                <div
                    onClick={openLogin}
                    className="flex h-[40px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#7236FE] to-[#7178FF] px-5 text-sm font-semibold text-white"
                >
                    Connect
                </div>
            )}
        </>
    );
};

type TypeWalletListItem = {
    id: string;
    name: string;
    type: string;
    icon: ReactElement;
    walletName: string;
};
const LoginModal = () => {
    const { t } = useTranslation();

    const { setShowLoginModal, showLoginModal } = useIdentityStore();

    const [isChecked, setIsChecked] = useState(true);

    const WalletList: TypeWalletListItem[] = [
        {
            id: 'dfinity',
            name: 'Internet Identity',
            type: 'ii',
            icon: <Icon name="ii" className="h-9 w-9" />,
            walletName: 'Internet Identity',
        },
        {
            id: 'plug',
            name: 'Plug Wallet',
            type: 'plug',
            icon: <Icon name="plug" className="h-9 w-9" />,
            walletName: 'Plug',
        },
    ];

    const { connect } = useConnect();

    const handleConnect = async (wallet: string) => {
        if (!isChecked) {
            Toast.error(t('common.connect.terms'));
            return false;
        }
        try {
            await connect(wallet);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <SideSheet
                visible={showLoginModal}
                onCancel={() => setShowLoginModal(false)}
                placement={'right'}
                className="login-modal"
                closeOnEsc={true}
            >
                <div className="relative mt-[77px] flex h-[calc(100vh-100px)] w-full flex-col items-center justify-start rounded-[20px] border border-[#e4e9ff] bg-white p-[20px] text-center">
                    <div className="flex w-full items-center justify-between">
                        <div className="text-base font-medium text-[#272e4d]">{t('common.connect.title')}</div>
                        <Icon
                            name="arrow-right"
                            className="h-5 w-5 cursor-pointer text-[#97A0C9]"
                            onClick={() => setShowLoginModal(false)}
                        />
                    </div>

                    <div className="mt-[22px] flex w-full flex-1 flex-col gap-y-[11px]">
                        {WalletList.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="flex h-[64px] w-full cursor-pointer items-center gap-x-[15px] rounded-[18px] bg-[#F2F4FF] px-5 duration-75 hover:bg-[#e4e9ff]"
                                onClick={() => handleConnect(wallet.type)}
                            >
                                {wallet.icon}
                                <div className="text-sm font-medium text-[#272e4d]">{wallet.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full cursor-pointer" onClick={() => setIsChecked(!isChecked)}>
                        <Icon
                            name="checkbox"
                            className={cn(
                                'mt-0.5 h-4 w-4 cursor-pointer',
                                isChecked ? 'text-[#7077FF]' : 'text-[#272E4D]',
                            )}
                        />
                        <p className="text-sm font-normal text-[#272e4d]">
                            {t('common.connect.protocol1')}
                            <Link to="" className="ml-2 underline" target="_blank">
                                {t('common.connect.protocol2')}
                            </Link>
                        </p>
                    </div>
                </div>
            </SideSheet>
        </>
    );
};

export default LoginModal;
