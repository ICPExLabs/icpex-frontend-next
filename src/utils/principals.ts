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

// Convert Principal to string
export const principal2string = (p: Principal): string => p.toText();

// Convert string to Principal
export const string2principal = (p: string): Principal => Principal.fromText(p);
