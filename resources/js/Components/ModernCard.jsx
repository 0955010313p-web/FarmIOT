import React from 'react';
import theme from '../theme';

const ModernCard = ({ 
  children, 
  variant = 'default', 
  hover = true, 
  className = '',
  padding = 'md',
  ...props 
}) => {
  const baseStyles = 'rounded-xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border-0',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border-0',
    success: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800',
    warning: 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800',
    error: 'bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800',
    coffee: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border border-amber-200 dark:border-amber-800',
    
    // Universe Theme Variants
    cosmic: 'bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-cyan-900/30 backdrop-blur-md border border-purple-400/20 shadow-lg shadow-purple-500/10',
    stardust: 'bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-md border border-indigo-400/20 shadow-lg shadow-indigo-500/10',
    nebula: 'bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-md border border-cyan-400/20 shadow-lg shadow-cyan-500/10',
    galaxy: 'bg-gradient-to-br from-violet-900/30 via-indigo-900/30 to-blue-900/30 backdrop-blur-md border border-violet-400/20 shadow-lg shadow-violet-500/10',
    cosmicGlass: 'bg-gradient-to-br from-purple-800/20 via-blue-800/20 to-cyan-800/20 backdrop-blur-lg border border-purple-400/30 shadow-xl shadow-purple-500/20',
  };
  
  const paddings = {
    none: '',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const hoverStyles = hover ? 'hover:shadow-xl hover:scale-105 hover:-translate-y-1' : '';
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card components composition
const ModernCardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 ${className}`} {...props}>
    {children}
  </div>
);

const ModernCardBody = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const ModernCardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`} {...props}>
    {children}
  </div>
);

// Export components
export default ModernCard;
export { ModernCardHeader, ModernCardBody, ModernCardFooter };
