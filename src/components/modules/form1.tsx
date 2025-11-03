import { createSignal, onMount, Show } from "solid-js";
import FormLabel from "@solid-ui/FormLabel";
import Input from "@solid-ui/Input";
import Button from "@solid-ui/Button";
import { showAlert } from "@solid-ui/alertStore";
import { StatusPenelitian, type FormPermohonanPenelitian, type GroupResponse, type Penelitian } from "src/helpers/dto/penelitian";
import { GroupService } from "src/client/service/group";
import { PenelitianService } from "src/client/service/penelitian";
import { route } from "src/helpers/lib/route";
import Select from "@solid-ui/Select";

export default function Form1Data() {

    const formDefault: FormPermohonanPenelitian = {
        id: "",
        nama: "",
        check_mahasiswa: "",
        file_surat_izin_penelitian: "",
        file_formulir_telaah_penelitian: "",
        file_formulir_ketersediaan_penelitian: "",
        file_informasi_calon_subjek: "",
        file_pernyataan_konflik: "",
        file_proposal_penelitian: "",
        file_surat_kaji_etik: "",
        file_cv_peneliti: "",
        file_cv_tim_peneliti: "",
        file_persetujuan: "",
        file_kuesioner: "",
        file_daftar_pustaka: "",
        file_bukti_transfer: "",
        biaya_penelitian: 0,
        izin_etik: "",
    }

    const [id, setId] = createSignal("");
    const [data, setData] = createSignal<Penelitian | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [loadingSave, setLoadingSave] = createSignal(false);
    const [open, setOpen] = createSignal(false);
    const [isUpdate, setIsUpdate] = createSignal(false)
    const [form, setForm] = createSignal<FormPermohonanPenelitian>(formDefault)
    const [mahasiswa, setMahasiswa] = createSignal(true)

    onMount(async () => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get("id");
            setId(id ?? "");
            setTimeout(() => {
                getData()
            }, 1000)
        }
    });

    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianById(id())
        if (data.data) {
            setData(data.data);
            setForm({
                ...form(),
                check_mahasiswa: data.data.check_mahasiswa,
                biaya_penelitian: data.data.biaya_penelitian,
                izin_etik: data.data.izin_etik
            })
            if(data.data.status == StatusPenelitian.TolakPenelitianEtik){
                setIsUpdate(true)
            }
        }
        setLoading(false);
    }

    // Add this validation helper function at the top of your file
    const validateForm = (form: FormPermohonanPenelitian | any): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Required text fields
        // if (!form.nama.trim()) errors.push("Nama Peneliti wajib diisi");
        // console.log("form", form)
        if (!form.check_mahasiswa) errors.push("Status Mahasiswa wajib diisi");
        if (!form.biaya_penelitian) errors.push("Biaya Penelitian wajib diisi");
        if (!form.izin_etik) errors.push("Izin Etik wajib diisi");

        // Required file fields
        const requiredFiles = [
            { field: 'file_surat_izin_penelitian', label: 'Surat Izin Penelitian' },
            { field: 'file_formulir_telaah_penelitian', label: 'Formulir Telaah Penelitian' },
            { field: 'file_formulir_ketersediaan_penelitian', label: 'Formulir Ketersediaan Penelitian' },
            { field: 'file_proposal_penelitian', label: 'Proposal Penelitian' },
            { field: 'file_cv_peneliti', label: 'CV Peneliti' },
            { field: 'file_bukti_transfer', label: 'Bukti Transfer' }
        ];

        requiredFiles.forEach(({ field, label }) => {
            if (!form[field]) errors.push(`${label} wajib diupload`);
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    };



    // Modify your handleSave function
    const handleSave = async () => {
        setLoadingSave(true);
        try {
            // Validate form
            if(!isUpdate()){
                const { isValid, errors } = validateForm(form());
                if (!isValid) {
                    showAlert({
                        title: "Validasi Error",
                        message: errors.join('\n'),
                        icon: "error"
                    });
                    return;
                }
            }

            const formData = new FormData();

            // Add text fields
            formData.append('id', id());
            formData.append('nama', form().nama);
            formData.append('check_mahasiswa', form().check_mahasiswa);
            formData.append('biaya_penelitian', form().biaya_penelitian.toString());
            formData.append('izin_etik', form().izin_etik);

            // Add file fields
            const fileFields = [
                'file_surat_izin_penelitian',
                'file_formulir_telaah_penelitian',
                'file_formulir_ketersediaan_penelitian',
                'file_informasi_calon_subjek',
                'file_pernyataan_konflik',
                'file_proposal_penelitian',
                'file_surat_kaji_etik',
                'file_cv_peneliti',
                'file_cv_tim_peneliti',
                'file_persetujuan',
                'file_kuesioner',
                'file_daftar_pustaka',
                'file_bukti_transfer'
            ];

            fileFields.forEach(field => {
                const file = form()[field];
                if (file instanceof File) {
                    formData.append(field, file);
                }
            });

            // Validate file sizes
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            let error2:string[] = []
            formData.forEach((value, key) => {
                if (value instanceof File && value.size > maxFileSize) {
                    showAlert({
                        title: "Validasi Error",
                        message: error2.join('\n'),
                        icon: "error"
                    });
                    return;
                }
            });

            // Send to API

            await PenelitianService.createPenelitian(formData);
            // if (isUpdate()) {
            //     // await PenelitianService.updatePenelitian(form().id, formData);
            // } else {
            // }

            // Show success message
            showAlert({
                title: "Berhasil",
                message: isUpdate() ? "Data berhasil diupdate" : "Data berhasil ditambahkan",
                icon: "success"
            });

            // Reset and close form
            setForm(formDefault);
            setOpen(false);

            // Refresh data
            // getData();
            route.push("/app/penelitian")

        } catch (error) {
            // Show error message
            showAlert({
                title: "Error",
                message: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data",
                icon: "error"
            });
            console.error('Error saving form:', error);
        } finally {
            setLoadingSave(false);
        }
    };

    return (
        <div class="p-6">
            <div class="bg-white shadow-md rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-6">Form Permohonan Penelitian</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div>
                        <FormLabel for="nama" text="Nama Penelitian" />
                        <Input
                            id="nama"
                            value={data()?.nama}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <FormLabel for="check_mahasiswa" text="Apakah anda Mahasiswa dan sudah mengikuti Ujian Proposal?" />
                        <div class="flex gap-2 ">
                            <Select id="check_mahasiswa" options={[
                                { label: "Pilih Status", value: "" },
                                { label: "Ya", value: "YA" },
                                { label: "Tidak", value: "TIDAK" },
                                { label: "Lainnya", value: "LAINNYA" }
                            ]}
                                onInput={(e) => {
                                    setForm({ ...form(), check_mahasiswa: (e.currentTarget.value) })
                                    if (e.currentTarget.value == "LAINNYA") {
                                        setMahasiswa(false)
                                    } else {
                                        setMahasiswa(true)
                                    }
                                }} />
                            <Show when={!mahasiswa()}>
                                <Input
                                    id="check_mahasiswa"
                                    placeholder="Masukkan opsi lain"
                                    onInput={(e) => setForm({ ...form(), check_mahasiswa: e.currentTarget.value })}
                                />
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="biaya_penelitian" text="Biaya Penelitian" />
                        <Input
                            id="biaya_penelitian"
                            type="number"
                            value={form().biaya_penelitian}
                            onInput={(e) => setForm({ ...form(), biaya_penelitian: Number(e.currentTarget.value) })}
                        />
                    </div>

                    {/* File Uploads */}
                    <div>
                        <FormLabel for="file_surat_izin_penelitian" text="Surat Izin Penelitian" />
                        <div class="flex gap-2">

                            <Input
                                id="file_surat_izin_penelitian"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_surat_izin_penelitian: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_surat_izin_penelitian) === "string"}>
                                <Button class="" onclick={() => route.download(data()?.file_surat_izin_penelitian)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_formulir_telaah_penelitian" text="Formulir Telaah Penelitian" />
                        <div class="flex gap-2">
                            <Input
                                id="file_formulir_telaah_penelitian"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_formulir_telaah_penelitian: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_formulir_telaah_penelitian) === "string" && data()?.file_formulir_telaah_penelitian != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_formulir_telaah_penelitian)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_formulir_ketersediaan_penelitian" text="Formulir Ketersediaan Penelitian" />
                        <div class="flex gap-2">
                            <Input
                                id="file_formulir_ketersediaan_penelitian"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_formulir_ketersediaan_penelitian: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_formulir_ketersediaan_penelitian) === "string" && data()?.file_formulir_ketersediaan_penelitian != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_formulir_ketersediaan_penelitian)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_informasi_calon_subjek" text="Informasi Calon Subjek" />
                        <div class="flex gap-2">
                            <Input
                                id="file_informasi_calon_subjek"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_informasi_calon_subjek: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_informasi_calon_subjek) === "string" && data()?.file_informasi_calon_subjek != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_informasi_calon_subjek)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_pernyataan_konflik" text="Pernyataan Konflik" />
                        <div class="flex gap-2">
                            <Input
                                id="file_pernyataan_konflik"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_pernyataan_konflik: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_pernyataan_konflik) === "string" && data()?.file_pernyataan_konflik != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_pernyataan_konflik)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_proposal_penelitian" text="Proposal Penelitian" />
                        <div class="flex gap-2">
                            <Input
                                id="file_proposal_penelitian"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_proposal_penelitian: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_proposal_penelitian) === "string" && data()?.file_proposal_penelitian != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_proposal_penelitian)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_surat_kaji_etik" text="Surat Kaji Etik" />
                        <div class="flex gap-2">
                            <Input
                                id="file_surat_kaji_etik"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_surat_kaji_etik: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_surat_kaji_etik) === "string" && data()?.file_surat_kaji_etik != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_surat_kaji_etik)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_cv_peneliti" text="CV Peneliti" />
                        <div class="flex gap-2">
                            <Input
                                id="file_cv_peneliti"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_cv_peneliti: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_cv_peneliti) === "string" && data()?.file_cv_peneliti != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_cv_peneliti)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_cv_tim_peneliti" text="CV Tim Peneliti" />
                        <div class="flex gap-2">
                            <Input
                                id="file_cv_tim_peneliti"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_cv_tim_peneliti: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_cv_tim_peneliti) === "string" && data()?.file_cv_tim_peneliti != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_cv_tim_peneliti)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_persetujuan" text="File Persetujuan" />
                        <div class="flex gap-2">
                            <Input
                                id="file_persetujuan"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_persetujuan: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_persetujuan) === "string" && data()?.file_persetujuan != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_persetujuan)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_kuesioner" text="File Kuesioner" />
                        <div class="flex gap-2">
                            <Input
                                id="file_kuesioner"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_kuesioner: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_kuesioner) === "string" && data()?.file_kuesioner != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_kuesioner)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_daftar_pustaka" text="Daftar Pustaka" />
                        <div class="flex gap-2">
                            <Input
                                id="file_daftar_pustaka"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_daftar_pustaka: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_daftar_pustaka) === "string" && data()?.file_daftar_pustaka != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_daftar_pustaka)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_bukti_transfer" text="Bukti Transfer" />
                        <div class="flex gap-2">
                            <Input
                                id="file_bukti_transfer"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setForm({ ...form(), file_bukti_transfer: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_bukti_transfer) === "string" && data()?.file_bukti_transfer != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_bukti_transfer)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="izin_etik" text="Izin Etik" />
                        <Input
                            id="izin_etik"
                            value={form().izin_etik}
                            onInput={(e) => setForm({ ...form(), izin_etik: e.currentTarget.value })}
                        />
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <Button
                        variant="secondary"
                        onclick={() => setOpen(false)}
                        disabled={loadingSave()}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onclick={handleSave}
                        disabled={loadingSave()}
                    >
                        {loadingSave() ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
