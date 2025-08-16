export const THEME_CONSTANTS = {
  colors: {
    primary: '#1e1e1e',
    accent: '#667eea',
    background: '#f8f9fa',
    text: '#222',
    textSecondary: '#666',
    card: '#fff',
    border: '#e1e5e9',
    shadow: 'rgba(0, 0, 0, 0.08)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem'
  },
  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    full: '50%'
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 24px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.12)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.16)'
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  },
  animation: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms'
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  zIndex: {
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    tooltip: 50
  }
} as const;