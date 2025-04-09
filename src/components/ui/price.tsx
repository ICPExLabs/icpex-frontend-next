import { cn } from '@/utils/classNames';

import Icon from './icon';

type TokenPriceChangePercentageProps = {
    value: number;
    className?: string;
    showIcon?: boolean;
    precision?: number;
};

export const TokenPriceChangePercentage = ({
    value,
    className = '',
    showIcon = true,
    precision = 2,
}: TokenPriceChangePercentageProps) => {
    const normalizedValue = Number.isFinite(value) ? value : 0;
    const isPositive = normalizedValue > 0;
    const isNegative = normalizedValue < 0;
    const isZero = normalizedValue === 0;

    const displayValue = normalizedValue.toFixed(precision);

    return (
        <div
            className={cn(
                'inline-flex items-center text-xs font-medium',
                {
                    'text-[#07c160]': isPositive,
                    'text-[#ff5457]': isNegative,
                    'text-[#000]': isZero,
                },
                className,
            )}
            aria-label={`Price change: ${displayValue}%`}
        >
            {showIcon && (
                <>
                    {isPositive && <Icon name="up" className="mr-1 h-[5px] w-[9px] min-w-[9px]" aria-hidden="true" />}
                    {isNegative && <Icon name="down" className="mr-1 h-[5px] w-[9px] min-w-[9px]" aria-hidden="true" />}
                </>
            )}
            {displayValue}%
        </div>
    );
};
