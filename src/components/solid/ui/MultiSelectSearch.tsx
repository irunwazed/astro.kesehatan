import { createSignal, createEffect, For, Show } from "solid-js";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectSearchProps {
  placeholder?: string;
  getData: (query: string) => Promise<Option[]>; // function untuk ambil data
  onChange?: (selected: Option[]) => void;
  minLength?: number;
}

export default function MultiSelectSearch(props: MultiSelectSearchProps) {
  const [query, setQuery] = createSignal("");
  const [options, setOptions] = createSignal<Option[]>([]);
  const [selected, setSelected] = createSignal<Option[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [open, setOpen] = createSignal(false);
  const minLen = props.minLength ?? 1;

  // Load data setiap query berubah
  createEffect(() => {
    const q = query().trim();
    if (q.length < minLen) {
      setOptions([]);
      return;
    }
    setLoading(true);
    let active = true;
    props
      .getData(q)
      .then((data) => {
        if (active) {
          // filter yang sudah dipilih agar tidak muncul lagi
          const selectedValues = new Set(selected().map((s) => s.value));
          setOptions(data.filter((o) => !selectedValues.has(o.value)));
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  });

  const addOption = (opt: Option) => {
    const newSelected = [...selected(), opt];
    setSelected(newSelected);
    props.onChange?.(newSelected);
    setQuery("");
    setOpen(false);
  };

  const removeOption = (opt: Option) => {
    const newSelected = selected().filter((s) => s.value !== opt.value);
    setSelected(newSelected);
    props.onChange?.(newSelected);
  };

  return (
    <div class="relative w-full">
      {/* TAG LIST */}
      <div class="flex flex-wrap gap-2 mb-2">
        <For each={selected()}>
          {(opt) => (
            <div class="flex items-center bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
              <span>{opt.label}</span>
              <button
                type="button"
                class="ml-1 text-white hover:text-gray-200"
                onClick={() => removeOption(opt)}
              >
                ✕
              </button>
            </div>
          )}
        </For>
      </div>

      {/* INPUT SEARCH */}
      <input
        type="text"
        placeholder={props.placeholder || "Search..."}
        value={query()}
        onInput={(e) => {
          setQuery(e.currentTarget.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* DROPDOWN */}
      <Show when={open()}>
        <div
          class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md
                 shadow-lg max-h-60 overflow-auto"
        >
          <Show when={loading()}>
            <div class="px-3 py-2 text-gray-500 text-sm">Loading...</div>
          </Show>

          <Show when={!loading() && options().length === 0 && query().length >= minLen}>
            <div class="px-3 py-2 text-gray-500 text-sm">No results found</div>
          </Show>

          <For each={options()}>
            {(opt) => (
              <div
                class="px-3 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => addOption(opt)}
              >
                {opt.label}
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
