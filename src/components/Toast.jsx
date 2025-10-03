import React, { useEffect } from 'react';

/**
 * Toast Notification Component
 * 
 * Simple but essential component for user feedback.
 * Started as just error messages, expanded to support success and info types.
 * Auto-dismisses after 3 seconds but users can close manually.
 * 
 * Positioned at top-right to avoid interfering with main content.
 */
function Toast({ message, type = 'error', onClose }) {
  // Auto-dismiss after 3 seconds (learned this is a good default from UX research)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 3000);

    // Cleanup timer if component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [onClose]);

  // Determine styling based on message type
  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  // Get appropriate icon for message type
  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div 
      className={`fixed top-4 right-4 ${getToastStyles()} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 border-l-4 max-w-md`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center">
        <span className="mr-3 text-lg" aria-hidden="true">
          {getIcon()}
        </span>
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 font-bold text-lg leading-none"
          aria-label="Close notification"
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;