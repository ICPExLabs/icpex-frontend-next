// Parse search string to lowercase, skip trim if empty
export const parseLowerCaseSearch = (search: string): string => {
    if (!search) return search;
    const s = search.trim().toLowerCase();
    if (!s) return search;
    return s;
};
