// src/components/ClientOnly.tsx
import { createSignal, onMount, type JSX, type ParentProps } from "solid-js";

/**
 * Hanya merender children setelah komponen di-mount di client
 */
export default function ClientOnly(props: ParentProps): JSX.Element {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));
  return mounted() ? <>{props.children}</> : null;
}
