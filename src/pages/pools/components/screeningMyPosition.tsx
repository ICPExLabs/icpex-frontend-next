import { useTranslation } from 'react-i18next';

import { cn } from '@/utils/classNames';

const ScreeningMyPosition = ({
    isMyPosition,
    setIsMyPosition,
}: {
    isMyPosition: boolean;
    setIsMyPosition: (val: boolean) => void;
}) => {
    const { t } = useTranslation();

    return (
        <div
            onClick={() => setIsMyPosition(!isMyPosition)}
            className={cn(
                'flex h-11 w-28 cursor-pointer items-center justify-center rounded-[10px] border border-[#dddddd] bg-white',
                isMyPosition && 'border-[#07c160] bg-[#07c160]',
            )}
        >
            <p className={cn('text-center text-sm font-medium text-[#666666]', isMyPosition && 'text-[#fff]')}>
                {t('pools.screening.position')}
            </p>
        </div>
    );
};

export default ScreeningMyPosition;
