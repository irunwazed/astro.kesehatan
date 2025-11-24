import { showAlert } from "@solid-ui/alertStore";
import Button from "@solid-ui/Button";
import FormLabel from "@solid-ui/FormLabel";
import Input from "@solid-ui/Input";
import Modal from "@solid-ui/Modal";
import Select from "@solid-ui/Select";
import { Table } from "@solid-ui/Table";
import Textarea from "@solid-ui/Textarea";
import { createSignal, onMount, Show } from "solid-js";
import { PenelitianService } from "src/client/service/penelitian"
import { getStatusPenelitianData, getStatusPenelitianNama, StatusPenelitian, type Penelitian } from "src/helpers/dto/penelitian";
import { route } from "src/helpers/lib/route";
import PenelitianDetail from "./detail";
import MultiSelectSearch from "@solid-ui/MultiSelectSearch";

type FormTelaah = {
    id: string,
    telaah: string,
    note: string,
}

export default function PenelitianTelaah() {

    const dataForm: FormTelaah = {
        id: "",
        telaah: "",
        note: "",
    }

    const [data, setData] = createSignal<Penelitian[]>([]);
    const [dataEtik, setDataEtik] = createSignal<{ label: string, value: string }[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [open, setOpen] = createSignal(false)
    const [openDetail, setOpenDetail] = createSignal(false)
    const [loadingSave, setLoadingSave] = createSignal(false)
    const [form, setForm] = createSignal(dataForm)


    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianTelaah()

        const result = data.data?.map((dt) => {
            dt.status_nama = getStatusPenelitianNama(dt.status as number)
            return dt
        }) ?? []

        setData(result)

        setLoading(false);
    }

    onMount(async () => {
        getData()
    })


    const setApproval = async () => {
        setOpen(true)
    }

    const valid = () => {

        if (form().id == "") {
            showAlert({
                title: "Peringatan",
                message: "Pilih Penelitian"
            })
            return false
        }


        return true
    }

    const handleSave = async () => {

        const check = valid()
        if (!check) return

        const formData = new FormData();

        // Add text fields
        formData.append('note', form().note);
        formData.append('id', form().id);
        formData.append('telaah', form().telaah);

        const maxFileSize = 5 * 1024 * 1024; // 5MB
        formData.forEach((value, key) => {
            if (value instanceof File && value.size > maxFileSize) {
                showAlert({
                    title: "Validasi Error",
                    message: "File terlalu besar, maximal 5 mb",
                    icon: "error"
                });
                return;
                // throw new Error(`File ${key} melebihi batas ukuran maksimal (5MB)`);
            }
        });


        setLoadingSave(true)
        const result = await PenelitianService.approvalTelaahPenelitian(formData);
        getData()
        setOpen(false)
        setLoadingSave(false)
    }

    const handleSelectedUsersChange = (selected: { label: string, value: string }[]) => {
        setDataEtik(selected)
    };

    return <div class="p-4">
        <Table
            columns={[
                { key: "no_idx", header: "No", width: "10px" },
                {
                    key: "status_nama", header: "Status", render: (row) => {
                        return <div>
                            Proses Kaji Etik
                        </div>
                    },
                    width: "200px",
                },
                { key: "nama", header: "Judul" },
                { key: "deskripsi", header: "deskripsi" },
                { key: "tujuan", header: "tujuan" },
            ]}
            data={data()}
            loading={loading()}

            actions={[
                {
                    label: "Lihat",
                    icon: "search",
                    class: "bg-blue-500 text-white hover:bg-blue-600",
                    onClick: (row) => {
                        setForm({ ...form(), id: row.id })
                        setOpenDetail(true)
                    },
                },
                {
                    label: "Approval",
                    icon: "approval",
                    class: "bg-green-500 text-white hover:bg-green-600",
                    onClick: (row) => {
                        setForm({ ...form(), id: row.id })
                        setApproval()
                    },
                    // disabled: (row) => row.status != "DRAFT"
                    // hidden: (row) => row.id === "f130fdfb-1e12-49b5-9fa2-a3058185bf35",     // ❌ user id=2 tombol delete disembunyikan
                },
            ]}
        />

        <Modal
            open={open()}
            loading={loadingSave()}
            title="Tambah Data"
            onClose={() => !loadingSave() && setOpen(false)}
        >

            <div class="flex flex-col gap-4 mt-4">
                <div>
                    <FormLabel for="telaah" text="Telaah" />
                    <Select options={[
                        { label: "Pilih Telaah", value: "" },
                        { label: "Disetujui", value: "Disetujui" },
                        { label: "Disetujui dengan sedikit perubahan tanpa perubahan subtansi", value: "Disetujui dengan sedikit perubahan tanpa perubahan subtansi" },
                        { label: "Disetujui dengan perubahan instansi", value: "Disetujui dengan perubahan instansi" },
                        { label: "Ditunda untuk beberapa alasan", value: "Ditunda untuk beberapa alasan" },
                        { label: "Tidak dapat disetujui dengan alasan (lihat lembaran pertimbangan atau saran atau petunjuk", value: "Tidak dapat disetujui dengan alasan (lihat lembaran pertimbangan atau saran atau petunjuk" },
                    ]}
                        onInput={(e) => setForm({ ...form(), telaah: e.currentTarget.value})} />

                </div>

                <Show when={form().telaah != ""}>
                    <div>
                        <FormLabel for="alasan" text="Alasan" />
                        <Textarea
                            id="alasan"
                            value={form()?.note}
                            onInput={(e) => setForm({ ...form(), note: e.currentTarget.value })}
                        />
                    </div>
                </Show>

                <hr class="my-2 border-gray-200" />
                <div class="flex justify-end gap-2">
                    <button
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setOpen(false)}
                        disabled={loadingSave()}
                    >
                        Batal
                    </button>
                    <button
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleSave}
                        disabled={loadingSave()}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </Modal>


        <Modal
            open={openDetail()}
            loading={false}
            title="Detail"
            onClose={() => setOpenDetail(false)}
        >
            <div class="max-h-[500px] overflow-y-auto ">
                <PenelitianDetail id={form().id} />
            </div>
        </Modal>

    </div>;
}