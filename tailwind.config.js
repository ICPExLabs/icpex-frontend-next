// tailwind.config.js
const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // ...
        // make sure it's pointing to the ROOT node_module
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    exclude: ['./node_modules'],
    theme: {
        extend: {
            backgroundImage: {
                'main-bg-light': 'linear-gradient(180deg, #DCE4FF 0%, #F7F7F7 27.88%, #FFF 66.35%)',
            },
        },
    },
    darkMode: 'class',
    plugins: [heroui()],
};
