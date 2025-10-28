import type { JSX } from "solid-js";

interface DateTimeInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  class?: string;
}

export default function DateTimeInput(props: DateTimeInputProps): JSX.Element {
  return (
    <input
      type="datetime-local"
      {...props}
      class={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.class || ""}`}
    />
  );
}
