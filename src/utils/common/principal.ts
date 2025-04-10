import { Principal } from '@dfinity/principal';

// Convert Principal to string
export const principal2string = (p: Principal): string => p.toText();

// Convert string to Principal
export const string2principal = (p: string): Principal => Principal.fromText(p);
