/**
 * MUSINSA LayerDesktop Design Tokens v2.14.0
 * ES Module — import into any JS/TS/React project
 *
 * Usage:
 *   import { tokens, colors, typography, spacing } from './layer-desktop-tokens.js';
 *   // or destructure what you need:
 *   import { gray, blue, semantic } from './layer-desktop-tokens.js';
 */

// ── Primitive Colors ──────────────────────────────────────────

export const gray = {
  0:   '#ffffff',
  100: '#f5f5f5',
  200: '#ebebeb',
  300: '#e0e0e0',
  500: '#8a8a8a',
  600: '#666666',
  800: '#1a1a1a',
  900: '#000000',
};

export const grayAlpha = {
  '900-20': 'rgba(0, 0, 0, 0.2)',
  '900-60': 'rgba(0, 0, 0, 0.6)',
  '900-80': 'rgba(0, 0, 0, 0.8)',
  '500-10': 'rgba(138, 138, 138, 0.1)',
};

export const blue = {
  500: '#245eff',
  'alpha-500-10': 'rgba(36, 94, 255, 0.1)',
  'alpha-500-90': 'rgba(36, 94, 255, 0.9)',
};

export const red = {
  400: '#ff5e56',
  500: '#f31110',
  'alpha-500-10': 'rgba(243, 17, 16, 0.1)',
};

export const yellow = {
  400: '#ffa12a',
  500: '#fa9200',
  'alpha-500-10': 'rgba(250, 146, 0, 0.1)',
};

export const green = {
  400: '#27ba1d',
  500: '#1ea514',
  'alpha-500-10': 'rgba(30, 165, 20, 0.1)',
};

export const primitive = { gray, grayAlpha, blue, red, yellow, green };


// ── Semantic Colors ───────────────────────────────────────────

export const semantic = {
  fg: {
    default:    gray[900],
    low:        gray[600],
    lower:      gray[500],
    lowest:     '#cccccc',
    disabled:   grayAlpha['900-20'],
    onContrast: gray[0],
    inverse:    gray[0],
    neutral:    gray[800],
    accent:     blue[500],
    success:    green[500],
    warning:    yellow[500],
    critical:   red[500],
  },
  bg: {
    default:     gray[0],
    low:         gray[100],
    contrast:    gray[900],
    disabled:    grayAlpha['500-10'],
    transparent: grayAlpha['900-60'],
    neutral:     gray[800],
    neutralLow:  gray[200],
    accent:      blue[500],
    accentLow:   blue['alpha-500-10'],
    success:     green[500],
    successLow:  green['alpha-500-10'],
    warning:     yellow[500],
    warningLow:  yellow['alpha-500-10'],
    critical:    red[500],
    criticalLow: red['alpha-500-10'],
  },
  border: {
    default:    gray[300],
    low:        gray[200],
    strong:     gray[900],
    disabled:   gray[200],
    neutral:    gray[800],
    neutralLow: gray[200],
    accent:     blue[500],
    success:    green[500],
    successLow: green[400],
    warning:    yellow[500],
    warningLow: yellow[400],
    critical:   red[500],
    criticalLow:red[400],
    width:      '1px',
    boldWidth:  '2px',
  },
  divider: {
    default: gray[200],
    low:     grayAlpha['500-10'],
  },
};

export const colors = { primitive, semantic };


// ── Typography ────────────────────────────────────────────────

export const typography = {
  fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
  fontWeight: {
    regular: 400,
    medium:  500,
    bold:    700,
  },
  fontSize: {
    xs:  12,
    sm:  13,
    md:  14,
    lg:  15,
    xl:  16,
    '2xl': 18,
    '3xl': 20,
    '4xl': 24,
  },
  lineHeight: {
    xs: 1.5,
    sm: 1.4,
    md: 1.36,
    lg: 1.5,
  },
};


// ── Spacing ───────────────────────────────────────────────────

export const spacing = {
  2:  2,
  4:  4,
  6:  6,
  8:  8,
  10: 10,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
};


// ── Radius ────────────────────────────────────────────────────

export const radius = {
  none: 0,
  sm:   4,
  md:   6,
  lg:   8,
  xl:   12,
  full: 9999,
};


// ── Button Component Tokens ───────────────────────────────────

export const button = {
  variant: {
    primary: {
      bg:         semantic.bg.contrast,
      bgHover:    grayAlpha['900-80'],
      bgDisabled: semantic.bg.disabled,
      fg:         semantic.fg.onContrast,
      fgDisabled: semantic.fg.disabled,
    },
    outlined: {
      bg:       semantic.bg.default,
      bgHover:  grayAlpha['500-10'],
      border:   gray[900],
      fg:       semantic.fg.default,
    },
    secondary: {
      bg:         semantic.bg.low,
      bgHover:    gray[200],
      bgDisabled: semantic.bg.disabled,
      fg:         semantic.fg.default,
      fgDisabled: semantic.fg.disabled,
    },
    negative: {
      bg:     semantic.bg.default,
      border: red[500],
      fg:     red[500],
    },
    accent: {
      bg:      blue[500],
      bgHover: blue['alpha-500-90'],
      fg:      semantic.fg.onContrast,
    },
  },
  size: {
    xs: { height: 32, paddingX: 10, paddingY: 6,  fontSize: 13, fontWeight: 400, gap: 2 },
    sm: { height: 36, paddingX: 12, paddingY: 8,  fontSize: 14, fontWeight: 500, gap: 2 },
    md: { height: 40, paddingX: 12, paddingY: 10, fontSize: 14, fontWeight: 500, gap: 4 },
    lg: { height: 44, paddingX: 16, paddingY: 12, fontSize: 15, fontWeight: 500, gap: 4 },
    xl: { height: 52, paddingX: 20, paddingY: 16, fontSize: 15, fontWeight: 500, gap: 4 },
  },
  radius: 4,
};


// ── Combined export ───────────────────────────────────────────

export const tokens = {
  primitive,
  semantic,
  colors,
  typography,
  spacing,
  radius,
  button,
};

export default tokens;
