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
}

export default function PenelitianApprovalData() {

    const dataForm: FormPenelitian = {
        id: "",
        jenis: "",
        statusNow: 0,
        status: 0,
        alasan: ""
    }

    const [data, setData] = createSignal<Penelitian[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [open, setOpen] = createSignal(false)
    const [openDetail, setOpenDetail] = createSignal(false)
    const [loadingSave, setLoadingSave] = createSignal(false)
    const [form, setForm] = createSignal(dataForm)

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
            // files={[
            //     {
            //         label: "Draf Penelitian",
            //         icon: "download",
            //         class: "bg-red-500 text-white hover:bg-red-600",
            //         onClick: (row) => {
            //             route.download(row.file_draft_penelitian ?? "")
            //         }
            //     },
            //     {
            //         label: "Surat Permohonan Instansi",
            //         icon: "download",
            //         class: "bg-red-500 text-white hover:bg-red-600",
            //         onClick: (row) => {
            //             route.download(row.file_permohonan_instansi ?? "")
            //         }
            //     },
            // ]}

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
                    <FormLabel for="status" text="Status" />
                    <Select options={[
                        { label: "Pilih Status", value: "0" },
                        { label: "Tolak", value: form().statusNow == StatusPenelitian.Submit ? StatusPenelitian.TolakPenelitian.toString() : StatusPenelitian.TolakPenelitianEtik.toString() },
                        { label: "Terima", value: form().statusNow == StatusPenelitian.Submit ? StatusPenelitian.TerimaPenelitian.toString() : StatusPenelitian.TerimaPenelitianEtik.toString() }
                    ]}
                        onInput={(e) => setForm({ ...form(), status: parseInt(e.currentTarget.value), alasan: (parseInt(e.currentTarget.value) == StatusPenelitian.TerimaPenelitian || parseInt(e.currentTarget.value) == StatusPenelitian.TerimaPenelitianEtik) ? "Terima kasih, data sudah kami verifikasi. Silahkan lanjut icon \"Input Berkas Penelitian\"" : "Mohon maaf, kami masih butuh informasi tambahan, Silahkan hubungikami di 088219942081" })} />
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

                {/* <Show when={form().status == StatusPenelitian.TerimaPenelitian}>
                    <div>
                        <FormLabel for="jenis" text="Jenis" />
                        <Select options={[
                            { label: "Pilih Jenis", value: "" },
                            { label: "[SPONSOR] Penelitian Observasional (Prospektif)", value: "SPONSOR_OBSERVASIONAL" },
                            { label: "[SPONSOR] Uji Klinis", value: "SPONSOR_UJI_KLINIS" },
                            { label: "[NON SPONSOR] Penelitian Observasional (Prospektif)", value: "NON_SPONSOR_OBSERVASIONAL_PROSPEKTIF" },
                            { label: "[NON SPONSOR] Penelitian Observasional (Retrospektif)", value: "NON_SPONSOR_OBSERVASIONAL_RETROSPEKTIF" },
                            { label: "[NON SPONSOR] Uji Klinis - Farmakoterapi", value: "NON_SPONSOR_UJI_KLINIS_FARMAKOTERAPI" },
                            { label: "[NON SPONSOR] Uji Klinis - Non Farmakoterapi", value: "NON_SPONSOR_UJI_KLINIS_NON_FARMAKOTERAPI" },
                        ]}
                            onInput={(e) => setForm({ ...form(), jenis: (e.currentTarget.value) })} />

                    </div>
                </Show> */}

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