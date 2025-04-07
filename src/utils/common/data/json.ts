import { isPrincipalText } from '../../principals';

// Custom JSON stringifier
// ! Note: Some types cannot be restored
// ? 1. Converts bigint to string
// ? 2. Converts principal to string
export const customStringify = (v: any): string =>
    JSON.stringify(v, (_key, value) => {
        if (typeof value === 'bigint') return `${value}`;
        if (value && typeof value === 'object' && value['_isPrincipal'] === true) {
            return value.toText();
        }
        if (value && typeof value === 'object' && value['__principal__'] && isPrincipalText(value['__principal__'])) {
            return value['__principal__'];
        }
        return value;
    });
