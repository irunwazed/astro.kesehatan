import type { JSX } from "solid-js";
import { FaBrandsSearchengin, FaRegularTrashCan, FaSolidPen, FaSolidDownload, FaSolidCheck } from 'solid-icons/fa'
 
type IconName = "user" | "home" | "settings" | "trash" | "pencil" | "plus" | "search" | "download" | "approval";

interface IconProps {
  name: IconName;
  size?: number;
  class?: string;
}

export default function Icon(props: IconProps): JSX.Element {
  const size = props.size ?? 24;
  const cls = props.class ?? "text-gray-800";

  const renderIcon = () => {
    switch (props.name) {
      case "user": return <FaRegularTrashCan size={size} class={cls} />;
      case "home": return <FaRegularTrashCan size={size} class={cls} />;
      case "settings": return <FaRegularTrashCan size={size} class={cls} />;
      case "trash": return <FaRegularTrashCan size={size} class={cls} />;
      case "pencil": return <FaSolidPen size={size} class={cls} />;
      case "plus": return <FaRegularTrashCan size={size} class={cls} />;
      case "search": return <FaBrandsSearchengin size={size} class={cls} />;
      case "download": return <FaSolidDownload size={size} class={cls} />;
      case "approval": return <FaSolidCheck size={size} class={cls} />;
      
      default: return null;
    }
  };

  return renderIcon() // <ClientOnly>{}</ClientOnly>;
}
