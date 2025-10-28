import type { JSX } from "solid-js";

interface FormLabelProps {
  for?: string;
  text: string;
  class?: string;
}

export default function FormLabel(props: FormLabelProps): JSX.Element {
  return (
    <label
      for={props.for}
      class={`block text-sm font-medium text-gray-700 mb-1 ${props.class || ""}`}
    >
      {props.text}
    </label>
  );
}
