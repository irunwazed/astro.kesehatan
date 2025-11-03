import { createSignal, onMount, Show } from "solid-js";
import FormLabel from "@solid-ui/FormLabel";
import Input from "@solid-ui/Input";
import Button from "@solid-ui/Button";
import { showAlert } from "@solid-ui/alertStore";
import { StatusPenelitian, type FormPermohonanAwalPenelitian, type GroupResponse, type Penelitian } from "src/helpers/dto/penelitian";
import { PenelitianService } from "src/client/service/penelitian";
import { route } from "src/helpers/lib/route";
import Select from "@solid-ui/Select";

export default function FormPenelitianAwal() {

    const formDefault: FormPermohonanAwalPenelitian = {
        id: "",
        nama: "",
        deskripsi: "",
        tujuan: "",
        variabel_lain: "",
        pendanaan: 0,
        sponsor: "",
        waktu_awal_sample: 0,
        waktu_akhir_sample: 0,
        file_draft_penelitian: "",
        file_permohonan_instansi: "",
        jumlah_minimal_sampel: 0
    }
    const [id, setId] = createSignal("");
    const [data, setData] = createSignal<Penelitian | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [loadingSave, setLoadingSave] = createSignal(false);
    const [open, setOpen] = createSignal(false);
    const [isUpdate, setIsUpdate] = createSignal(false)
    const [form, setForm] = createSignal<FormPermohonanAwalPenelitian>(formDefault)

    // const handleSave = async () => {
    //     setLoadingSave(true);
    //     // if (isUpdate()) {
    //     //     await updateData(form())
    //     // } else {
    //     //     await createData(form())
    //     // }
    //     setLoadingSave(false);
    //     setOpen(false)
    //     getData()
    // }

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
                nama: data.data.nama,
                deskripsi: data.data.deskripsi,
                tujuan: data.data.tujuan,
                variabel_lain: data.data.variabel_lain,
                pendanaan: parseInt(data.data.pendanaan),
                sponsor: data.data.sponsor,
                waktu_awal_sample: parseInt(data.data.waktu_awal_sample),
                waktu_akhir_sample: parseInt(data.data.waktu_akhir_sample),
                jumlah_minimal_sampel: data.data.jumlah_minimal_sampel
            })
            if (data.data.status == StatusPenelitian.TolakPenelitian || data.data.status == StatusPenelitian.Submit) {
                setIsUpdate(true)
            }
        }
        setLoading(false);
    }


    // Add this validation helper function at the top of your file
    const validateForm = (form: FormPermohonanAwalPenelitian): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Required text fields
        if (!form.nama.trim()) errors.push("Nama Penelitian wajib diisi");
        if (!form.tujuan.trim()) errors.push("Tujuan Peneliti wajib diisi");
        if (!form.deskripsi.trim()) errors.push("Deskripsi Peneliti wajib diisi");
        if (!form.variabel_lain.trim()) errors.push("variabel_lain Peneliti wajib diisi");
        if (!form.jumlah_minimal_sampel) errors.push("jumlah_minimal_sampel Peneliti wajib diisi");
        if (!form.waktu_awal_sample) errors.push("waktu_awal_sample Peneliti wajib diisi");
        if (!form.waktu_akhir_sample) errors.push("waktu_akhir_sample Peneliti wajib diisi");
        if (!form.pendanaan) errors.push("Pendanaan Peneliti wajib diisi");
        if (!form.file_permohonan_instansi) errors.push("Pendanaan Peneliti wajib diisi");

        if (!form['file_draft_penelitian']) errors.push(`Draft Penelitian wajib diupload`);
        if (!form['file_permohonan_instansi']) errors.push(`Surat Permohonan Instansi wajib diupload`);

        return {
            isValid: errors.length === 0,
            errors
        };
    };



    // Modify your handleSave function
    const handleSave = async () => {
        setLoadingSave(true);
        try {
            if (!isUpdate()) {
                // Validate form
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

            if (data()?.id) {
                formData.append('id', data().id);
            }

            // Add text fields
            formData.append('nama', form().nama);
            formData.append('deskripsi', form().deskripsi);
            formData.append('tujuan', form().tujuan);
            formData.append('variabel_lain', form().variabel_lain);
            formData.append('jumlah_minimal_sampel', form().jumlah_minimal_sampel.toString());
            formData.append('pendanaan', form().pendanaan.toString());
            formData.append('sponsor', form().sponsor);
            formData.append('waktu_awal_sample', form().waktu_awal_sample.toString());
            formData.append('waktu_akhir_sample', form().waktu_akhir_sample.toString());
            formData.append('deskripsi', form().file_draft_penelitian);
            formData.append('deskripsi', form().deskripsi);


            formData.append("file_draft_penelitian", form().file_draft_penelitian);
            formData.append("file_permohonan_instansi", form().file_permohonan_instansi);

            // Validate file sizes
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            let error2: string[] = []
            formData.forEach((value, key) => {
                if (value instanceof File && value.size > maxFileSize) {
                    showAlert({
                        title: "Validasi Error",
                        message: error2.join('\n'),
                        icon: "error"
                    });
                    return;
                    // throw new Error(`File ${key} melebihi batas ukuran maksimal (5MB)`);
                }
            });

            // Send to API
            await PenelitianService.createPenelitianAwal(formData);

            // Show success message
            showAlert({
                title: "Berhasil",
                message: isUpdate() ? "Data berhasil diupdate" : "Data berhasil ditambahkan",
                icon: "success"
            });

            // Reset and close form
            setForm(formDefault);
            setOpen(false);

            setTimeout(() => {
                route.push("/app/penelitian")
            }, 2000)

            // Refresh data
            // getData();

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
                <h2 class="text-xl font-semibold mb-6">Form Pengajuan Studi Awal</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div>
                        <FormLabel for="nama" text="Nama Penelitian" />
                        <Input
                            id="nama"
                            value={form().nama}
                            onInput={(e) => setForm({ ...form(), nama: e.currentTarget.value })}
                        />
                    </div>

                    <div>
                        <FormLabel for="tujuan" text="Tujuan/Outcome yang diharapkan dari data penelitian" />
                        <Input
                            id="tujuan"
                            value={form().tujuan}
                            onInput={(e) => setForm({ ...form(), tujuan: e.currentTarget.value })}
                        />
                    </div>

                    <div>
                        <FormLabel for="deskripsi" text="Deskripsi Kebutuhan Data (Misalnya diagnosa pasien)" />
                        <Input
                            id="deskripsi"
                            value={form().deskripsi}
                            onInput={(e) => setForm({ ...form(), deskripsi: (e.currentTarget.value) })}
                        />
                    </div>

                    <div>
                        <FormLabel for="variabel_lain" text="Variabel Lain dari Data (Misalnya usia, rawat jalan atau rawat inap, dll)" />
                        <Input
                            id="variabel_lain"
                            value={form().variabel_lain}
                            onInput={(e) => setForm({ ...form(), variabel_lain: (e.currentTarget.value) })}
                        />
                    </div>

                    <div>
                        <FormLabel for="jumlah_minimal_sampel" text="Jumlah Minimal Sampel yang Dibutuhkan" />
                        <Input
                            id="jumlah_minimal_sampel"
                            type="number"
                            value={form().jumlah_minimal_sampel}
                            onInput={(e) => setForm({ ...form(), jumlah_minimal_sampel: Number(e.currentTarget.value) })}
                        />
                    </div>

                    <div class="flex gap-2">
                        <div>
                            <FormLabel for="waktu_awal_sample" text="Jangka Waktu Awal Pengambilan Sampel data (Tahun)" />
                            <Input
                                id="waktu_awal_sample"
                                type="number"
                                value={form().waktu_awal_sample}
                                onInput={(e) => setForm({ ...form(), waktu_awal_sample: Number(e.currentTarget.value) })}
                            />
                        </div>
                        <div>
                            <FormLabel for="waktu_akhir_sample" text="Jangka Waktu Akhir Pengambilan Sampel data (Tahun)" />
                            <Input
                                id="waktu_akhir_sample"
                                type="number"
                                value={form().waktu_akhir_sample}
                                onInput={(e) => setForm({ ...form(), waktu_akhir_sample: Number(e.currentTarget.value) })}
                            />
                        </div>
                    </div>


                    <div class="flex gap-2">
                        <div class="flex-1">
                            <FormLabel for="pendanaan" text="Asal pendanaan penelitian? " />
                            <Select id="pendanaan" options={[
                                { label: "Pilih Pendanaan", value: "0" },
                                { label: "Mandiri", value: "1" },
                                { label: "Sponsor", value: "2" }
                            ]}
                                onInput={(e) => setForm({ ...form(), pendanaan: parseInt(e.currentTarget.value) })} />
                        </div>
                        <Show when={form().pendanaan == 2}>
                            <div>
                                <FormLabel for="sponsor" text="Jika sponsor, sebutkan nama sponsornya" />
                                <Input
                                    id="sponsor"
                                    value={form().sponsor}
                                    onInput={(e) => setForm({ ...form(), sponsor: (e.currentTarget.value) })}
                                />
                            </div>
                        </Show>
                    </div>




                    {/* File Uploads */}
                    <div>
                        <FormLabel for="file_draft_penelitian" text="Draft Proposal Penelitian" />
                        <div class="flex gap-2">
                            <Input
                                id="file_draft_penelitian"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_draft_penelitian: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_draft_penelitian) === "string" && data()?.file_draft_penelitian != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_draft_penelitian)}>Download</Button>
                            </Show>
                        </div>
                    </div>

                    <div>
                        <FormLabel for="file_permohonan_instansi" text="Surat Permohonan dari Instansi" />
                        <div class="flex gap-2">
                            <Input
                                id="file_permohonan_instansi"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setForm({ ...form(), file_permohonan_instansi: e.currentTarget.files?.[0] as File })}
                            />
                            <Show when={typeof (data()?.file_permohonan_instansi) === "string" && data()?.file_permohonan_instansi != ""}>
                                <Button class="" onclick={() => route.download(data()?.file_permohonan_instansi)}>Download</Button>
                            </Show>
                        </div>
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
