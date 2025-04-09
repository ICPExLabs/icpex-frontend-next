import { Button } from '@douyinfe/semi-ui';

import Icon from '@/components/ui/icon';

function SettingComponents() {
    return (
        <div className="flex items-center">
            <span className="text-center text-sm text-[#272E4D]">
                <div className="text-xs text-[#97A0C9]">Slippage</div>
                0.5%
            </span>
            <div className="ml-3 cursor-pointer">
                <Icon name="setting" className="h-10 w-10" />
            </div>
            <Button
                size="default"
                className="ml-3 !rounded-full !bg-white !px-4 !py-5 text-sm font-medium !text-[#272E4D]"
            >
                + Add Batch
            </Button>
        </div>
    );
}

export default SettingComponents;
