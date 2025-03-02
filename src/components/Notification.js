// components/Notification.js
import React, { useEffect } from 'react';

/**
 * Reusable notification component for displaying status messages
 * 
 * @param {Object} props
 * @param {string} props.type - Notification type ('success', 'error', 'warning', 'info')
 * @param {string} props.message - Notification message
 * @param {function} props.onDismiss - Function to call when notification is dismissed
 * @param {number} props.duration - Auto-dismiss duration in milliseconds (0 for no auto-dismiss)
 */
const Notification = ({ type = 'info', message, onDismiss, duration = 5000 }) => {
  // Auto-dismiss after duration if specified
  useEffect(() => {
    if (duration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);
  
  // If no message, don't render
  if (!message) return null;
  
  // Set styling based on notification type
  const notificationStyles = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200'
  };
  
  return (
    <div className={`p-3 rounded-md shadow-sm ${notificationStyles[type]}`} role="alert">
      <div className="flex justify-between items-center">
        <div>{message}</div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="ml-2 text-gray-600 hover:text-gray-800"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;