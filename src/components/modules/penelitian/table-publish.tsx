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

type FormPenelitian = {
    id: string,
    status: number
    nomor: string
    alasan: string
}

export default function PenelitianPublishData() {

    const dataForm: FormPenelitian = {
        id: "",
        nomor: "",
        status: 0,
        alasan: ""
    }

    const [data, setData] = createSignal<Penelitian[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [open, setOpen] = createSignal(false)
    const [loadingSave, setLoadingSave] = createSignal(false)
    const [form, setForm] = createSignal(dataForm)

    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianEtik()

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

        if (form().nomor == "") {
            showAlert({
                title: "Peringatan",
                message: "Masukkan Nomor"
            })
            return false
        }
        return true
    }

    const handleSave = async () => {

        const check = valid()
        if (!check) return


        setLoadingSave(true)
        const result = await PenelitianService.approvalEtikPenelitian(form().id, form().nomor, form().status, form().alasan);
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
                { key: "nama", header: "Nama" },
                { key: "deskripsi", header: "deskripsi" },
                { key: "tujuan", header: "tujuan" },
            ]}
            data={data()}
            loading={loading()}
            files={[
                {
                    label: "Draf Penelitian",
                    icon: "download",
                    class: "bg-red-500 text-white hover:bg-red-600",
                    onClick: (row) => {
                        route.download(row.file_draft_penelitian ?? "")
                    }
                },
                {
                    label: "Surat Permohonan Instansi",
                    icon: "download",
                    class: "bg-red-500 text-white hover:bg-red-600",
                    onClick: (row) => {
                        route.download(row.file_permohonan_instansi ?? "")
                    }
                },
            ]}

            actions={[
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
                // {
                //     label: "Tolak",
                //     icon: "delete",
                //     class: "bg-red-500 text-white hover:bg-red-600",
                //     onClick: (row) => {
                //         setApproval(row, StatusPenelitian.TolakPenelitianEtik)
                //     },
                //     // disabled: (row) => row.status != "DRAFT"
                //     // hidden: (row) => row.id === "f130fdfb-1e12-49b5-9fa2-a3058185bf35",     // ❌ user id=2 tombol delete disembunyikan
                // },
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
                    <FormLabel for="nomor" text="Nomor" />
                    <Input
                        id="nomor"
                        value={form()?.nomor}
                        onInput={(e) => setForm({ ...form(), nomor: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <FormLabel for="status" text="Status" />
                    <Select options={[
                        { label: "Pilih Status", value: "0" },
                        { label: "Tolak", value: StatusPenelitian.TolakPenelitianEtik.toString() },
                        { label: "Terima", value: StatusPenelitian.PublishPenelitian.toString() }
                    ]}
                        onInput={(e) => setForm({ ...form(), status: parseInt(e.currentTarget.value), alasan: parseInt(e.currentTarget.value) == StatusPenelitian.PublishPenelitian ? "" : "" })} />

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
    </div>;
}