import type { JSX } from "solid-js";

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  class?: string;
}

export default function Select(props: SelectProps): JSX.Element {
  return (
    <select
      {...props}
      class={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.class || ""}`}
    >
      {props.options.map((opt) => (
        <option value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
