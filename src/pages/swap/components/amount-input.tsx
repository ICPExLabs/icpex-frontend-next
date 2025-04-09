import Icon from '@/components/ui/icon';
import { cn } from '@/utils/classNames';

type TokenType = {
    name: string;
    symbol: string;
    icon: string;
};
interface AmountInputProps {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    token: TokenType;
    className?: string;
}
function AmountInput({ value, onChange, placeholder = '0.00', className = '', token }: AmountInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        if (inputValue === '') {
            onChange(undefined);
            return;
        }

        if (inputValue.startsWith('.')) inputValue = '0' + inputValue;
        if (/^\d*\.?\d*$/.test(inputValue)) {
            onChange(inputValue === '' ? undefined : inputValue);
        }
    };

    return (
        <div className={cn('mt-2 flex justify-between', className)}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border-none bg-transparent text-3xl font-semibold text-[#C9D2FC] focus:ring-0 focus:outline-none"
            />
            <div className="flex w-30 cursor-pointer items-center space-x-2 rounded-full bg-[#E6EBFF] px-2 text-sm font-medium">
                {/* TODO icon */}
                <div className="h-6 w-6 shrink-0 rounded-full bg-white"></div>
                <div className="flex-1 text-left">{token.symbol}</div>
                <div className="flex h-4 w-4 shrink-0 items-center">
                    <Icon name="arrow-down" className="h-3 w-3" />
                </div>
            </div>
        </div>
    );
}

export default AmountInput;
