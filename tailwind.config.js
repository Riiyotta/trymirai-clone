/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',          // page text + dark panels
        'ink-soft': '#3D3D3D',   // dark-panel borders / body text
        'ink-2': '#1D1D1F',      // secondary dark
        muted: '#8F8F8F',        // small caption text
        'muted-2': '#86868B',
        rail: '#C7C7C7',         // hairline rules
        'rail-2': '#CCCCCC',
        hairline: '#CCCCCC',
        accent: '#FF6A20',       // Mirai orange
        'accent-hover': '#F05F18',   // benchmark bar, hovered
        'bar-track': '#EBEBEB',      // benchmark bar, non-winning
        'bar-track-hover': '#E0E0E0',// benchmark bar, non-winning + hovered
        cream: '#F6F5F3',
        beige: '#F2F1ED',
        'beige-hover': '#EAE9E4',
        'ink-muted': '#8F8F8F',
        chevron: '#60646C',
        cellborder: '#E5E5E5',   // panel / section rules on metrics + models
        'terminal-fill': '#F2F0ED', // light terminal panel
        'beige-chip': '#EAE8E1',   // chip / hover fill on beige cards
        'surface-dark': '#121212', // closed accordion panel
        'surface-dark-hover': '#1A1A1A',
        divider: '#E6E6E6',        // inner rule inside white browser chrome
        'terminal-chrome': '#E9E7E2', // url pill fill in the browser mock
        'accent-sub': '#FFA070',   // lower (autoregressive) segment of a stacked bar
        'bar-label': '#474747',    // label inside a non-winner bar
        'mac-red': '#FF5F57',
        'mac-yellow': '#FEBC2E',
        'mac-green': '#28C840',
        chipborder: '#D9DCDD',   // checkpoint chip outline
        chipfill: '#EFF0F1',     // selected chip
        'label-muted': '#666666',
        chrome: '#FAFAFA',
        'chrome-2': '#F2F2F2',
        foreground: '#0A0A0A',
      },
      fontFamily: {
        sans: ['Inter', 'Inter Fallback', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Fraunces Fallback', 'Times New Roman', 'serif'],
        mono: ['geistMono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: { shell: '1200px' },
      letterSpacing: { nav: '-0.14px' },
    },
  },
  plugins: [],
}
