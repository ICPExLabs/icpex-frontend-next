import path from 'path';
import ViteYaml from '@modyfi/vite-plugin-yaml';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    const isProd = command === 'build' && mode === 'production';

    const config: UserConfig = {
        mode,
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
            'process.env': process.env,
        },
        plugins: [react(), tailwindcss(), ViteYaml()],
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['legacy-js-api'],
                },
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
        },
        build: {
            target: 'es2020',
            minify: isProd ? 'terser' : false,
            terserOptions: {
                compress: {
                    drop_console: isProd,
                    drop_debugger: isProd,
                },
            },
        },
        esbuild: {},
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2020',
            },
        },
        envDir: 'env',
        envPrefix: ['BUILD', 'CONNECT', 'ALCHEMY'],
        clearScreen: false,
        server: {
            hmr: {
                host: 'localhost',
                protocol: 'ws',
            },
        },
    };

    return config;
});
