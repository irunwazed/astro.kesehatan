import { showAlert } from "@solid-ui/alertStore";
import Button from "@solid-ui/Button";
import Modal from "@solid-ui/Modal";
import { Table } from "@solid-ui/Table";
import { createSignal, onMount, Show } from "solid-js";
import { PenelitianService } from "src/client/service/penelitian"
import { getStatusCalonPenelitianNama, getStatusPenelitianData, getStatusPenelitianNama, StatusPenelitian, type Penelitian } from "src/helpers/dto/penelitian";
import { route } from "src/helpers/lib/route";
import PenelitianDetail from "./detail";
import FormLabel from "@solid-ui/FormLabel";
import Input from "@solid-ui/Input";


export default function PenelitianData() {

    const dataForm: { id: string, file_amandemen: string | File } = {
        id: "",
        file_amandemen: "",
    }
    const [data, setData] = createSignal<Penelitian[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [openDetail, setOpenDetail] = createSignal(false)
    const [select, setSelect] = createSignal("")
    const [open, setOpen] = createSignal(false)
    const [loadingSave, setLoadingSave] = createSignal(false)
    const [form, setForm] = createSignal(dataForm)

    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianUser()

        const result = data.data?.map((dt) => {
            // dt.status_nama = getStatusPenelitianNama(dt.status as number)
            return dt
        }) ?? []

        setData(result)

        setLoading(false);
    }


    onMount(async () => {
        getData()
    })


    const handleSave = async () => {
        const formData = new FormData();

        // Add text fields
        formData.append('id', form().id);
        formData.append('file_amandemen', form().file_amandemen);


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
        const result = await PenelitianService.uploadAmandemen(formData);
        getData()
        setOpen(false)
        setLoadingSave(false)
    }

    return <div class="p-4">

        <div class="flex justify-between mb-6">
            <Button variant="info" onclick={() => {
                route.push("/app/penelitian/awal")
            }}>Pengajuan Studi Awal</Button>
        </div>
        <Table
            columns={[
                { key: "no_idx", header: "No", width: "10px" },
                {
                    key: "status_nama", header: "Status", render: (row) => {
                        return <div>
                            <div class={getStatusPenelitianData(row.status).class}>{getStatusCalonPenelitianNama(row.status)}</div>
                            <Show when={row.alasan}>
                                <span class="align-middle">({row.telaah ?? row.alasan})</span>
                            </Show>
                        </div>
                    },
                    width: "200px",
                },
                { key: "nama", header: "Judul Penelitian" },
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
                        // setForm({ ...form(), id: row.id })
                        setSelect(row.id)
                        setOpenDetail(true)
                    },
                },
                {
                    label: "Perbaikan Studi Awal",
                    icon: "update",
                    class: "bg-blue-500 text-white hover:bg-blue-600",
                    onClick: (row) => {
                        route.push("/app/penelitian/awal?id=" + row.id)
                    },
                    hidden: (row) => !(row.status == StatusPenelitian.TolakPenelitian || row.status == StatusPenelitian.Submit),
                    // disabled: (row) => (row.status != StatusPenelitian.TerimaPenelitian),    
                },
                {
                    label: "Input Berkas Penelitian",
                    icon: "update",
                    class: "bg-blue-500 text-white hover:bg-blue-600",
                    onClick: (row) => {
                        route.push("/app/penelitian/form1?id=" + row.id)
                    },
                    hidden: (row) => !(row.status == StatusPenelitian.TerimaPenelitian || row.status == StatusPenelitian.TolakPenelitianEtik),
                    // disabled: (row) => (row.status != StatusPenelitian.TerimaPenelitian),    
                },
                {
                    label: "Perpanjang Etik Penelitian",
                    icon: "update",
                    class: "bg-red-500 text-white hover:bg-red-600",
                    onClick: (row) => {
                        route.push("/app/penelitian/perpanjang?id=" + row.id)
                    },
                    hidden: (row) => row.status != StatusPenelitian.Diizinkan,
                    // disabled: (row) => row.status != StatusPenelitian.PublishPenelitian,     // ❌ user id=2 tombol delete disembunyikan
                },
                {
                    label: "Ajukan Amandemen",
                    icon: "update",
                    class: "bg-red-500 text-white hover:bg-red-600",
                    onClick: (row) => {
                        setForm({ ...form(), id: row.id })
                        setOpen(true)
                    },
                    hidden: (row) => row.status != StatusPenelitian.SiapAmandemen,
                    // disabled: (row) => row.status != StatusPenelitian.PublishPenelitian,     // ❌ user id=2 tombol delete disembunyikan
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
                <a class="bg-blue-300 rounded-lg text-blue-800 py-2 px-4" target="_blank" href="https://docs.google.com/document/d/1uSnqntGrRAWrnvEomjp0WYQebh02XC_J/edit?usp=sharing&ouid=113163073729505832768&rtpof=true&sd=true">Download Template</a>
            </div>

            <div>
                <FormLabel for="file_amandemen" text="File Amandemen" required={true} />
                <Input
                    id="file_amandemen"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setForm({ ...form(), file_amandemen: e.currentTarget.files?.[0] as File })}
                />
            </div>

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
                <PenelitianDetail id={select()} />
            </div>
        </Modal>
    </div>;
}