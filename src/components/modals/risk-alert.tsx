import { Modal } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { cn } from '@/utils/classNames';

import HeaderModal from '../ui/header-modal';
import Icon from '../ui/icon';

export const RiskAlertModal = ({
    isShow,
    closeModal,
    onAgree,
}: {
    isShow: boolean;
    closeModal: () => void;
    onAgree: () => void;
}) => {
    const { t } = useTranslation();
    const [isChecked, setIsChecked] = useState(true);

    const handleAgree = () => {
        if (isChecked) {
            onAgree();
        }
    };

    return (
        <Modal
            centered={true}
            visible={isShow}
            footer={<></>}
            header={<></>}
            maskClosable={true}
            onCancel={() => closeModal()}
        >
            <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">
                <HeaderModal title={t('pools.riskAlert.title')} closeModal={closeModal} />
                <div className="mt-[27px] text-sm leading-normal font-medium text-[#666666]">
                    {t('pools.riskAlert.tip')}
                </div>
                <div className="mt-[58px] flex w-full cursor-pointer" onClick={() => setIsChecked(!isChecked)}>
                    <Icon
                        name="checkbox"
                        className={cn('mt-0.5 h-4 w-4 cursor-pointer', isChecked ? 'text-[#07C160]' : 'text-[#000000]')}
                    />
                    <p className="ml-[9px] text-left text-sm font-medium text-[#666666]">
                        {t('common.connect.protocol1')}
                        <Link to="" className="ml-2 text-[#07c160] underline outline-none" target="_blank">
                            {t('common.connect.protocol2')}
                        </Link>
                    </p>
                </div>
                <div
                    onClick={handleAgree}
                    className={cn(
                        'mt-[20px] flex h-[52px] w-full items-center justify-center rounded-[14px] duration-75',
                        isChecked && 'cursor-pointer bg-gradient-to-r from-[#08be65] to-[#2161f9] text-white',
                        !isChecked && 'cursor-not-allowed bg-[#f6f6f6] text-[#999999]',
                    )}
                >
                    <p className="text-base font-semibold">Continue</p>
                </div>
            </div>
        </Modal>
    );
};
