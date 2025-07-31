# KAOS CRM Theming System

This document explains how to use the modern OKLCH CSS variables theming system in the KAOS CRM web application.

## Overview

We use a modern OKLCH CSS variables approach for theming, which provides:
- Better color science with perceptual uniformity
- Automatic dark/light mode support
- Wide color gamut support
- More predictable color manipulation
- Consistent contrast ratios

## CSS Variables Configuration

Our theming system is configured in:
- `components.json` - Main configuration with `cssVariables: true`
- `src/app/globals.css` - OKLCH CSS variable definitions
- `tailwind.config.js` - Tailwind integration
- `src/lib/utils.ts` - Utility functions

## Available Colors

### Core Theme Colors (OKLCH Format)
- `background` / `foreground` - Main page background and text
- `primary` / `primary-foreground` - Dark neutral primary color
- `secondary` / `secondary-foreground` - Light neutral accents
- `muted` / `muted-foreground` - Subtle backgrounds and text
- `accent` / `accent-foreground` - Interactive element highlights
- `border` - Border color for components
- `input` - Input field backgrounds
- `ring` - Focus ring color

### Status Colors
- `destructive` / `destructive-foreground` - Error states (red-orange)
- `warning` / `warning-foreground` - Warning states (amber)

### Chart Colors (Vibrant OKLCH)
- `chart-1` - Vibrant orange-yellow
- `chart-2` - Vibrant cyan-blue
- `chart-3` - Purple-blue
- `chart-4` - Green-yellow
- `chart-5` - Orange-red

### Uber Brand Colors (Converted to OKLCH)
- `uber-green` - Uber green in OKLCH
- `uber-green-dark` - Darker shade
- `uber-green-light` - Light shade
- `uber-black` - Brand black/white
- `uber-gray` - Brand gray
- `uber-dark-gray` - Darker brand gray

## Usage Examples

### Basic Components
```tsx
// Using semantic color names with OKLCH
<div className="bg-background text-foreground">
  Content with theme-aware background and text
</div>

// Using primary colors
<Button className="bg-primary text-primary-foreground">
  Primary Button
</Button>
```

### Custom Warning Component
```tsx
<div className="bg-warning text-warning-foreground p-4 rounded">
  This is a warning message with OKLCH colors!
</div>
```

### OKLCH Color Manipulation
```css
/* Hover states using OKLCH relative color syntax */
.btn-primary:hover {
  background-color: oklch(from var(--primary) calc(l * 0.9) c h);
}

/* Creating color variants */
.bg-primary-50 {
  background-color: oklch(from var(--primary) 0.95 calc(c * 0.3) h);
}
```

## Adding New Colors

To add new OKLCH theme colors:

1. **Add CSS variables in `globals.css`:**
```css
:root {
  --success: oklch(0.7 0.15 145);
  --success-foreground: oklch(0.98 0.02 145);
}

.dark {
  --success: oklch(0.6 0.15 145);
  --success-foreground: oklch(0.98 0.02 145);
}
```

2. **Update `tailwind.config.js`:**
```javascript
colors: {
  success: {
    DEFAULT: "var(--success)",
    foreground: "var(--success-foreground)",
  },
}
```

3. **Use in components:**
```tsx
<div className="bg-success text-success-foreground">
  Success message with OKLCH!
</div>
```

## OKLCH Benefits

### Better Color Science
- **Perceptual uniformity**: Equal steps in lightness appear equally different
- **Wide gamut**: Can represent more colors than HSL/RGB
- **Predictable**: Lightness changes don't affect hue or chroma

### Example OKLCH Values
```css
/* Light theme */
--background: oklch(1 0 0);        /* Pure white */
--foreground: oklch(0.145 0 0);    /* Very dark gray */
--primary: oklch(0.205 0 0);       /* Dark neutral */

/* Dark theme */
--background: oklch(0.145 0 0);    /* Very dark gray */
--foreground: oklch(0.985 0 0);    /* Near white */
--primary: oklch(0.922 0 0);       /* Light gray */
```

## Theme Switching

The app supports automatic theme switching with:
- Light mode
- Dark mode  
- System preference detection

Use the `ModeToggle` component in the navigation to switch themes.

## Custom Utilities

### Focus States
```tsx
<input className="focus-ring" />
```

### Shadows
```tsx
<div className="shadow-modern">Modern card shadow</div>
<div className="shadow-modern-lg">Large modern shadow</div>
```

### Glass Effect
```tsx
<div className="glass">Glass morphism effect</div>
```

### Custom Scrollbars
```tsx
<div className="custom-scrollbar">Themed scrollbars</div>
```

## Best Practices

1. **Always use semantic color names** (`bg-primary` instead of `bg-green-500`)
2. **Test in both light and dark modes**
3. **Use the `cn()` utility for conditional classes**
4. **Prefer CSS variables over hardcoded colors**
5. **Follow the background/foreground convention**

## Components.json Configuration

```json
{
  "style": "default",
  "rsc": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

This enables:
- CSS variables approach (`cssVariables: true`)
- Proper path aliases
- Modern component structure

## Testing Your Theme

Visit `/theme` to see a complete showcase of all available colors, components, and utilities in both light and dark modes.
