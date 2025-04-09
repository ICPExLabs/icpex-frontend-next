import { Button } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

import Icon from '@/components/ui/icon';

import { ActiveType } from '../index';

function SettingComponents({ active }: { active: ActiveType }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center">
            <span className="text-center text-sm text-[#272E4D]">
                <div className="text-xs text-[#97A0C9]">Slippage</div>
                0.5%
            </span>
            <div className="ml-3 cursor-pointer">
                <Icon name="setting" className="h-10 w-10" />
            </div>
            {active !== '/limit' && (
                <Button
                    size="default"
                    className="ml-3 !rounded-full !bg-white !px-4 !py-5 text-sm font-medium !text-[#272E4D]"
                >
                    {t('swap.batch')}
                </Button>
            )}
        </div>
    );
}

export default SettingComponents;
