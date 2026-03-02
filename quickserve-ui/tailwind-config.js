tailwind.config = {
    theme: {
        extend: {
            colors: {
                accent: {
                    DEFAULT: '#F5F4F1',
                    foreground: '#1A1918'
                },
                background: '#F5F4F1',
                border: {
                    DEFAULT: '#E5E4E1',
                    strong: '#D1D0CD'
                },
                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#1A1918'
                },
                error: {
                    DEFAULT: '#FEF2F2',
                    foreground: '#DC2626'
                },
                info: {
                    DEFAULT: '#EFF6FF',
                    foreground: '#2563EB'
                },
                success: {
                    DEFAULT: '#ECFDF5',
                    foreground: '#059669'
                },
                warning: {
                    DEFAULT: '#FFFBEB',
                    foreground: '#D97706'
                },
                destructive: {
                    DEFAULT: '#DC2626',
                    foreground: '#FFFFFF'
                },
                foreground: '#1A1918',
                input: '#E5E4E1',
                muted: {
                    DEFAULT: '#F0EFEC',
                    foreground: '#6D6C6A'
                },
                primary: {
                    DEFAULT: '#EF4444',
                    foreground: '#FFFFFF',
                    hover: '#DC2626',
                    soft: '#FEF2F2'
                },
                ring: '#EF4444',
                secondary: {
                    DEFAULT: '#F0EFEC',
                    foreground: '#1A1918'
                },
                sidebar: {
                    DEFAULT: '#FFFFFF',
                    active: '#FEF2F2',
                    'active-foreground': '#EF4444',
                    border: '#E5E4E1',
                    foreground: '#6D6C6A'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif']
            },
            borderRadius: {
                'xs': '4px',
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                'pill': '999px'
            }
        }
    }
};
