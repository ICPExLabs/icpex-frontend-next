import { Select } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

export type TypeOptionValue = 'all' | 'public' | 'anchored';
interface TypeOptionListItem {
    value: TypeOptionValue;
    label: string;
}

const ScreeningPools = ({
    screeningPools,
    setScreeningPools,
}: {
    screeningPools: TypeOptionValue;
    setScreeningPools: (val: TypeOptionValue) => void;
}) => {
    const { t } = useTranslation();

    const optionList: TypeOptionListItem[] = [
        { value: 'all', label: t('pools.screening.all') },
        { value: 'public', label: t('pools.screening.public') },
        { value: 'anchored', label: t('pools.screening.anchored') },
    ];

    return (
        <Select
            className="!h-11 w-[120px] !rounded-[10px] !border !border-[#dddddd] !bg-white !text-[#666666]"
            defaultValue={screeningPools}
            onChange={(e) => setScreeningPools(e as TypeOptionValue)}
            optionList={optionList}
        ></Select>
    );
};

export default ScreeningPools;
