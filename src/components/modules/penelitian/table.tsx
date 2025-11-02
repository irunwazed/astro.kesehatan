import { showAlert } from "@solid-ui/alertStore";
import Button from "@solid-ui/Button";
import { Table } from "@solid-ui/Table";
import { createSignal, onMount, Show } from "solid-js";
import { PenelitianService } from "src/client/service/penelitian"
import { getStatusPenelitianData, getStatusPenelitianNama, StatusPenelitian, type Penelitian } from "src/helpers/dto/penelitian";
import { route } from "src/helpers/lib/route";


export default function PenelitianData() {


    const [data, setData] = createSignal<Penelitian[]>([]);
    const [loading, setLoading] = createSignal(false);

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
                            <div class={getStatusPenelitianData(row.status).class}>{getStatusPenelitianData(row.status).name}</div>
                            <Show when={row.alasan}>
                                <span class="align-middle">({row.alasan})</span>
                            </Show>
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
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_draft_penelitian ?? "")
                    },
                    hidden: (row) => {
                        return row.file_draft_penelitian == "" || row.file_draft_penelitian == null
                    }
                },
                {
                    label: "Surat Permohonan Instansi",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_permohonan_instansi ?? "")
                    },
                    hidden: (row) => {
                        return row.file_permohonan_instansi == "" || row.file_permohonan_instansi == null
                    }
                },
                {
                    label: "Surat Izin Penelitian",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_surat_izin_penelitian ?? "")
                    },
                    hidden: (row) => {
                        return row.file_surat_izin_penelitian == "" || row.file_surat_izin_penelitian == null
                    }
                },
                {
                    label: "Formulir Telaah Penelitian",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_formulir_telaah_penelitian ?? "")
                    },
                    hidden: (row) => {
                        return row.file_formulir_telaah_penelitian == "" || row.file_formulir_telaah_penelitian == null
                    }
                },
                {
                    label: "Formulir Ketersediaan Penelitian",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_formulir_ketersediaan_penelitian ?? "")
                    },
                    hidden: (row) => {
                        return row.file_formulir_ketersediaan_penelitian == "" || row.file_formulir_ketersediaan_penelitian == null
                    }
                },
                {
                    label: "Informasi Calon Subjek",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_informasi_calon_subjek ?? "")
                    },
                    hidden: (row) => {
                        return row.file_informasi_calon_subjek == "" || row.file_informasi_calon_subjek == null
                    }
                },
                {
                    label: "Pernyataan Konflik",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_pernyataan_konflik ?? "")
                    },
                    hidden: (row) => {
                        return row.file_pernyataan_konflik == "" || row.file_pernyataan_konflik == null
                    }
                },
                {
                    label: "Proposal Penelitian",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_proposal_penelitian ?? "")
                    },
                    hidden: (row) => {
                        return row.file_proposal_penelitian == "" || row.file_proposal_penelitian == null
                    }
                },
                {
                    label: "Kaji Etik",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_surat_kaji_etik ?? "")
                    },
                    hidden: (row) => {
                        return row.file_surat_kaji_etik == "" || row.file_surat_kaji_etik == null
                    }
                },
                {
                    label: "CV Peneliti",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_cv_peneliti ?? "")
                    },
                    hidden: (row) => {
                        return row.file_cv_peneliti == "" || row.file_cv_peneliti == null
                    }
                },
                {
                    label: "CV Tim Peneliti",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_cv_tim_peneliti ?? "")
                    },
                    hidden: (row) => {
                        return row.file_cv_tim_peneliti == "" || row.file_cv_tim_peneliti == null
                    }
                },
                {
                    label: "Persetujuan",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_persetujuan ?? "")
                    },
                    hidden: (row) => {
                        return row.file_persetujuan == "" || row.file_persetujuan == null
                    }
                },
                {
                    label: "Kuesioner",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_kuesioner ?? "")
                    },
                    hidden: (row) => {
                        return row.file_kuesioner == "" || row.file_kuesioner == null
                    }
                },
                {
                    label: "Daftar Pustaka",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_daftar_pustaka ?? "")
                    },
                    hidden: (row) => {
                        return row.file_daftar_pustaka == "" || row.file_daftar_pustaka == null
                    }
                },
                {
                    label: "Bukti Transfer",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_bukti_transfer ?? "")
                    },
                    hidden: (row) => {
                        return row.file_bukti_transfer == "" || row.file_bukti_transfer == null
                    }
                },
                {
                    label: "File Etik",
                    icon: "download",
                    class: "bg-orange-500 text-white hover:bg-orange-600",
                    onClick: (row) => {
                        route.download(row.file_etik ?? "")
                    },
                    hidden: (row) => {
                        return row.file_etik == "" || row.file_etik == null
                    }
                },
            ]}
            actions={[
                {
                    label: "Input Berkas Penelitian",
                    icon: "delete",
                    class: "bg-blue-500 text-white hover:bg-blue-600",
                    onClick: (row) => {
                        route.push("/app/penelitian/form1?id=" + row.id)
                    },
                    hidden: (row) => row.status <= StatusPenelitian.Submit, 
                    disabled: (row) => (row.status != StatusPenelitian.TerimaPenelitian),    
                },
                {
                    label: "Perpanjang Penelitian",
                    icon: "update",
                    class: "bg-red-500 text-white hover:bg-red-600",
                    onClick: (row) => {
                        route.push("/app/penelitian/perpanjang?id=" + row.id)
                    },
                    hidden: (row) => row.status != StatusPenelitian.PublishPenelitian,
                    // disabled: (row) => row.status != StatusPenelitian.PublishPenelitian,     // ❌ user id=2 tombol delete disembunyikan
                },
            ]}
        />
    </div>;
}