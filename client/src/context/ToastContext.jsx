import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ToastViewport from '@/components/ui/Toast';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const show = useCallback(
        (message, tone = 'info', duration = 4000) => {
            const id = ++idCounter;
            setToasts((prev) => [...prev, { id, message, tone }]);
            if (duration) {
                setTimeout(() => dismiss(id), duration);
            }
            return id;
        },
        [dismiss]
    );

    const toast = useMemo(
        () => ({
            show,
            success: (message, duration) => show(message, 'success', duration),
            error: (message, duration) => show(message, 'error', duration),
            info: (message, duration) => show(message, 'info', duration),
            dismiss,
        }),
        [show, dismiss]
    );

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within a <ToastProvider>');
    }
    return ctx;
}