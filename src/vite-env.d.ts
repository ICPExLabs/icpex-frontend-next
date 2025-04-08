/// <reference types="vite/client" />

declare module '*.yaml' {
    const value: Record<string, any>;
    export default value;
}

declare module '*.yml' {
    const value: Record<string, any>;
    export default value;
}

export type BuildMode = 'production' | 'development';

export interface ImportMetaEnv {
    // build mode
    BUILD_MODE: BuildMode;
    CONNECT_HOST: string;

    // others ...
}
