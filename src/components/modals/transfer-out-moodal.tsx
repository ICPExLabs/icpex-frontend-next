import { Modal } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

import { useTokenStore } from '@/stores/token';

import HeaderModal from '../ui/header-modal';

export const TokenTransferOutModal = () => {
    const { t } = useTranslation();

    const { showTransferOutModal, setShowTransferOutModal } = useTokenStore();

    return (
        <Modal
            centered={true}
            visible={showTransferOutModal}
            footer={<></>}
            header={<></>}
            maskClosable={true}
            onCancel={() => setShowTransferOutModal(false)}
        >
            <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">
                <HeaderModal title={t('common.transferOut.title')} closeModal={setShowTransferOutModal} />
                TokenTransferOutModal
            </div>
        </Modal>
    );
};
