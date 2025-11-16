import { createSignal, onMount, Show } from "solid-js";
import { PenelitianService } from "src/client/service/penelitian";
import { getStatusPendanaanNama, getStatusPenelitianData, type PenelitianDetail } from "src/helpers/dto/penelitian";
import { route } from "src/helpers/lib/route";
import { convertTimeDB, getTimeFromTimestamp } from "src/helpers/lib/time";



export default function PenelitianDetail({ id }: { id: string }) {


    const [data, setData] = createSignal<PenelitianDetail | null>();
    const [loading, setLoading] = createSignal(false);

    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianById(id)
        if (typeof data?.data?.penelitian! !== "undefined") {
            setData(data.data)
        }

        setLoading(false);
    }


    onMount(async () => {
        getData()
    })

    if (loading()) return <>Loading</>

    return (
        <div>
            <Show when={loading()}>
                Loading
            </Show>

            <Show when={!loading()}>
                <div class=" mx-auto p-6 bg-white rounded-lg shadow-md">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Nama Peneliti</label>
                            <p class="mt-1 text-gray-800">{(data()?.user.nama)}</p>
                        </div>
                        {/* <div>
                    <label class="block text-sm font-medium text-gray-600">Email</label>
                    <p class="mt-1 text-gray-800">{data()?.user.email}</p>
                </div> */}
                    </div>

                    <hr class="my-6" />
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-600">ID Penelitian</label>
                            <p class="mt-1 text-gray-800">{data()?.penelitian.id}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Tanggal Dibuat</label>
                            <p class="mt-1 text-gray-800">{convertTimeDB(data()?.penelitian.created_at ?? "")}</p>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Status</label>
                        <p class="mt-1 text-gray-800">{getStatusPenelitianData(data()?.penelitian.status ?? 0).name}</p>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Judul Penelitian</label>
                        <p class="mt-1 text-gray-800">{data()?.penelitian.nama}</p>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Tujuan Penelitian</label>
                        <p class="mt-1 text-gray-800">{data()?.penelitian.tujuan}</p>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Deskripsi</label>
                        <p class="mt-1 text-gray-800">{data()?.penelitian.deskripsi}</p>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Variabel Lain</label>
                        <p class="mt-1 text-gray-800">{data()?.penelitian.variabel_lain}</p>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Jumlah Minimal Sampel</label>
                        <p class="mt-1 text-gray-800">{data()?.penelitian.jumlah_minimal_sampel}</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Waktu Awal Sample</label>
                            <p class="mt-1 text-gray-800">{data()?.penelitian.waktu_awal_sample}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Waktu Akhir Sample</label>
                            <p class="mt-1 text-gray-800">{data()?.penelitian.waktu_akhir_sample}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Pendanaan</label>
                            <p class="mt-1 text-gray-800">{data()?.penelitian.pendanaan == "1"? "Mandiri":"Sponsor"}</p>
                        </div>
                        <Show when={data()?.penelitian.pendanaan == "2"}>
                            <div>
                                <label class="block text-sm font-medium text-gray-600">Sponsor</label>
                                <p class="mt-1 text-gray-800">{data()?.penelitian.sponsor}</p>
                            </div>
                        </Show>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Biaya Penelitian</label>
                        <p class="mt-1 text-gray-800">{data()?.penelitian.biaya_penelitian}</p>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Check Mahasiswa</label>
                        <p class="mt-1 text-gray-800">{data()?.penelitian.check_mahasiswa}</p>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Mahasiswa Proposal</label>
                        <p class="mt-1 text-gray-800">{data()?.penelitian.mahasiswa_proposal}</p>
                    </div>

                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600">Jenis</label>
                        <p class="mt-1 text-gray-800">{getStatusPendanaanNama(data()?.penelitian.jenis ?? "")}</p>
                    </div>
                    <div class="space-y-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[500px] overflow-auto">
                        {/* File Permohonan Instansi */}
                        <Show when={data()?.penelitian.file_permohonan_instansi}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Permohonan Instansi</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_permohonan_instansi ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Draft Penelitian */}
                        <Show when={data()?.penelitian.file_draft_penelitian}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Draft Penelitian</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_draft_penelitian ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Surat Izin Penelitian */}
                        <Show when={data()?.penelitian.file_surat_izin_penelitian}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Surat Izin Penelitian</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_surat_izin_penelitian ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Formulir Telaah Penelitian */}
                        <Show when={data()?.penelitian.file_formulir_telaah_penelitian}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Formulir Telaah Penelitian</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_formulir_telaah_penelitian ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Formulir Ketersediaan Penelitian */}
                        <Show when={data()?.penelitian.file_formulir_ketersediaan_penelitian}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Formulir Ketersediaan Penelitian</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_formulir_ketersediaan_penelitian ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Informasi Calon Subjek */}
                        <Show when={data()?.penelitian.file_informasi_calon_subjek}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Informasi Calon Subjek</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_informasi_calon_subjek ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Pernyataan Konflik */}
                        <Show when={data()?.penelitian.file_pernyataan_konflik}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Pernyataan Konflik</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_pernyataan_konflik ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Proposal Penelitian */}
                        <Show when={data()?.penelitian.file_proposal_penelitian}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Proposal Penelitian</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_proposal_penelitian ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Surat Kaji Etik */}
                        <Show when={data()?.penelitian.file_surat_kaji_etik}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Surat Kaji Etik</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_surat_kaji_etik ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File CV Peneliti */}
                        <Show when={data()?.penelitian.file_cv_peneliti}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File CV Peneliti</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_cv_peneliti ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File CV Tim Peneliti */}
                        <Show when={data()?.penelitian.file_cv_tim_peneliti}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File CV Tim Peneliti</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_cv_tim_peneliti ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Persetujuan */}
                        <Show when={data()?.penelitian.file_persetujuan}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Persetujuan</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_persetujuan ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Kuesioner */}
                        <Show when={data()?.penelitian.file_kuesioner}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Kuesioner</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_kuesioner ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Daftar Pustaka */}
                        <Show when={data()?.penelitian.file_daftar_pustaka}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Daftar Pustaka</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_daftar_pustaka ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Bukti Transfer */}
                        <Show when={data()?.penelitian.file_bukti_transfer}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Bukti Transfer</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_bukti_transfer ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>

                        {/* File Etik */}
                        <Show when={data()?.penelitian.file_etik}>
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-600">File Etik</label>
                                <p
                                    class="mt-1 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => route.download(data()?.penelitian.file_etik ?? "")}
                                >
                                    Download
                                </p>
                            </div>
                        </Show>
                    </div>

                </div>
            </Show>

        </div>
    )
}