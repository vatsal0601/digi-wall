import type { FC, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type Type = "success" | "error" | "info";

export interface Toast {
  type: Type;
  message: string;
}

export interface _Toast extends Toast {
  id: string;
}

interface ToastContextProps {
  toasts: _Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

const genId = (() => {
  let count = 0;
  return () => {
    return (++count).toString();
  };
})();

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<_Toast[]>([]);

  const addToast: (toast: Toast) => void = (toast) =>
    setToasts((toasts) => [...toasts, { id: genId(), ...toast }]);

  const removeToast: (id: string) => void = (id) =>
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast: () => ToastContextProps = () => {
  const context = useContext(ToastContext);
  if (context === undefined)
    throw new Error("useToast must be used within a ToastProvider");
  return context;
};
