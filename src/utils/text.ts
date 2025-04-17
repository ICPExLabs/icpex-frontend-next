// Shorten text with ellipsis in middle
export const shrinkText = (text: string | undefined, prefix = 5, suffix = 5): string | undefined => {
    if (!text) return text;
    const max_length = prefix + 3 + suffix; // Length of preserved string
    if (text.length <= max_length) return text;
    const prefix_text = prefix === 0 ? '' : text.slice(0, prefix); // Prefix part

    const suffix_text = suffix === 0 ? '' : text.slice(-suffix); // Suffix part
    return `${prefix_text}...${suffix_text}`; // Add ellipsis in middle
};

// Shorten principal ID
export const shrinkPrincipal = (text: string | undefined): string | undefined => shrinkText(text, 5, 3);
// Shorten account ID
export const shrinkAccount = (text: string | undefined): string | undefined => shrinkText(text, 4, 4);

export const transReserve = (text: string): string => {
    if (!text) return text;
    return text.replaceAll('_', '');
};
