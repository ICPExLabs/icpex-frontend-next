import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ScreeningMyPosition from './components/screeningMyPosition';
import ScreeningSearch from './components/screeningMyPosition copy';
import ScreeningPools, { TypeOptionValue } from './components/screeningPools';
import TotalVolume from './components/totalVolume';

function PoolsPage() {
    const { t } = useTranslation();

    const [screeningPools, setScreeningPools] = useState<TypeOptionValue>('all');
    const [isMyPosition, setIsMyPosition] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');

    return (
        <div className="mx-auto mt-[50px] w-full max-w-[1280px] flex-col px-[20px]">
            <div className="flex w-full justify-between">
                <div className="flex flex-col">
                    <p className="text-2xl font-medium text-black">{t('pools.title.title')}</p>
                    <p className="text-sm leading-tight font-medium text-[#666666]">{t('pools.title.tip')}</p>
                </div>

                <TotalVolume />
            </div>
            <div className="mt-5 flex w-full gap-x-3">
                <ScreeningPools screeningPools={screeningPools} setScreeningPools={setScreeningPools} />
                <ScreeningMyPosition isMyPosition={isMyPosition} setIsMyPosition={setIsMyPosition} />
                <ScreeningSearch keyword={keyword} setKeyword={setKeyword} />
            </div>
            {keyword}
        </div>
    );
}

export default PoolsPage;
