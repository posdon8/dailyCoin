import { useEffect } from 'react';

/**
 * Thông báo (toast/alert)
 */
const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
      <style>{`
        .notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 16px 24px;
          border-radius: 6px;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .notification-success {
          background-color: #d5f4e6;
          color: #229954;
          border-left: 4px solid #27ae60;
        }

        .notification-danger {
          background-color: #fadbd8;
          color: #c0392b;
          border-left: 4px solid #e74c3c;
        }

        .notification-warning {
          background-color: #fdebd0;
          color: #d68910;
          border-left: 4px solid #f39c12;
        }

        .notification-info {
          background-color: #d6eaf8;
          color: #1a5276;
          border-left: 4px solid #3498db;
        }

        @media (max-width: 768px) {
          .notification {
            bottom: 10px;
            right: 10px;
            left: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
