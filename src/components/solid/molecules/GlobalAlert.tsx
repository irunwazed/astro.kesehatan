import { Show } from "solid-js";
import state, { confirmAlert } from "@solid-ui/alertStore";

export default function GlobalAlert() {
  function renderIcon(icon: string) {
    switch (icon) {
      case "success": return <span class="text-green-500 text-3xl">✔️</span>;
      case "error": return <span class="text-red-500 text-3xl">❌</span>;
      case "warning": return <span class="text-yellow-500 text-3xl">⚠️</span>;
      case "info":
      default: return <span class="text-blue-500 text-3xl">ℹ️</span>;
    }
  }

  // console.log("state", state)

  return (
    <Show when={state.visible}>
        
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 flex flex-col items-center gap-4 animate-fade-in">
          {renderIcon(state.icon ?? "")}
          <h3 class="text-lg font-semibold">{state.title}</h3>
          <p class="text-gray-700 text-center">{state.message}</p>

          <div class="flex gap-2 mt-4">
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => confirmAlert(true)}
            >
              {state.confirmText || "OK"}
            </button>
            <Show when={state.showCancel}>
              <button
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => confirmAlert(false)}
              >
                {state.cancelText || "Cancel"}
              </button>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
