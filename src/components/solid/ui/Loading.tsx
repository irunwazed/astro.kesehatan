import { Show } from "solid-js";

type LoadingProps = {
  show: boolean;
  text?: string;
};

export default function Loading(props: LoadingProps) {
  return (
    <Show when={props.show}>
      <div class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div class="flex flex-col items-center gap-3">
          {/* Spinner */}
          <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          {/* Optional Text */}
          {props.text && (
            <span class="text-white text-lg font-medium">{props.text}</span>
          )}
        </div>
      </div>
    </Show>
  );
}
