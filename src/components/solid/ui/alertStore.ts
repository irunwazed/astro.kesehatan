import { createStore } from "solid-js/store";

export type AlertIcon = "success" | "error" | "warning" | "info";

export interface AlertOptions {
  title: string;
  message: string;
  icon?: AlertIcon;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  timeout?: number;
}

interface AlertState extends AlertOptions {
  visible: boolean;
  resolve?: (confirmed: boolean) => void;
}

const [state, setState] = createStore<AlertState>({
  visible: false,
  title: "",
  message: "",
  icon: "info",
});

export function showAlert(options: AlertOptions): Promise<boolean> {
  return new Promise((resolve) => {
    setState({
      ...options,
      visible: true,
      resolve,
    });


    if(!options.confirmText){
      let timeout = options.timeout ?? 2000
      setTimeout(() => {
        setState("visible", false);
        resolve(false);
      }, timeout);
    }
  });
}

export function hideAlert() {
  setState("visible", false);
  state.resolve?.(false);
}

export function confirmAlert(confirmed: boolean) {
  setState("visible", false);
  state.resolve?.(confirmed);
}

export default state;
