import { createSignal, createEffect, For, Show } from "solid-js";

interface Option {
  value: string;
  label: string;
}

interface SelectSearchProps {
  placeholder?: string;
  getData: (query: string) => Promise<Option[]>; // ✅ fungsi untuk ambil data
  onSelect?: (option: Option) => void;
  minLength?: number;                            // default 2 karakter
}

export default function SelectSearch(props: SelectSearchProps) {
  const [query, setQuery] = createSignal("");
  const [options, setOptions] = createSignal<Option[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [open, setOpen] = createSignal(false);
  const minLen = props.minLength ?? 2;

  // Panggil function getData setiap query berubah
  createEffect(() => {
    const q = query().trim();
    if (q.length < minLen) {
      setOptions([]);
      return;
    }

    setLoading(true);
    let active = true; // untuk membatalkan hasil lama
    props
      .getData(q)
      .then((data) => {
        if (active) setOptions(data);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  });

  const handleSelect = (opt: Option) => {
    setQuery(opt.label);
    setOpen(false);
    props.onSelect?.(opt);
  };

  return (
    <div class="relative w-full">
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
                onClick={() => handleSelect(opt)}
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
