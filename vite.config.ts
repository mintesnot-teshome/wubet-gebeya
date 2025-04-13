import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: [
                    'babel-plugin-macros',
                    '@babel/plugin-syntax-jsx',
                ],
            }
        }),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
        jsxInject: `import React from 'react'`,
        include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
                '.ts': 'tsx',
            }
        }
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            '@': resolve(__dirname, 'resources/js'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
});
