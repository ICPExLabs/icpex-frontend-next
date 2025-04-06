import React from 'react';

import { cn } from '@/utils/classNames';

export interface IconProps extends React.SVGAttributes<SVGElement> {
    /** The name of the icon (matches the sprite symbol ID) */
    name: string;
    /** Additional class names to apply to the SVG element */
    className?: string;
    /** Optional click handler */
    onClick?: React.MouseEventHandler<SVGElement>;
}

/**
 * A reusable SVG icon component that renders icons from a sprite sheet.
 * Supports all standard SVG props and click events.
 *
 * @example
 * <Icon name="arrow-right" className="text-blue-500" onClick={handleClick} />
 */
const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ name, className, onClick, ...props }, ref) => {
    return (
        <svg
            ref={ref}
            className={cn('icon', className)}
            aria-hidden={!props['aria-label']}
            onClick={onClick}
            {...props}
        >
            <use xlinkHref={`#icon-${name}`} />
        </svg>
    );
});

Icon.displayName = 'Icon';

export default Icon;
