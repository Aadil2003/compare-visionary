
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['SF Pro Display', 'system-ui', 'sans-serif'],
				mono: ['SF Mono', 'monospace'],
			},
			colors: {
				border: 'rgb(228, 228, 228)',
				input: 'rgb(228, 228, 228)',
				ring: 'rgb(0, 0, 0)',
				background: 'rgb(255, 255, 255)',
				foreground: 'rgb(0, 0, 0)',
				primary: {
					DEFAULT: 'rgb(0, 0, 0)',
					foreground: 'rgb(255, 255, 255)'
				},
				secondary: {
					DEFAULT: 'rgb(245, 245, 247)',
					foreground: 'rgb(0, 0, 0)'
				},
				destructive: {
					DEFAULT: 'rgb(255, 59, 48)',
					foreground: 'rgb(255, 255, 255)'
				},
				muted: {
					DEFAULT: 'rgb(245, 245, 247)',
					foreground: 'rgb(130, 130, 130)'
				},
				accent: {
					DEFAULT: 'rgb(245, 245, 247)',
					foreground: 'rgb(0, 0, 0)'
				},
				popover: {
					DEFAULT: 'rgb(255, 255, 255)',
					foreground: 'rgb(0, 0, 0)'
				},
				card: {
					DEFAULT: 'rgb(255, 255, 255)',
					foreground: 'rgb(0, 0, 0)'
				},
				sidebar: {
					DEFAULT: 'rgb(249, 249, 249)',
					foreground: 'rgb(0, 0, 0)',
					primary: 'rgb(0, 0, 0)',
					'primary-foreground': 'rgb(255, 255, 255)',
					accent: 'rgb(245, 245, 247)',
					'accent-foreground': 'rgb(0, 0, 0)',
					border: 'rgb(228, 228, 228)',
					ring: 'rgb(0, 122, 255)'
				}
			},
			borderRadius: {
				lg: '0.5rem',
				md: '0.4rem',
				sm: '0.3rem'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-up': {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.4s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
