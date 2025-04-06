import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines clsx and tailwind-merge for optimal class name handling.
 * Merges and deduplicates Tailwind CSS classes while properly handling all clsx inputs.
 *
 * @param {...ClassValue[]} inputs - Class names or class name conditions to merge
 * @returns {string} Optimized, deduplicated class string
 *
 * @example
 * cn('px-2 py-1', 'px-4') // → 'py-1 px-4'
 * cn(true && 'bg-red-500', false && 'text-white') // → 'bg-red-500'
 */
export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};
