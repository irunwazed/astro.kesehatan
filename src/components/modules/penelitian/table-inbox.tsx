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

type FormPenelitian = {
    id: string,
    statusNow: number
    status: number
    jenis: string
    alasan: string
    file_surat_izin:string|File
}

export default function PenelitianApprovalData() {

    const dataForm: FormPenelitian = {
        id: "",
        jenis: "",
        statusNow: 0,
        status: 0,
        alasan: "",
        file_surat_izin:""
    }

    const [data, setData] = createSignal<Penelitian[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [open, setOpen] = createSignal(false)
    const [openDetail, setOpenDetail] = createSignal(false)
    const [loadingSave, setLoadingSave] = createSignal(false)
    const [form, setForm] = createSignal(dataForm)
    const [openIzin, setOpenIzin] = createSignal(false)

    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianApproval()

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


    const setApproval = async (row: Penelitian) => {
        setForm({ ...form(), id: row.id, statusNow: row.status })
        setOpen(true)
    }

    const valid = () => {

        if (form().status == 0) {
            showAlert({
                title: "Peringatan",
                message: "Pilih Status Approval"
            })
            return false
        }

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


        setLoadingSave(true)
        const result = await PenelitianService.approvalPenelitian(form().id, form().jenis, form().status, form().alasan);
        getData()
        setOpen(false)
        setLoadingSave(false)
    }

    const handleIzinSave = async () => {

        const formData = new FormData();

        // Add text fields
        formData.append('id', form().id);
        formData.append('file_surat_izin', form().file_surat_izin);


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
        const result = await PenelitianService.izinPenelitian(formData);
        getData()
        setOpenIzin(false)
        setLoadingSave(false)
    }

    return <div class="p-4">
        <Table
            columns={[
                { key: "no_idx", header: "No", width: "10px" },
                {
                    key: "status_nama", header: "Status", render: (row) => {
                        return <div>
                            <div class={getStatusPenelitianData(row.status).class}>{getStatusPenelitianData(row.status).name}</div>
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
                        setApproval(row)
                    },
                    hidden: (row) => !(row.status === StatusPenelitian.PenelitianUpload || row.status === StatusPenelitian.Submit)
                },
                {
                    label: "Ethical Approval",
                    icon: "approval",
                    class: "bg-green-500 text-white hover:bg-green-600",
                    onClick: async (row) => {
                        setLoading(true)
                        await PenelitianService.updateStatusPenelitian(row.id, StatusPenelitian.EthicalApproval)
                        setLoading(false)
                        getData()
                    },
                    hidden: (row) => row.status !== StatusPenelitian.SiapPublish
                },
                {
                    label: "Amandemen",
                    icon: "approval",
                    class: "bg-green-500 text-white hover:bg-green-600",
                    onClick: async (row) => {
                        setLoading(true)
                        await PenelitianService.updateStatusPenelitian(row.id, StatusPenelitian.SiapApprovalAmandemen)
                        setLoading(false)
                        getData()
                    },
                    hidden: (row) => row.status !== StatusPenelitian.UploadAmandemen
                },
                {
                    label: "Surat Izin",
                    icon: "approval",
                    class: "bg-green-500 text-white hover:bg-green-600",
                    onClick: (row) => {
                        
                        setForm({ ...form(), id: row.id })
                        setOpenIzin(true)
                    },
                    hidden: (row) => !(row.status === StatusPenelitian.EthicalApproval)
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
                    <FormLabel for="status" text="Status" />
                    <Select options={[
                        { label: "Pilih Status", value: "0" },
                        { label: "Tolak", value: form().statusNow == StatusPenelitian.Submit ? StatusPenelitian.TolakPenelitian.toString() : StatusPenelitian.TolakPenelitianEtik.toString() },
                        { label: "Terima", value: form().statusNow == StatusPenelitian.Submit ? StatusPenelitian.TerimaPenelitian.toString() : StatusPenelitian.TerimaPenelitianEtik.toString() }
                    ]}
                        onInput={(e) => setForm({ ...form(), status: parseInt(e.currentTarget.value), alasan: (parseInt(e.currentTarget.value) == StatusPenelitian.TerimaPenelitian) ? "Terima kasih, data sudah kami verifikasi. Silahkan lanjut icon \"Input Berkas Penelitian\"" : (StatusPenelitian.TerimaPenelitianEtik == parseInt(e.currentTarget.value) ?"":"Mohon maaf, kami masih butuh informasi tambahan, Silahkan hubungikami di 088219942081") })} />
                </div>

                <Show when={form().status > 0}>
                    <div>
                        <FormLabel for="alasan" text="Alasan" />
                        <Textarea
                            id="alasan"
                            value={form()?.alasan}
                            onInput={(e) => setForm({ ...form(), alasan: e.currentTarget.value })}
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
            open={openIzin()}
            loading={loadingSave()}
            title="Tambah Data"
            onClose={() => !loadingSave() && setOpenIzin(false)}
        >

            <div class="flex flex-col gap-4 mt-4">

                <div>
                    <FormLabel for="file_surat_izin" text="File Surat Izin" />
                    <Input
                        id="file_surat_izin"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setForm({ ...form(), file_surat_izin: e.currentTarget.files?.[0] as File })}
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
                        onClick={handleIzinSave}
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