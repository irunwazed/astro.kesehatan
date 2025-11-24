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
  const [query, setQuery] = createSignal(""); // state untuk query pencarian
  const [options, setOptions] = createSignal<Option[]>([]); // state untuk data opsi
  const [selected, setSelected] = createSignal<Option[]>([]); // state untuk opsi yang dipilih
  const [loading, setLoading] = createSignal(false); // state untuk status loading
  const [open, setOpen] = createSignal(false); // state untuk status dropdown terbuka
  const minLen = props.minLength ?? 1; // panjang minimal query

  // Load data setiap query berubah
  createEffect(() => {
    const q = query().trim();
    if (q.length < minLen) {
      setOptions([]);
      return;
    }

    setLoading(true);
    let active = true;

    // Ambil data berdasarkan query
    props
      .getData(q)
      .then((data) => {
        if (active) {
          // filter yang sudah dipilih agar tidak muncul lagi
          const selectedValues = new Set(selected().map((s) => s.value));
          setOptions(data.filter((o) => !selectedValues.has(o.value))); // pastikan yang sudah dipilih disaring
        }
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  });

  // Fungsi untuk menambah opsi ke yang terpilih
  const addOption = (opt: Option) => {
    const newSelected = [...selected(), opt];
    setSelected(newSelected); // set opsi terpilih
    props.onChange?.(newSelected); // panggil onChange jika ada
    setQuery(""); // reset query setelah memilih
    setOpen(false); // tutup dropdown setelah memilih
  };

  // Fungsi untuk menghapus opsi dari yang terpilih
  const removeOption = (opt: Option) => {
    const newSelected = selected().filter((s) => s.value !== opt.value);
    setSelected(newSelected); // set opsi yang terpilih
    props.onChange?.(newSelected); // panggil onChange jika ada
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
          setQuery(e.currentTarget.value); // update query saat input berubah
          setOpen(true); // buka dropdown saat input
        }}
        onFocus={() => setOpen(true)} // buka dropdown saat fokus
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* DROPDOWN */}
      <Show when={open()}>
        <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
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
                onClick={() => addOption(opt)} // pilih opsi saat diklik
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
