// Modern theme configuration for FarmIOT
export const theme = {
  colors: {
    // Primary colors - Modern Blue gradient
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Success colors - Modern Green
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Warning colors - Modern Amber
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error colors - Modern Red
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    
    // Dark mode colors
    dark: {
      bg: '#0f172a',      // slate-900
      bgSecondary: '#1e293b', // slate-800
      bgTertiary: '#334155',  // slate-700
      text: '#f1f5f9',      // slate-100
      textSecondary: '#cbd5e1', // slate-300
      textTertiary: '#94a3b8', // slate-400
      border: '#334155',    // slate-700
      borderSecondary: '#475569', // slate-600
    },
    
    // Coffee shop inspired colors (for landing page)
    coffee: {
      charcoal: '#2c2416',    // Dark charcoal background
      gold: '#d4af37',        // Gold accent
      cream: '#f5f5dc',       // Cream color
      brown: '#8b4513',       // Brown accent
    }
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    dark: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    coffee: 'linear-gradient(135deg, #2c2416 0%, #1a1611 100%)',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(59, 130, 246, 0.15)',
    glowSuccess: '0 0 20px rgba(34, 197, 94, 0.15)',
    glowWarning: '0 0 20px rgba(245, 158, 11, 0.15)',
    glowError: '0 0 20px rgba(239, 68, 68, 0.15)',
  },
  
  // Animations
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  },
  
  // Border radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  }
};

export default theme;
