import { Modal } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

import { useTokenStore } from '@/stores/token';

export const TokenTransferInModal = () => {
    const { t } = useTranslation();

    const { showTransferInModal, setShowTransferInModal } = useTokenStore();

    return (
        <Modal
            centered={true}
            visible={showTransferInModal}
            footer={<></>}
            header={<></>}
            maskClosable={true}
            onCancel={() => setShowTransferInModal(false)}
        >
            <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">snbd</div>
        </Modal>
    );
};
