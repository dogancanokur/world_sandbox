export type ToastOptions = {
  title?: string;
  description?: string;
};

export function toast(options: ToastOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:toast", { detail: options }));
  }
}
