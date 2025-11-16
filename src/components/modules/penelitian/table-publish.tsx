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
    status: number
    nomor: string
    alasan: string
    file_etik: string | File
}

export default function PenelitianPublishData() {

    const dataForm: FormPenelitian = {
        id: "",
        nomor: "",
        status: 0,
        alasan: "",
        file_etik: ""
    }

    const [data, setData] = createSignal<Penelitian[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [open, setOpen] = createSignal(false)
    const [openDetail, setOpenDetail] = createSignal(false)
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

        // if (form().nomor == "") {
        //     showAlert({
        //         title: "Peringatan",
        //         message: "Masukkan Nomor"
        //     })
        //     return false
        // }


        return true
    }

    const handleSave = async () => {

        const check = valid()
        if (!check) return

        const formData = new FormData();

        // Add text fields
        formData.append('alasan', form().alasan);
        formData.append('id', form().id);
        formData.append('nomor', form().nomor);
        formData.append('status', form().status.toString());
        formData.append('file_etik', form().file_etik);

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
        const result = await PenelitianService.approvalEtikPenelitian(formData);
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
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_draft_penelitian ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_draft_penelitian == "" || row.file_draft_penelitian == null
            //         }
            //     },
            //     {
            //         label: "Surat Permohonan Instansi",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_permohonan_instansi ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_permohonan_instansi == "" || row.file_permohonan_instansi == null
            //         }
            //     },
            //     {
            //         label: "Surat Izin Penelitian",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_surat_izin_penelitian ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_surat_izin_penelitian == "" || row.file_surat_izin_penelitian == null
            //         }
            //     },
            //     {
            //         label: "Formulir Telaah Penelitian",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_formulir_telaah_penelitian ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_formulir_telaah_penelitian == "" || row.file_formulir_telaah_penelitian == null
            //         }
            //     },
            //     {
            //         label: "Formulir Ketersediaan Penelitian",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_formulir_ketersediaan_penelitian ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_formulir_ketersediaan_penelitian == "" || row.file_formulir_ketersediaan_penelitian == null
            //         }
            //     },
            //     {
            //         label: "Informasi Calon Subjek",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_informasi_calon_subjek ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_informasi_calon_subjek == "" || row.file_informasi_calon_subjek == null
            //         }
            //     },
            //     {
            //         label: "Pernyataan Konflik",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_pernyataan_konflik ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_pernyataan_konflik == "" || row.file_pernyataan_konflik == null
            //         }
            //     },
            //     {
            //         label: "Proposal Penelitian",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_proposal_penelitian ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_proposal_penelitian == "" || row.file_proposal_penelitian == null
            //         }
            //     },
            //     {
            //         label: "Kaji Etik",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_surat_kaji_etik ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_surat_kaji_etik == "" || row.file_surat_kaji_etik == null
            //         }
            //     },
            //     {
            //         label: "CV Peneliti",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_cv_peneliti ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_cv_peneliti == "" || row.file_cv_peneliti == null
            //         }
            //     },
            //     {
            //         label: "CV Tim Peneliti",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_cv_tim_peneliti ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_cv_tim_peneliti == "" || row.file_cv_tim_peneliti == null
            //         }
            //     },
            //     {
            //         label: "Persetujuan",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_persetujuan ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_persetujuan == "" || row.file_persetujuan == null
            //         }
            //     },
            //     {
            //         label: "Kuesioner",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_kuesioner ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_kuesioner == "" || row.file_kuesioner == null
            //         }
            //     },
            //     {
            //         label: "Daftar Pustaka",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_daftar_pustaka ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_daftar_pustaka == "" || row.file_daftar_pustaka == null
            //         }
            //     },
            //     {
            //         label: "Bukti Transfer",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_bukti_transfer ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_bukti_transfer == "" || row.file_bukti_transfer == null
            //         }
            //     },
            //     {
            //         label: "File Etik",
            //         icon: "download",
            //         class: "bg-orange-500 text-white hover:bg-orange-600",
            //         onClick: (row) => {
            //             route.download(row.file_etik ?? "")
            //         },
            //         hidden: (row) => {
            //             return row.file_etik == "" || row.file_etik == null
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
                <Show when={form().status == StatusPenelitian.PublishPenelitian}>

                    <div>
                        <FormLabel for="nomor" text="Nomor" />
                        <Input
                            id="nomor"
                            value={form()?.nomor}
                            onInput={(e) => setForm({ ...form(), nomor: e.currentTarget.value })}
                        />
                    </div>


                    <div>
                        <FormLabel for="file_etik" text="File Etik" />
                        <Input
                            id="file_etik"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_etik: e.currentTarget.files?.[0] as File })}
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