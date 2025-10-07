
type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

type Listener = (toasts: ToastMessage[]) => void;

class ToastManager {
  private toasts: ToastMessage[] = [];
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    listener(this.toasts); 
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  show(message: string, type: ToastType = "info") {
    const id = Date.now();
    this.toasts = [...this.toasts, { id, message, type }];
    this.notify();

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.notify();
    }, 3000);
  }
}

export const toastManager = new ToastManager();


export const toast = {
  success: (msg: string) => toastManager.show(msg, "success"),
  error: (msg: string) => toastManager.show(msg, "error"),
  info: (msg: string) => toastManager.show(msg, "info"),
};
