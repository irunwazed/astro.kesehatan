import type { JSX } from "solid-js";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | "primary" 
    | "secondary" 
    | "danger" 
    | "outline" 
    | "success" 
    | "warning" 
    | "info";
  size?: "sm" | "md" | "lg";
  class?: string;
}

export default function Button(props: ButtonProps): JSX.Element {
  // Base style
  let base = "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm flex items-center justify-center gap-1";

  // Variant style
  let variantClass = "";
  switch (props.variant) {
    case "secondary":
      variantClass = "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400";
      break;
    case "danger":
      variantClass = "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400";
      break;
    case "outline":
      variantClass = "bg-transparent border border-gray-500 text-gray-700 hover:bg-gray-100 focus:ring-gray-400";
      break;
    case "success":
      variantClass = "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400";
      break;
    case "warning":
      variantClass = "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400";
      break;
    case "info":
      variantClass = "bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-400";
      break;
    case "primary":
    default:
      variantClass = "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400";
      break;
  }

  // Size style
  let sizeClass = "";
  switch (props.size) {
    case "sm":
      sizeClass = "px-3 py-1 text-sm";
      break;
    case "lg":
      sizeClass = "px-6 py-3 text-lg";
      break;
    case "md":
    default:
      sizeClass = "px-4 py-2 text-md";
      break;
  }

  return (
    <button
      {...props}
      class={`${base} ${variantClass} ${sizeClass} ${props.class || ""} ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {props.children}
    </button>
  );
}
