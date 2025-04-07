type WithImplicitCoercion<T> = T | { valueOf(): T };
// Convert ArrayBuffer to string
export const array2string = (buf: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>): string => {
    const decoder = new TextDecoder();
    return decoder.decode(Buffer.from(buf));
};

// Convert String to ArrayBuffer
// https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
// https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
export const string2array = (text: string): number[] => {
    const encoder = new TextEncoder();
    return [...encoder.encode(text)];
};
