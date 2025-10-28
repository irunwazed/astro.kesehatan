
import type { JSX } from "solid-js";

interface DateInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  class?: string;
}

export default function DateInput(props: DateInputProps): JSX.Element {
  return (
    <input
      type="date"
      {...props}
      class={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.class || ""}`}
    />
  );
}
