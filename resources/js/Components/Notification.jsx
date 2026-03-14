import React, { useState, useEffect } from 'react';

const Notification = ({ 
    type = 'success', 
    message, 
    duration = 5000, 
    onClose,
    show = false 
}) => {
    const [isVisible, setIsVisible] = useState(show);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsVisible(show);
        if (show) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(() => {
                    setIsVisible(false);
                    if (onClose) onClose();
                }, 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!isVisible) return null;

    const getNotificationStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 max-w-sm backdrop-blur-sm";
        
        switch (type) {
            case 'success':
                return `${baseStyles} bg-gradient-to-r from-green-500 to-green-600 text-white border-l-4 border-green-700 shadow-green-500/25`;
            case 'error':
                return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600 text-white border-l-4 border-red-700 shadow-red-500/25`;
            case 'warning':
                return `${baseStyles} bg-gradient-to-r from-amber-500 to-amber-600 text-white border-l-4 border-amber-700 shadow-amber-500/25`;
            case 'info':
                return `${baseStyles} bg-gradient-to-r from-blue-500 to-blue-600 text-white border-l-4 border-blue-700 shadow-blue-500/25`;
            default:
                return `${baseStyles} bg-gradient-to-r from-gray-500 to-gray-600 text-white border-l-4 border-gray-700 shadow-gray-500/25`;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'warning':
                return (
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            case 'info':
                return (
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`${getNotificationStyles()} ${isAnimating ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium leading-5">{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={() => {
                            setIsAnimating(false);
                            setTimeout(() => {
                                setIsVisible(false);
                                if (onClose) onClose();
                            }, 300);
                        }}
                        className="inline-flex text-white/80 hover:text-white focus:outline-none focus:text-white transition ease-in-out duration-150 rounded-full p-1 hover:bg-white/10"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 bg-white/20 rounded-full h-1">
                <div 
                    className="bg-white h-1 rounded-full transition-all ease-linear"
                    style={{ 
                        width: '100%',
                        animation: `shrink ${duration}ms linear forwards`
                    }}
                ></div>
            </div>
        </div>
    );
};

// Add CSS animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
        }
    `;
    document.head.appendChild(style);
}

export default Notification;
