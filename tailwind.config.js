export default {
    content: ['./index.html', './src/**/*.{jsx,js}'],
    theme: {
        extend: {
            fontFamily: {
                display: ['DM Sans', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                canvas: '#FFFFFF',
                surface: '#F8F8F7',
                raised: '#F1F0EE',
                border: '#E4E2DE',
                sidebar: '#18181A',
                brand: {
                    teal: '#1D9E75',
                    amber: '#BA7517',
                    red: '#A32D2D',
                },
                tier: {
                    1: { bg: '#E1F5EE', text: '#085041' },
                    2: { bg: '#FAEEDA', text: '#633806' },
                    3: { bg: '#F1EFE8', text: '#444441' },
                },
            },
            borderRadius: {
                sm: '4px', DEFAULT: '8px', lg: '12px', xl: '16px',
            },
        },
    },
};