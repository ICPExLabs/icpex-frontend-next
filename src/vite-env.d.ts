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

    // header menu urls
    HEADER_MENU_TWITTER_LINK: string;
    HEADER_MENU_DISCORD_LINK: string;
    HEADER_MENU_TELEGRAM_LINK: string;
    HEADER_MENU_WHITEPAPER_LINK: string;
    HEADER_MENU_GITHUB_LINK: string;

    // others ...
}
