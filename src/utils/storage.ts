import type { ConnectType } from '@/types/identity.d';

export const readStorage = (key: string): string | undefined => {
    const r = localStorage.getItem(key);
    if (r == null) return undefined;
    return r;
};

export const writeStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

const LAST_CONNECT_TYPE = '__ICPEX_LAST_CONNECT_TYPE__';
export const readLastConnectType = () => readStorage(LAST_CONNECT_TYPE) ?? '';
export const writeLastConnectType = (connectType: ConnectType | '') => writeStorage(LAST_CONNECT_TYPE, connectType);
