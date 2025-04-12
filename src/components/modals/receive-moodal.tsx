import { Modal } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

import { useTokenStore } from '@/stores/token';

import HeaderModal from '../ui/header-modal';

export const TokenReceiveModal = () => {
    const { t } = useTranslation();

    const { showReceiveModal, setShowReceiveModal } = useTokenStore();

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
                <HeaderModal title={t('common.receive.title')} closeModal={setShowReceiveModal} />

                <p>TokenReceiveModal</p>
            </div>
        </Modal>
    );
};
