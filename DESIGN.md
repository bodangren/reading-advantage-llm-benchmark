---
version: alpha
name: Reading Advantage LLM Benchmark
colors:
  background: "#ffffff"
  foreground: "#262626"
  card: "#ffffff"
  card_foreground: "#262626"
  popover: "#ffffff"
  popover_foreground: "#262626"
  primary: "#333333"
  primary_foreground: "#fafafa"
  secondary: "#f5f5f5"
  secondary_foreground: "#333333"
  muted: "#f5f5f5"
  muted_foreground: "#8c8c8c"
  accent: "#f5f5f5"
  accent_foreground: "#333333"
  destructive: "#e11d48"
  destructive_foreground: "#fafafa"
  border: "#e5e5e5"
  input: "#e5e5e5"
  ring: "#b3b3b3"
spacing:
  base: 4px
rounded:
  small: 4px
  medium: 8px
  large: 10px
  full: 9999px
typography:
  display_lg:
    fontFamily: sans-serif
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.2
  headline_lg:
    fontFamily: sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  body_md:
    fontFamily: sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
---

# Design System

## Overview
The Reading Advantage LLM Benchmark (RALB) design system is built on a neutral, professional palette that emphasizes clarity and readability. It uses a modern, high-contrast aesthetic to present complex benchmark data and model comparisons effectively.

## Colors
The color palette is derived from neutral tones to provide a clean, technical appearance.

- **Primary (#333333):** Used for main actions, high-emphasis text, and key UI elements.
- **Secondary (#f5f5f5):** Used for lower-emphasis elements and subtle backgrounds.
- **Background (#ffffff):** The primary background color for a clean, open feel.
- **Muted (#f5f5f5):** Used for decorative elements and disabled states.
- **Destructive (#e11d48):** Reserved for dangerous actions and error states.
- **Border (#e5e5e5):** Used for separating content and defining UI boundaries.

## Typography
The system uses the **Geist** font family for its modern, geometric characteristics and excellent readability in technical contexts.

- **Display Large:** 36px/700. Used for main page titles (h1).
- **Headline Large:** 24px/600. Used for section headers (h2).
- **Body Medium:** 16px/400. Used for standard informational text.
- **Label Medium:** 14px/500. Used for table headers, small labels, and metadata.
- **Code Medium:** 14px/400. Used for monospaced data, identifiers, and code blocks.

## Spacing
Spacing is based on a 4px grid system, ensuring consistent alignment and rhythm across all components.

- **Base Unit:** 4px
- **Common Patterns:**
    - **4px (1):** Tight grouping.
    - **16px (4):** Standard component padding.
    - **24px (6):** Section spacing.
    - **32px (8):** Large layout gaps.

## Rounded
The system uses a variable radius scale to define the softness of UI elements.

- **Small (4px):** Checkboxes, tight UI controls.
- **Medium (8px):** Cards, modals, and larger containers.
- **Large (10px):** Default radius for most UI components (shadcn standard).
- **Full (9999px):** Pill-shaped buttons and badges.

## Components
Components are built using Tailwind CSS and Radix UI primitives, ensuring accessibility and consistent behavior.

- **Buttons:** Use `rounded-full` for a modern, interactive look.
- **Cards:** Use `rounded-lg` (10px) with subtle borders.
- **Tables:** Use a clean, borderless approach for row data with `text-sm` labels.

## Do's and Don'ts
- **Do** use `text-muted-foreground` for secondary information.
- **Do** maintain a consistent 4px grid for all layout decisions.
- **Don't** use arbitrary hex colors; always use the theme variables.
- **Don't** mix multiple font families; stick to Geist Sans and Geist Mono.
