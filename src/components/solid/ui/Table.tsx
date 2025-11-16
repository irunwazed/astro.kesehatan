import { createSignal, For, type JSX, Show } from "solid-js";
import Icon from "./Icon";

type Column<T> = {
    key: keyof T | string;
    header: string;
    width?: string; // ✅ misal: "150px" | "20%" | "10rem"
    render?: (row: T) => JSX.Element;
};

interface Action<T> {
    label: string;
    icon?: "delete" | "update" | "create" | "search" | "approval";
    class?: string;
    onClick: (row: T) => void;
    hidden?: (row: T) => boolean;
    disabled?: (row: T) => boolean;
}

interface Files<T> {
    label: string;
    icon?: "download";
    class?: string;
    onClick: (row: T) => void;
    hidden?: (row: T) => boolean;
    disabled?: (row: T) => boolean;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyText?: string;
    actions?: Action<T>[];
    actionWidth?: string; // ✅ atur lebar kolom aksi
    files?: Files<T>[];
    fileWidth?: string; // ✅ atur lebar kolom file
}

export function Table<T>(props: TableProps<T>) {
    // console.log("props.files?.length", props.files?.length)
    return (
        <div class="relative w-full overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full border-collapse bg-white text-left text-sm text-gray-700">
                {/* ✅ Header */}
                <thead class="bg-gray-100 text-gray-900">
                    <tr>
                        <For each={props.columns}>
                            {(col) => (
                                <th
                                    class="px-4 py-3 border-b font-medium"
                                    style={col.width ? { width: col.width } : {}}
                                >
                                    {col.header}
                                </th>
                            )}
                        </For>
                        <Show when={props.files?.length}>
                            <th
                                class="px-4 py-3 border-b font-medium text-center"
                                style={props.actionWidth ? { width: props.actionWidth } : {}}
                            >
                                File
                            </th>
                        </Show>
                        <Show when={props.actions?.length}>
                            <th
                                class="px-4 py-3 border-b font-medium text-center"
                                style={props.actionWidth ? { width: props.actionWidth } : {}}
                            >
                                Aksi
                            </th>
                        </Show>
                    </tr>
                </thead>

                <tbody class="relative">
                    {/* ✅ Overlay Loading */}
                    <Show when={props.loading}>
                        <tr>
                            <td
                                colSpan={
                                    props.columns.length + (props.actions?.length ? 1 : 0)
                                }
                                class="p-0"
                            >
                                <div class="py-2 inset-0 flex gap-4 items-center justify-center bg-white/70 backdrop-blur-sm">
                                    <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-2" />
                                    <span class="text-gray-600 text-sm">Memuat data...</span>
                                </div>
                            </td>
                        </tr>
                    </Show>

                    {/* ✅ Data */}
                    <Show
                        when={!props.loading && props.data.length > 0}
                        fallback={
                            <Show when={!props.loading}>
                                <tr>
                                    <td
                                        class="px-4 py-4 text-center text-gray-500"
                                        colSpan={
                                            props.columns.length + (props.actions?.length ? 1 : 0)
                                        }
                                    >
                                        {props.emptyText ?? "Tidak ada data"}
                                    </td>
                                </tr>
                            </Show>
                        }
                    >
                        <For each={props.data}>
                            {(row, idx) => (
                                <tr class="border-b hover:bg-gray-50">
                                    <For each={props.columns}>
                                        {(col) => (
                                            <td
                                                class="px-4 py-3"
                                                style={col.width ? { width: col.width } : {}}
                                            >
                                                {col.render ? col.render(row) : col.key == "no_idx" ? idx() + 1 : (row as any)[col.key]}
                                            </td>
                                        )}
                                    </For>

                                    <Show when={props.files?.length}>
                                        <td
                                            class="px-4 py-3 text-center"
                                            style={props.fileWidth ? { width: props.fileWidth } : {}}
                                        >
                                            <div class="flex flex-col items-center justify-center gap-2">
                                                <For each={props.files}>
                                                    {(file) => (
                                                        <Show when={file.hidden ? !file.hidden(row) : true}>
                                                            <button
                                                                class={`flex items-center gap-1 px-2 py-1 text-xs rounded
                                                                    ${file.class ?? "bg-blue-500 text-white hover:bg-blue-600"}
                                                                    ${file.disabled?.(row) ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                disabled={file.disabled?.(row)}
                                                                onClick={() =>
                                                                    !file.disabled?.(row) &&
                                                                    file.onClick(row)
                                                                }
                                                            >
                                                                <Show when={file.icon == "download"}>
                                                                    <Icon name="download" size={18} class={file.class} />
                                                                </Show>
                                                                {file.label}
                                                            </button>
                                                        </Show>
                                                    )}
                                                </For>
                                            </div>
                                        </td>
                                    </Show>

                                    <Show when={props.actions?.length}>
                                        <td
                                            class="px-4 py-3 text-center"
                                            style={props.actionWidth ? { width: props.actionWidth } : {}}
                                        >
                                            <div class="flex items-center justify-center gap-2">
                                                <For each={props.actions}>
                                                    {(action) => (
                                                        <Show when={action.hidden ? !action.hidden(row) : true}>
                                                            <button
                                                                class={`flex items-center gap-1 px-2 py-1 text-xs rounded
                                                                    ${action.class ?? "bg-blue-500 text-white hover:bg-blue-600"}
                                                                    ${action.disabled?.(row) ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                disabled={action.disabled?.(row)}
                                                                onClick={() =>
                                                                    !action.disabled?.(row) &&
                                                                    action.onClick(row)
                                                                }
                                                            >
                                                                <Show when={action.icon == "create"}>
                                                                    <Icon name="plus" size={18} class={action.class} />
                                                                </Show>
                                                                <Show when={action.icon == "update"}>
                                                                    <Icon name="pencil" size={18} class={action.class} />
                                                                </Show>
                                                                <Show when={action.icon == "delete"}>
                                                                    <Icon name="trash" size={18} class={action.class} />
                                                                </Show>
                                                                <Show when={action.icon == "search"}>
                                                                    <Icon name="search" size={18} class={action.class} />
                                                                </Show>
                                                                <Show when={action.icon == "approval"}>
                                                                    <Icon name="approval" size={18} class={action.class} />
                                                                </Show>
                                                                {action.label}
                                                            </button>
                                                        </Show>
                                                    )}
                                                </For>
                                            </div>
                                        </td>
                                    </Show>
                                </tr>
                            )}
                        </For>
                    </Show>
                </tbody>
            </table>
        </div>
    );
}
