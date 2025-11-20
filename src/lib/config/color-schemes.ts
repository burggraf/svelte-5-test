/**
 * Color Scheme Configuration
 *
 * Each scheme has both light and dark mode variants.
 * All colors use OKLCH format for better perceptual uniformity.
 *
 * To add a new scheme:
 * 1. Add a new entry to the colorSchemes object
 * 2. Provide a unique id, name, and description
 * 3. Define light and dark mode color values
 * 4. Follow the existing variable naming convention
 */

export interface ColorScheme {
	id: string;
	name: string;
	description: string;
	light: {
		background: string;
		foreground: string;
		card: string;
		cardForeground: string;
		popover: string;
		popoverForeground: string;
		primary: string;
		primaryForeground: string;
		secondary: string;
		secondaryForeground: string;
		muted: string;
		mutedForeground: string;
		accent: string;
		accentForeground: string;
		destructive: string;
		border: string;
		input: string;
		ring: string;
	};
	dark: {
		background: string;
		foreground: string;
		card: string;
		cardForeground: string;
		popover: string;
		popoverForeground: string;
		primary: string;
		primaryForeground: string;
		secondary: string;
		secondaryForeground: string;
		muted: string;
		mutedForeground: string;
		accent: string;
		accentForeground: string;
		destructive: string;
		border: string;
		input: string;
		ring: string;
	};
}

export const colorSchemes: Record<string, ColorScheme> = {
	default: {
		id: 'default',
		name: 'Default Blue',
		description: 'Classic blue theme with slate grays',
		light: {
			background: 'oklch(1 0 0)',
			foreground: 'oklch(0.129 0.042 264.695)',
			card: 'oklch(1 0 0)',
			cardForeground: 'oklch(0.129 0.042 264.695)',
			popover: 'oklch(1 0 0)',
			popoverForeground: 'oklch(0.129 0.042 264.695)',
			primary: 'oklch(0.208 0.042 265.755)',
			primaryForeground: 'oklch(0.984 0.003 247.858)',
			secondary: 'oklch(0.968 0.007 247.896)',
			secondaryForeground: 'oklch(0.208 0.042 265.755)',
			muted: 'oklch(0.968 0.007 247.896)',
			mutedForeground: 'oklch(0.554 0.046 257.417)',
			accent: 'oklch(0.968 0.007 247.896)',
			accentForeground: 'oklch(0.208 0.042 265.755)',
			destructive: 'oklch(0.577 0.245 27.325)',
			border: 'oklch(0.929 0.013 255.508)',
			input: 'oklch(0.929 0.013 255.508)',
			ring: 'oklch(0.704 0.04 256.788)'
		},
		dark: {
			background: 'oklch(0.129 0.042 264.695)',
			foreground: 'oklch(0.984 0.003 247.858)',
			card: 'oklch(0.208 0.042 265.755)',
			cardForeground: 'oklch(0.984 0.003 247.858)',
			popover: 'oklch(0.208 0.042 265.755)',
			popoverForeground: 'oklch(0.984 0.003 247.858)',
			primary: 'oklch(0.929 0.013 255.508)',
			primaryForeground: 'oklch(0.208 0.042 265.755)',
			secondary: 'oklch(0.279 0.041 260.031)',
			secondaryForeground: 'oklch(0.984 0.003 247.858)',
			muted: 'oklch(0.279 0.041 260.031)',
			mutedForeground: 'oklch(0.704 0.04 256.788)',
			accent: 'oklch(0.279 0.041 260.031)',
			accentForeground: 'oklch(0.984 0.003 247.858)',
			destructive: 'oklch(0.704 0.191 22.216)',
			border: 'oklch(1 0 0 / 10%)',
			input: 'oklch(1 0 0 / 15%)',
			ring: 'oklch(0.551 0.027 264.364)'
		}
	},
	emerald: {
		id: 'emerald',
		name: 'Emerald Forest',
		description: 'Fresh green tones with natural warmth',
		light: {
			background: 'oklch(0.99 0.005 160)',
			foreground: 'oklch(0.15 0.03 165)',
			card: 'oklch(1 0 0)',
			cardForeground: 'oklch(0.15 0.03 165)',
			popover: 'oklch(1 0 0)',
			popoverForeground: 'oklch(0.15 0.03 165)',
			primary: 'oklch(0.55 0.15 165)',
			primaryForeground: 'oklch(0.99 0.005 165)',
			secondary: 'oklch(0.95 0.02 165)',
			secondaryForeground: 'oklch(0.25 0.04 165)',
			muted: 'oklch(0.95 0.02 165)',
			mutedForeground: 'oklch(0.50 0.08 165)',
			accent: 'oklch(0.93 0.04 165)',
			accentForeground: 'oklch(0.25 0.04 165)',
			destructive: 'oklch(0.577 0.245 27.325)',
			border: 'oklch(0.90 0.02 165)',
			input: 'oklch(0.90 0.02 165)',
			ring: 'oklch(0.55 0.15 165)'
		},
		dark: {
			background: 'oklch(0.15 0.03 165)',
			foreground: 'oklch(0.95 0.01 165)',
			card: 'oklch(0.20 0.04 165)',
			cardForeground: 'oklch(0.95 0.01 165)',
			popover: 'oklch(0.20 0.04 165)',
			popoverForeground: 'oklch(0.95 0.01 165)',
			primary: 'oklch(0.65 0.18 165)',
			primaryForeground: 'oklch(0.15 0.03 165)',
			secondary: 'oklch(0.25 0.05 165)',
			secondaryForeground: 'oklch(0.95 0.01 165)',
			muted: 'oklch(0.25 0.05 165)',
			mutedForeground: 'oklch(0.70 0.08 165)',
			accent: 'oklch(0.28 0.06 165)',
			accentForeground: 'oklch(0.95 0.01 165)',
			destructive: 'oklch(0.704 0.191 22.216)',
			border: 'oklch(1 0 0 / 10%)',
			input: 'oklch(1 0 0 / 15%)',
			ring: 'oklch(0.65 0.18 165)'
		}
	},
	sunset: {
		id: 'sunset',
		name: 'Sunset Orange',
		description: 'Warm orange and amber tones',
		light: {
			background: 'oklch(0.99 0.005 60)',
			foreground: 'oklch(0.18 0.04 40)',
			card: 'oklch(1 0 0)',
			cardForeground: 'oklch(0.18 0.04 40)',
			popover: 'oklch(1 0 0)',
			popoverForeground: 'oklch(0.18 0.04 40)',
			primary: 'oklch(0.60 0.18 40)',
			primaryForeground: 'oklch(0.99 0.01 40)',
			secondary: 'oklch(0.95 0.03 50)',
			secondaryForeground: 'oklch(0.25 0.05 40)',
			muted: 'oklch(0.95 0.03 50)',
			mutedForeground: 'oklch(0.50 0.08 40)',
			accent: 'oklch(0.93 0.05 45)',
			accentForeground: 'oklch(0.25 0.05 40)',
			destructive: 'oklch(0.577 0.245 27.325)',
			border: 'oklch(0.90 0.02 50)',
			input: 'oklch(0.90 0.02 50)',
			ring: 'oklch(0.60 0.18 40)'
		},
		dark: {
			background: 'oklch(0.18 0.04 40)',
			foreground: 'oklch(0.95 0.01 50)',
			card: 'oklch(0.23 0.05 40)',
			cardForeground: 'oklch(0.95 0.01 50)',
			popover: 'oklch(0.23 0.05 40)',
			popoverForeground: 'oklch(0.95 0.01 50)',
			primary: 'oklch(0.70 0.20 45)',
			primaryForeground: 'oklch(0.18 0.04 40)',
			secondary: 'oklch(0.28 0.06 40)',
			secondaryForeground: 'oklch(0.95 0.01 50)',
			muted: 'oklch(0.28 0.06 40)',
			mutedForeground: 'oklch(0.70 0.08 45)',
			accent: 'oklch(0.32 0.08 42)',
			accentForeground: 'oklch(0.95 0.01 50)',
			destructive: 'oklch(0.704 0.191 22.216)',
			border: 'oklch(1 0 0 / 10%)',
			input: 'oklch(1 0 0 / 15%)',
			ring: 'oklch(0.70 0.20 45)'
		}
	},
	purple: {
		id: 'purple',
		name: 'Royal Purple',
		description: 'Rich purple with violet accents',
		light: {
			background: 'oklch(0.99 0.005 300)',
			foreground: 'oklch(0.18 0.04 290)',
			card: 'oklch(1 0 0)',
			cardForeground: 'oklch(0.18 0.04 290)',
			popover: 'oklch(1 0 0)',
			popoverForeground: 'oklch(0.18 0.04 290)',
			primary: 'oklch(0.52 0.20 290)',
			primaryForeground: 'oklch(0.99 0.01 290)',
			secondary: 'oklch(0.95 0.03 295)',
			secondaryForeground: 'oklch(0.25 0.05 290)',
			muted: 'oklch(0.95 0.03 295)',
			mutedForeground: 'oklch(0.50 0.08 290)',
			accent: 'oklch(0.93 0.05 295)',
			accentForeground: 'oklch(0.25 0.05 290)',
			destructive: 'oklch(0.577 0.245 27.325)',
			border: 'oklch(0.90 0.02 295)',
			input: 'oklch(0.90 0.02 295)',
			ring: 'oklch(0.52 0.20 290)'
		},
		dark: {
			background: 'oklch(0.18 0.04 290)',
			foreground: 'oklch(0.95 0.01 295)',
			card: 'oklch(0.23 0.05 290)',
			cardForeground: 'oklch(0.95 0.01 295)',
			popover: 'oklch(0.23 0.05 290)',
			popoverForeground: 'oklch(0.95 0.01 295)',
			primary: 'oklch(0.65 0.22 295)',
			primaryForeground: 'oklch(0.18 0.04 290)',
			secondary: 'oklch(0.28 0.06 290)',
			secondaryForeground: 'oklch(0.95 0.01 295)',
			muted: 'oklch(0.28 0.06 290)',
			mutedForeground: 'oklch(0.70 0.08 295)',
			accent: 'oklch(0.32 0.08 292)',
			accentForeground: 'oklch(0.95 0.01 295)',
			destructive: 'oklch(0.704 0.191 22.216)',
			border: 'oklch(1 0 0 / 10%)',
			input: 'oklch(1 0 0 / 15%)',
			ring: 'oklch(0.65 0.22 295)'
		}
	},
	rose: {
		id: 'rose',
		name: 'Rose Pink',
		description: 'Soft pink with warm undertones',
		light: {
			background: 'oklch(0.99 0.005 350)',
			foreground: 'oklch(0.18 0.04 340)',
			card: 'oklch(1 0 0)',
			cardForeground: 'oklch(0.18 0.04 340)',
			popover: 'oklch(1 0 0)',
			popoverForeground: 'oklch(0.18 0.04 340)',
			primary: 'oklch(0.58 0.18 350)',
			primaryForeground: 'oklch(0.99 0.01 350)',
			secondary: 'oklch(0.95 0.03 350)',
			secondaryForeground: 'oklch(0.25 0.05 340)',
			muted: 'oklch(0.95 0.03 350)',
			mutedForeground: 'oklch(0.50 0.08 340)',
			accent: 'oklch(0.93 0.05 345)',
			accentForeground: 'oklch(0.25 0.05 340)',
			destructive: 'oklch(0.577 0.245 27.325)',
			border: 'oklch(0.90 0.02 350)',
			input: 'oklch(0.90 0.02 350)',
			ring: 'oklch(0.58 0.18 350)'
		},
		dark: {
			background: 'oklch(0.18 0.04 340)',
			foreground: 'oklch(0.95 0.01 350)',
			card: 'oklch(0.23 0.05 340)',
			cardForeground: 'oklch(0.95 0.01 350)',
			popover: 'oklch(0.23 0.05 340)',
			popoverForeground: 'oklch(0.95 0.01 350)',
			primary: 'oklch(0.68 0.20 350)',
			primaryForeground: 'oklch(0.18 0.04 340)',
			secondary: 'oklch(0.28 0.06 340)',
			secondaryForeground: 'oklch(0.95 0.01 350)',
			muted: 'oklch(0.28 0.06 340)',
			mutedForeground: 'oklch(0.70 0.08 345)',
			accent: 'oklch(0.32 0.08 342)',
			accentForeground: 'oklch(0.95 0.01 350)',
			destructive: 'oklch(0.704 0.191 22.216)',
			border: 'oklch(1 0 0 / 10%)',
			input: 'oklch(1 0 0 / 15%)',
			ring: 'oklch(0.68 0.20 350)'
		}
	},
	ocean: {
		id: 'ocean',
		name: 'Ocean Blue',
		description: 'Deep cyan and teal inspired by the sea',
		light: {
			background: 'oklch(0.99 0.005 210)',
			foreground: 'oklch(0.16 0.04 215)',
			card: 'oklch(1 0 0)',
			cardForeground: 'oklch(0.16 0.04 215)',
			popover: 'oklch(1 0 0)',
			popoverForeground: 'oklch(0.16 0.04 215)',
			primary: 'oklch(0.50 0.14 220)',
			primaryForeground: 'oklch(0.99 0.01 220)',
			secondary: 'oklch(0.95 0.02 215)',
			secondaryForeground: 'oklch(0.22 0.04 215)',
			muted: 'oklch(0.95 0.02 215)',
			mutedForeground: 'oklch(0.48 0.08 215)',
			accent: 'oklch(0.93 0.04 218)',
			accentForeground: 'oklch(0.22 0.04 215)',
			destructive: 'oklch(0.577 0.245 27.325)',
			border: 'oklch(0.90 0.02 215)',
			input: 'oklch(0.90 0.02 215)',
			ring: 'oklch(0.50 0.14 220)'
		},
		dark: {
			background: 'oklch(0.16 0.04 215)',
			foreground: 'oklch(0.95 0.01 220)',
			card: 'oklch(0.21 0.05 215)',
			cardForeground: 'oklch(0.95 0.01 220)',
			popover: 'oklch(0.21 0.05 215)',
			popoverForeground: 'oklch(0.95 0.01 220)',
			primary: 'oklch(0.62 0.16 220)',
			primaryForeground: 'oklch(0.16 0.04 215)',
			secondary: 'oklch(0.26 0.06 215)',
			secondaryForeground: 'oklch(0.95 0.01 220)',
			muted: 'oklch(0.26 0.06 215)',
			mutedForeground: 'oklch(0.68 0.08 218)',
			accent: 'oklch(0.30 0.07 217)',
			accentForeground: 'oklch(0.95 0.01 220)',
			destructive: 'oklch(0.704 0.191 22.216)',
			border: 'oklch(1 0 0 / 10%)',
			input: 'oklch(1 0 0 / 15%)',
			ring: 'oklch(0.62 0.16 220)'
		}
	}
};

export const defaultSchemeId = 'default';

export function getColorScheme(id: string): ColorScheme {
	return colorSchemes[id] || colorSchemes[defaultSchemeId];
}

export function getAllColorSchemes(): ColorScheme[] {
	return Object.values(colorSchemes);
}
