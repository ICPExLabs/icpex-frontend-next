import { useTranslation } from 'react-i18next';

function BatchComponents() {
    const { t } = useTranslation();

    return (
        <div className="ml-[10px] flex h-9 cursor-pointer items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-[#272E4D] duration-75 hover:bg-[#07c160] hover:text-white">
            {t('swap.batch')}
        </div>
    );
}

export default BatchComponents;
