import type { JSX } from "solid-js";

interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  class?: string;
}

export default function Textarea(props: TextareaProps): JSX.Element {
  return (
    <textarea
      {...props}
      class={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.class || ""}`}
    />
  );
}
