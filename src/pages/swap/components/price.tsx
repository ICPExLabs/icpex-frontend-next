import { useConnect } from '@connect2ic/react';

import Icon from '@/components/ui/icon';
import { TokenLogo } from '@/components/ui/logo';
import { PriceFormatter } from '@/components/ui/priceFormatter';
import { TypeTokenPriceInfoVal } from '@/hooks/useToken';
import { truncateDecimalToBN } from '@/utils/numbers';

const ICRCTag = ({ tag }: { tag: string }) => {
    const tagConfig = {
        ICRC1: {
            text: 'ICRC-1',
            bgColor: '#006732',
        },
        ICRC2: {
            text: 'ICRC-2',
            bgColor: '#3f4c83',
        },
    };

    if (!tag) {
        return <></>;
    }
    const config = tagConfig[tag];
    if (!config) return null;
    return (
        <p
            className="flex h-[14px] items-center justify-center rounded px-[5px] text-[10px] font-medium text-white"
            style={{ backgroundColor: config.bgColor }}
        >
            {config.text}
        </p>
    );
};

const PriceItem = ({ tokenInfo }: { tokenInfo: TypeTokenPriceInfoVal }) => {
    const { isConnected } = useConnect();

    return (
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-[10px]">
                <TokenLogo className="h-12 w-12 shrink-0" canisterId={tokenInfo.canister_id.toString()} />
                <div className="flex flex-col">
                    <div className="flex items-center gap-x-[7px]">
                        <p className="text-base font-medium text-[#000000]">{tokenInfo.symbol}</p>
                        {tokenInfo?.standard && <ICRCTag tag={tokenInfo?.standard} />}
                    </div>
                    <p className="text-xs font-medium text-[#999999]">{tokenInfo.name}</p>
                </div>
            </div>

            {isConnected ? (
                <>
                    {tokenInfo.priceUSD ? (
                        <p className="text-base font-medium text-[#000000]">
                            <PriceFormatter price={tokenInfo.priceUSD} />
                        </p>
                    ) : (
                        <Icon name="loading" className="h-[14px] w-[14px] animate-spin text-[#07c160]" />
                    )}
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

function PriceComponents({
    payTokenInfo,
    receiveTokenInfo,
}: {
    payTokenInfo: TypeTokenPriceInfoVal | undefined;
    receiveTokenInfo: TypeTokenPriceInfoVal | undefined;
}) {
    return (
        <div className="mt-[20px] flex w-full flex-col items-center justify-center gap-y-5">
            {payTokenInfo && <PriceItem tokenInfo={payTokenInfo} />}
            {receiveTokenInfo && <PriceItem tokenInfo={receiveTokenInfo} />}
        </div>
    );
}

export default PriceComponents;
