import { BuildMode } from '@/vite-env';

const ENV_VARS = {
    NODE_ENV: 'NODE_ENV',
    BUILD_MODE: 'BUILD_MODE',
    CONNECT_HOST: 'CONNECT_HOST',
} as const;

const isBuildMode = (value: unknown): value is BuildMode => {
    return value === 'production' || value === 'development';
};

/**
 * Gets the current command mode (serve/build)
 * Defaults to 'build' if NODE_ENV is not set
 */
export const getCommand = (): 'serve' | 'build' => {
    return import.meta.env.MODE === 'development' ? 'serve' : 'build';
};

/**
 * Gets the current build mode with type safety
 * Defaults to 'production' if invalid or missing
 */
export const getBuildMode = (): BuildMode => {
    const mode = import.meta.env[ENV_VARS.BUILD_MODE];
    return isBuildMode(mode) ? mode : 'production';
};

/**
 * Checks if current environment is development
 */
export const isDevMode = (): boolean => {
    return getBuildMode() === 'development';
};

/**
 * Gets the connect host URL if set
 */
export const getConnectHost = (): string | undefined => {
    const host = import.meta.env[ENV_VARS.CONNECT_HOST];
    return typeof host === 'string' ? host : undefined;
};

/**
 * Gets the derivation origin based on build mode
 */
export const getConnectDerivationOrigin = (): string | undefined => {
    switch (getBuildMode()) {
        case 'production':
        case 'development':
            return undefined;
        default:
            return undefined;
    }
};

// get import env value
export const getImportMetaEnv = (key: keyof ImportMetaEnv) => {
    return import.meta.env[key];
};
