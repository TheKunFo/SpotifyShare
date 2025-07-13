import React, { createContext, useContext, useState, useCallback } from "react";
import "./Toast.css";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback(
    (message, duration = 7000) => {
      return addToast(message, "error", duration);
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message, duration = 4000) => {
      return addToast(message, "success", duration);
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, duration = 5000) => {
      return addToast(message, "warning", duration);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, duration = 4000) => {
      return addToast(message, "info", duration);
    },
    [addToast]
  );

  const value = {
    showError,
    showSuccess,
    showWarning,
    showInfo,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`toast toast--${toast.type}`}>
      <div className="toast__content">
        <span className="toast__icon">{getIcon()}</span>
        <span className="toast__message">{toast.message}</span>
      </div>
      <button
        className="toast__close"
        onClick={onRemove}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default ToastProvider;
