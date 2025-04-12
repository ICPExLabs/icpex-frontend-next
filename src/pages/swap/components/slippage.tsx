import { Dropdown, InputNumber, Switch, Tooltip } from '@douyinfe/semi-ui';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '@/components/ui/icon';
import { useAppStore } from '@/stores/app';

function SlippageComponents() {
    const { t } = useTranslation();
    const dropdownRef = useRef<Dropdown>(null);

    const { swapSlippage, setSwapSlippage, isSwapExpertMode, setIsSwapExpertMode } = useAppStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <Dropdown
            ref={dropdownRef}
            trigger="custom"
            className="dropdown-modal"
            position={'bottomRight'}
            visible={isDropdownOpen}
            onClickOutSide={() => setIsDropdownOpen(false)}
            render={
                <div className="flex w-60 flex-col rounded-[18px] border border-[#e3e8ff] bg-white px-[17px] pt-[16px] pb-[20px]">
                    <div className="pointer-events-auto flex w-full flex-col">
                        <p className="text-[16px] leading-[16px] font-semibold text-[#000000]">
                            {t('swap.setting.title')}
                        </p>

                        <div className="mt-[13px] flex w-full flex-col">
                            <p className="text-xs leading-3 font-medium text-[#666666]">
                                {t('swap.setting.tolerance')}
                            </p>
                            <div className="mt-2 flex w-full gap-x-[6px]">
                                <div className="flex h-[30px] w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#07C160] text-xs leading-3 font-medium text-white">
                                    {t('swap.setting.auto')}
                                </div>
                                <div className="flex h-[30px] flex-1 items-center justify-center rounded-lg bg-[#f2f4ff] px-[6px]">
                                    <div className="flex flex-1">
                                        <InputNumber
                                            value={swapSlippage}
                                            placeholder={t('swap.setting.tolerancePlaceholder')}
                                            className="flex h-full w-full min-w-auto text-xs font-medium !text-[#999999] outline-none"
                                            hideButtons
                                            step={0.1}
                                            min={0}
                                            onChange={(val) => {
                                                setSwapSlippage((val as number) || 0.5);
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs leading-3 font-medium text-[#999999]">%</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[13px] flex w-full items-center justify-between">
                            <div className="flex flex-1 items-center">
                                <p className="text-xs leading-[14px] font-medium text-[#666666]">
                                    {t('swap.setting.expert')}
                                </p>
                                <Tooltip position="top" content={t('swap.setting.expertTip')}>
                                    <Icon name="info" className="ml-2 h-3 w-3 cursor-pointer text-[#999999]"></Icon>
                                </Tooltip>
                            </div>

                            <Switch
                                defaultChecked={isSwapExpertMode}
                                onChange={(val) => {
                                    setIsSwapExpertMode(val);
                                }}
                                size="small"
                            ></Switch>
                        </div>
                    </div>

                    <div
                        onClick={() => setIsDropdownOpen(false)}
                        className="mt-3 flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-l from-[#7236fe] to-[#07C160] text-sm font-medium text-white"
                    >
                        {t('swap.setting.close')}
                    </div>
                </div>
            }
        >
            <div className="flex items-center gap-x-[10px]">
                <div className="flex flex-col items-end">
                    <p className="text-[10px] font-medium text-[#999999]">{t('swap.setting.slippage')}</p>
                    <p className="text-sm font-medium text-[#000000]">{swapSlippage}%</p>
                </div>
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group h-9 w-9 flex-shrink-0 cursor-pointer"
                >
                    <Icon name="setting" className="flex h-9 w-9 group-hover:hidden" />
                    <Icon name="setting-hover" className="hidden h-9 w-9 group-hover:flex" />
                </div>
            </div>
        </Dropdown>
    );
}

export default SlippageComponents;
