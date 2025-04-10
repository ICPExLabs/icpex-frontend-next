import Icon from '@/components/ui/icon';
import { TokenLogo } from '@/components/ui/logo';
import { TagType, TokenBalanceInfo } from '@/hooks/useToken';

const ICRCTag = ({ tag }: { tag?: TagType }) => {
    const tagConfig = {
        ICRC1: {
            text: 'ICRC-1',
            bgColor: '#006732', // 绿色
        },
        ICRC2: {
            text: 'ICRC-2',
            bgColor: '#3f4c83', // 蓝色
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

const PriceItem = ({ tokenInfo }: { tokenInfo: TokenBalanceInfo }) => {
    console.log('🚀 ~ PriceItem ~ tokenInfo:', tokenInfo);
    return (
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-[10px]">
                <TokenLogo className="h-12 w-12 shrink-0" canisterId={tokenInfo.canister_id.toString()} />
                <div className="flex flex-col">
                    <div className="flex items-center gap-x-[7px]">
                        <p className="text-base font-medium text-[#272e4d]">{tokenInfo.symbol}</p>
                        <ICRCTag tag={tokenInfo?.standard} />
                    </div>
                    <p className="text-xs font-medium text-[#97A0C9]">{tokenInfo.name}</p>
                </div>
            </div>
            <p className="text-base font-medium text-[#272e4d]">
                {tokenInfo ? (
                    <p className="text-base font-medium text-[#272e4d]">
                        {tokenInfo?.price ? `$${parseFloat(tokenInfo?.price.toFixed(8))}` : '--'}
                    </p>
                ) : (
                    <Icon name="loading" className="h-[14px] w-[14px] animate-spin text-[#7178FF]" />
                )}
            </p>
        </div>
    );
};

function PriceComponents({
    payTokenInfo,
    receiveTokenInfo,
}: {
    payTokenInfo: TokenBalanceInfo | undefined;
    receiveTokenInfo: TokenBalanceInfo | undefined;
}) {
    return (
        <div className="mt-[30px] flex w-full flex-col items-center justify-center gap-y-5">
            {payTokenInfo && <PriceItem tokenInfo={payTokenInfo} />}
            {receiveTokenInfo && <PriceItem tokenInfo={receiveTokenInfo} />}
        </div>
    );
}

export default PriceComponents;
