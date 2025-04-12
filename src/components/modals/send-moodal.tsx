import { Modal } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

import { useTokenStore } from '@/stores/token';

export const TokenSendMoodal = () => {
    const { t } = useTranslation();

    const { showSendModal, setShowSendModal } = useTokenStore();

    return (
        <Modal
            centered={true}
            visible={showSendModal}
            footer={<></>}
            header={<></>}
            maskClosable={true}
            onCancel={() => setShowSendModal(false)}
        >
            <div className="flex w-[400px] flex-col rounded-[20px] bg-white p-[20px]">snbd</div>
        </Modal>
    );
};
