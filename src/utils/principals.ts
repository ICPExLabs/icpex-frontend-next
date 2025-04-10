import { Principal } from '@dfinity/principal';

// Check if the string is a Principal
export const isPrincipalText = (text: string | undefined): boolean => {
    if (!text) return false;
    try {
        Principal.fromText(text);
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false;
    }
};

// Check if the string is a Canister Id
export const isCanisterIdText = (text: string | undefined): boolean => {
    if (!text) return false;
    if (text.length !== 27) return false;
    return isPrincipalText(text);
};
