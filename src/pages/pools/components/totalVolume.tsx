import { useTranslation } from 'react-i18next';

import Icon from '@/components/ui/icon';
import { formatNumber, truncateDecimalToBN } from '@/utils/numbers';

function TotalVolume({ totalTVL }: { totalTVL: number | undefined }) {
    const { t } = useTranslation();

    return (
        <div className="flex gap-x-[30px]">
            <div className="flex flex-col">
                <p className="text-[12px] leading-[14px] font-medium text-[#666666]">{t('pools.totalVolume.tvl')}</p>
                {typeof totalTVL === 'undefined' ? (
                    <Icon name="loading" className="mt-2 h-[20px] w-[20px] animate-spin text-[#07c160]" />
                ) : (
                    <p className="mt-2 text-[20px] font-medium text-black">
                        ${formatNumber(truncateDecimalToBN(totalTVL, 4))}
                    </p>
                )}
            </div>
            {/* <div className="flex flex-col">
                <p className="text-[12px] leading-[14px] font-medium text-[#666666]">{t('pools.totalVolume.volume')}</p>
                <p className="mt-2 text-[20px] font-medium text-black">$0.00</p>
            </div>
            <div className="flex flex-col">
                <p className="text-[12px] leading-[14px] font-medium text-[#666666]">{t('pools.totalVolume.fees')}</p>
                <p className="mt-2 text-[20px] font-medium text-black">$0.00</p>
            </div> */}
        </div>
    );
}

export default TotalVolume;
