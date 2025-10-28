import { type JSX, Show, createSignal, createEffect } from "solid-js";

type ModalProps = {
    open: boolean;
    loading?: boolean;
    title?: string;
    onClose: () => void;
    children?: JSX.Element;
};

export default function Modal(props: ModalProps) {
    const [visible, setVisible] = createSignal(false);

    // Jalankan transisi ketika open berubah
    createEffect(() => {
        if (props.open) {
            setVisible(true);
        } else {
            // Delay untuk menunggu animasi keluar selesai
            setTimeout(() => setVisible(false), 300);
        }
    });

    return (
        <Show when={props.open || visible()}>
            <div
                class={`fixed inset-0 flex items-center justify-center z-50
          transition-opacity duration-300
          ${props.open ? "opacity-100 bg-black/60" : "opacity-0 bg-black/0"}`}
                onClick={props.onClose}
            >
                <div
                    class={`bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative mx-4
            transform transition-all duration-300
            ${props.open ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold">{props.title || "Modal"}</h2>
                        <button
                            class="text-gray-500 hover:text-gray-700"
                            onClick={props.onClose}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Konten */}
                    <div class="relative">
                        <Show
                            when={!props.loading}
                            fallback={
                                <div class="flex flex-col items-center justify-center p-10">
                                    <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                    <span class="text-gray-700">Sedang memproses...</span>
                                </div>
                            }
                        >
                            {props.children}
                        </Show>
                    </div>
                </div>
            </div>
        </Show>
    );
}
