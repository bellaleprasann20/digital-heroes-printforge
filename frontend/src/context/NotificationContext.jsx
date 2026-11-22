import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const NotificationContext = createContext(null);

let notificationCounter = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timersRef.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }, []);

  const notify = useCallback((message, type = 'info', options = {}) => {
    if (!message) return null;

    const id = `notification-${Date.now()}-${++notificationCounter}`;
    const duration = Math.max(0, Number(options.duration ?? 5000));

    const notification = {
      id,
      message: String(message),
      type: ['success', 'error', 'warning', 'info'].includes(type)
        ? type
        : 'info',
      createdAt: new Date().toISOString(),
    };

    setNotifications((current) => [
      ...current,
      notification,
    ]);

    if (duration > 0) {
      const timer = setTimeout(() => {
        dismiss(id);
      }, duration);

      timersRef.current.set(id, timer);
    }

    return id;
  }, [dismiss]);

  const success = useCallback(
    (message, options) => notify(message, 'success', options),
    [notify]
  );

  const error = useCallback(
    (message, options) => notify(message, 'error', options),
    [notify]
  );

  const warning = useCallback(
    (message, options) => notify(message, 'warning', options),
    [notify]
  );

  const info = useCallback(
    (message, options) => notify(message, 'info', options),
    [notify]
  );

  const clearAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setNotifications([]);
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const value = useMemo(() => ({
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    dismiss,
    clearAll,
  }), [
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    dismiss,
    clearAll,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification must be used inside a NotificationProvider.'
    );
  }

  return context;
}