type TagType = 'ICRC-1' | 'ICRC-2';
type ICRCTagProps = {
    tag: TagType;
};
const ICRCTag = ({ tag }: ICRCTagProps) => {
    if (tag === 'ICRC-1') {
        return <div className="rounded bg-[#006732] px-2 py-0.5 text-xs font-medium text-white">ICRC-2</div>;
    }
    if (tag === 'ICRC-2') {
        return <div className="rounded bg-[#404D83] px-2 py-0.5 text-xs font-medium text-white">ICRC-1</div>;
    }
    return null;
};

function PriceComponents() {
    const testList = [
        {
            id: 1,
            icrc: 'ICRC-1',
            name: 'Internet Computer',
            symbol: 'ICP',
            icon: 'ICP',
            amount: '9.89',
        },
        {
            id: 2,
            icrc: 'ICRC-2',
            name: 'Chat',
            symbol: 'CHAT',
            icon: 'CHAT',
            amount: '0.000136',
        },
    ]; // TODO: get from ap

    return (
        <div className="mt-16 flex h-[40px] w-full flex-col items-center justify-center">
            {testList.map((item) => {
                return (
                    <div key={item.id} className="mt-4 flex w-full items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-12 w-12 rounded-full bg-[#E6EBFF]"></div>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-base font-medium text-[#272E4D]">{item.symbol}</span>
                                    <ICRCTag tag={item.icrc as TagType} />
                                </div>
                                <div className="text-xs font-medium text-[#97A0C9]">{item.name}</div>
                            </div>
                        </div>
                        <span>${item.amount}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default PriceComponents;
