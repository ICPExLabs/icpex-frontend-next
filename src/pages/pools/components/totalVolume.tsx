import { useTranslation } from 'react-i18next';

function TotalVolume() {
    const { t } = useTranslation();

    return (
        <div className="flex gap-x-[30px]">
            <div className="flex flex-col">
                <p className="text-[12px] leading-[14px] font-medium text-[#666666]">{t('pools.totalVolume.tvl')}</p>
                <p className="mt-2 text-[20px] font-medium text-black">$0.00</p>
            </div>
            <div className="flex flex-col">
                <p className="text-[12px] leading-[14px] font-medium text-[#666666]">{t('pools.totalVolume.volume')}</p>
                <p className="mt-2 text-[20px] font-medium text-black">$0.00</p>
            </div>
            <div className="flex flex-col">
                <p className="text-[12px] leading-[14px] font-medium text-[#666666]">{t('pools.totalVolume.fees')}</p>
                <p className="mt-2 text-[20px] font-medium text-black">$0.00</p>
            </div>
        </div>
    );
}

export default TotalVolume;
