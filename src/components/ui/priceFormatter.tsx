import React from 'react';

interface PriceFormatterProps {
    price: number;
    className?: string;
    style?: React.CSSProperties;
    unit?: string;
}

export const PriceFormatter: React.FC<PriceFormatterProps> = ({ price, className = '', unit = '$' }) => {
    const formatPrice = (rawPrice: number): React.ReactNode => {
        const numericPrice = parseFloat(rawPrice.toString()).toFixed(20);
        const [intPart, decPartFull] = numericPrice.split('.');

        if (!decPartFull.startsWith('0')) {
            return `${intPart}.${decPartFull.slice(0, 8).replace(/0+$/, '')}`;
        }

        let zerosAfterFirst = 0;
        for (let i = 1; i < decPartFull.length; i++) {
            if (decPartFull[i] === '0') {
                zerosAfterFirst++;
            } else {
                break;
            }
        }

        if (zerosAfterFirst <= 4) {
            return `${intPart}.${decPartFull.slice(0, 8).replace(/0+$/, '')}`;
        }

        const remainingDigits = decPartFull
            .slice(1 + zerosAfterFirst, 1 + zerosAfterFirst + (8 - 1))
            .replace(/0+$/, '');

        return (
            <>
                {intPart}.0<sub>{zerosAfterFirst}</sub>
                {remainingDigits}
            </>
        );
    };

    return (
        <span className={className}>
            {unit}
            {!price ? 0 : formatPrice(price)}
        </span>
    );
};
