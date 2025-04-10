import { TokenInfo } from '@/canister/swap/swap.did.d';
import Icon from '@/components/ui/icon';
import { TokenLogo } from '@/components/ui/logo';
import { TypeTokenPrice } from '@/hooks/useTokenPrice';

type TagType = 'ICRC-1' | 'ICRC-2';
const ICRCTag = ({ tag }: { tag: TagType }) => {
    const tagConfig = {
        'ICRC-1': {
            text: 'ICRC-1',
            bgColor: '#006732', // 绿色
        },
        'ICRC-2': {
            text: 'ICRC-2',
            bgColor: '#3f4c83', // 蓝色
        },
    };

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

const PriceItem = ({ tokenInfo, price }: { tokenInfo: TokenInfo; price: TypeTokenPrice | undefined }) => {
    return (
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-[10px]">
                <TokenLogo className="h-12 w-12 shrink-0" canisterId={tokenInfo.canister_id.toString()} />
                <div className="flex flex-col">
                    <div className="flex items-center gap-x-[7px]">
                        <p className="text-base font-medium text-[#272e4d]">{tokenInfo.symbol}</p>
                        <ICRCTag tag="ICRC-1" />
                    </div>
                    <p className="text-xs font-medium text-[#97A0C9]">{tokenInfo.name}</p>
                </div>
            </div>
            <p className="text-base font-medium text-[#272e4d]">
                {price ? (
                    <p className="text-base font-medium text-[#272e4d]">
                        ${price?.price ? parseFloat(price?.price.toFixed(8)) : '--'}
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
    payTokenPrice,
    receiveTokenInfo,
    receiveTokenPrice,
}: {
    payTokenInfo: TokenInfo | undefined;
    payTokenPrice: TypeTokenPrice | undefined;
    receiveTokenInfo: TokenInfo | undefined;
    receiveTokenPrice: TypeTokenPrice | undefined;
}) {
    return (
        <div className="mt-[30px] flex w-full flex-col items-center justify-center gap-y-5">
            {payTokenInfo && <PriceItem tokenInfo={payTokenInfo} price={payTokenPrice} />}
            {receiveTokenInfo && <PriceItem tokenInfo={receiveTokenInfo} price={receiveTokenPrice} />}
        </div>
    );
}

export default PriceComponents;
