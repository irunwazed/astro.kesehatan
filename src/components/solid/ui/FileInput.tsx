import type { JSX } from "solid-js";

interface FileInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  class?: string;
}

export default function FileInput(props: FileInputProps): JSX.Element {
  return (
    <input
      type="file"
      {...props}
      class={`w-full text-gray-700 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600 ${props.class || ""}`}
    />
  );
}
