import React from 'react';
import theme from '../theme';

const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  icon, 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: `bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:scale-105`,
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
    success: `bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500 shadow-md hover:shadow-lg transform hover:scale-105`,
    warning: `bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500 shadow-md hover:shadow-lg transform hover:scale-105`,
    error: `bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:scale-105`,
    outline: 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-500',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    coffee: `bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 focus:ring-amber-600 shadow-lg hover:shadow-xl transform hover:scale-105`,
    
    // Universe Theme Variants
    cosmic: `bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white hover:from-purple-700 hover:via-blue-600 hover:to-cyan-500 focus:ring-purple-500 shadow-lg hover:shadow-xl transform hover:scale-105 border border-purple-400/30`,
    stardust: `bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 text-white hover:from-indigo-600 hover:via-purple-500 hover:to-pink-500 focus:ring-indigo-500 shadow-lg hover:shadow-xl transform hover:scale-105 border border-indigo-400/30`,
    nebula: `bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 focus:ring-cyan-500 shadow-lg hover:shadow-xl transform hover:scale-105 border border-cyan-400/30`,
    galaxy: `bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 text-white hover:from-violet-700 hover:via-indigo-600 hover:to-blue-700 focus:ring-violet-500 shadow-lg hover:shadow-xl transform hover:scale-105 border border-violet-400/30`,
    cosmicOutline: 'border-2 border-purple-400/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white focus:ring-purple-500 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105',
    stardustOutline: 'border-2 border-indigo-400/50 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-400 hover:text-white focus:ring-indigo-500 shadow-lg hover:shadow-indigo-500/25 transform hover:scale-105',
  };
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed transform-none' : '';
  
  const loadingSpinner = (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && loadingSpinner}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default ModernButton;
