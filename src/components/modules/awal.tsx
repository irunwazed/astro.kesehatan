import { createSignal, onMount } from "solid-js";
import FormLabel from "@solid-ui/FormLabel";
import Input from "@solid-ui/Input";
import Button from "@solid-ui/Button";
import { showAlert } from "@solid-ui/alertStore";
import type { FormPermohonanAwalPenelitian, FormPermohonanPenelitian, GroupResponse } from "src/helpers/dto/penelitian";
import { GroupService } from "src/client/service/group";
import { PenelitianService } from "src/client/service/penelitian";

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
    const [data, setData] = createSignal<GroupResponse[]>([]);
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
        // getData()

        // showAlert({
        //     title: "Validasi Error",
        //     message: "sdfsf",
        //     icon: "error"
        // });
    });

    // const getData = async () => {
    //     setLoading(true);
    //     const data = await GroupService.getGroup()
    //     if (data.data) {
    //         // const result = data.data.map((val, idx) => {
    //         //     let mulai = formatSqlDatetime(val.tgl_mulai)
    //         //     val.tgl_mulai = `${mulai.date} (${mulai.time})`
    //         //     let akhir = formatSqlDatetime(val.tgl_akhir)
    //         //     val.tgl_akhir = `${akhir.date} (${akhir.time})`
    //         // })

    //         data.data.map((dt) => {
    //             if (dt.status == "ROLLBACK") {
    //                 dt.status_name = "Selesai Ujian"
    //             } else if (dt.status == "COMMIT") {
    //                 dt.status_name = "Sedang Ujuin"
    //             } else {
    //                 dt.status_name = dt.status
    //             }
    //         })
    //         setData(data.data);
    //     }
    //     setLoading(false);
    // }

    const setCreate = () => {
        setOpen(true)
        setIsUpdate(false)
    }

    // const setUpdate = (u: GroupResponse) => {
    //     setIsUpdate(true)
    //     setOpen(true)
    //     // setForm({
    //     //     id: u.id,
    //     //     nama: u.nama,
    //     //     jenis: u.jenis,
    //     //     tgl_mulai: u.tgl_mulai,
    //     //     tgl_akhir: u.tgl_akhir,
    //     //     username: u.username,
    //     // })
    // }

    // const setSearch = (u: GroupResponse) => { window.location.href = `/pengguna/${u.id}` }

    // const shwoOTP = (u: GroupResponse) => { window.location.href = `/otp/${u.id}` }

    // const createData = async (u: FormGroup) => {
    //     await GroupService.createGroup(form())
    //     getData()
    // }
    // const updateData = async (u: FormGroup) => {
    //     await GroupService.updateGroup(form())
    //     getData()
    // }



    // async function mfaCommit(u: FormGroup) {
    //     const confirmed = await showAlert({
    //         title: "Ubah PIN Peserta",
    //         message: "Apakah anda yakin ingin mengubah pin peserta ini untuk mengikuti ujian?",
    //         icon: "warning",
    //         showCancel: true,
    //         confirmText: "Ya",
    //         cancelText: "Tidak",
    //     });

    //     if (confirmed) {
    //         await MFAService.setMFAGroup({ group_id: u.id })
    //         getData()
    //     } else {
    //         console.log("Batal");
    //     }
    // }


    // async function mfaRollback(u: FormGroup) {
    //     const confirmed = await showAlert({
    //         title: "Mengembalikan PIN Peserta",
    //         message: "Apakah anda yakin ingin mengembalikan pin peserta ini karena selesai ujian?",
    //         icon: "warning",
    //         showCancel: true,
    //         confirmText: "Ya",
    //         cancelText: "Tidak",
    //     });

    //     if (confirmed) {
    //         await MFAService.setRollbackMFAGroup({ group_id: u.id })
    //         getData()
    //     } else {
    //         console.log("Batal");
    //     }
    // }

    // async function deleteData(u: FormGroup) {
    //     const confirmed = await showAlert({
    //         title: "Hapus Data?",
    //         message: "Apakah anda yakin ingin menghapus data ini?",
    //         icon: "warning",
    //         showCancel: true,
    //         confirmText: "Ya",
    //         cancelText: "Tidak",
    //     });

    //     if (confirmed) {
    //         await GroupService.deleteGroup(u.id)
    //         getData()
    //     } else {
    //         console.log("Batal");
    //     }
    // }

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

            const formData = new FormData();

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
            formData.forEach((value, key) => {
                if (value instanceof File && value.size > maxFileSize) {

                    showAlert({
                        title: "Validasi Error",
                        message: errors.join('\n'),
                        icon: "error"
                    });
                    return;
                    // throw new Error(`File ${key} melebihi batas ukuran maksimal (5MB)`);
                }
            });

            // Send to API
            if (isUpdate()) {
                // await PenelitianService.updatePenelitian(form().id, formData);
            } else {
                await PenelitianService.createPenelitianAwal(formData);
            }

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
            <div class="flex justify-between mb-6">
                <Button variant="info" onclick={() => setCreate()}>Tambah</Button>
            </div>

            <div class="bg-white shadow-md rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-6">Form Permohonan Penelitian</h2>

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

                    <div>
                        <FormLabel for="waktu_awal_sample" text="Jangka Waktu Awal Pengambilan Sampel data" />
                        <Input
                            id="waktu_awal_sample"
                            type="number"
                            value={form().waktu_awal_sample}
                            onInput={(e) => setForm({ ...form(), waktu_awal_sample: Number(e.currentTarget.value) })}
                        />
                    </div>
                    <div>
                        <FormLabel for="waktu_akhir_sample" text="Jangka Waktu Akhir Pengambilan Sampel data" />
                        <Input
                            id="waktu_akhir_sample"
                            type="number"
                            value={form().waktu_akhir_sample}
                            onInput={(e) => setForm({ ...form(), waktu_akhir_sample: Number(e.currentTarget.value) })}
                        />
                    </div>
                    <div>
                        <FormLabel for="pendanaan" text="Asal pendanaan penelitian? " />
                        <Input
                            id="pendanaan"
                            type="number"
                            value={form().pendanaan}
                            onInput={(e) => setForm({ ...form(), pendanaan: Number(e.currentTarget.value) })}
                        />
                    </div>
                    <div>
                        <FormLabel for="sponsor" text="Jika sponsor, sebutkan nama sponsornya" />
                        <Input
                            id="sponsor"
                            value={form().sponsor}
                            onInput={(e) => setForm({ ...form(), sponsor: (e.currentTarget.value) })}
                        />
                    </div>



                    {/* File Uploads */}
                    <div>
                        <FormLabel for="file_draft_penelitian" text="Draft Proposal Penelitian" />
                        <Input
                            id="file_draft_penelitian"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_draft_penelitian: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_permohonan_instansi" text="Surat Permohonan dari Instansi" />
                        <Input
                            id="file_permohonan_instansi"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_permohonan_instansi: e.currentTarget.files?.[0] as File })}
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
