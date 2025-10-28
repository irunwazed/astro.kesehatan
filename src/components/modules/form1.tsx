import { createSignal, onMount } from "solid-js";
import FormLabel from "@solid-ui/FormLabel";
import Input from "@solid-ui/Input";
import Button from "@solid-ui/Button";
import { showAlert } from "@solid-ui/alertStore";
import type { FormPermohonanPenelitian, GroupResponse } from "src/helpers/dto/penelitian";
import { GroupService } from "src/client/service/group";
import { PenelitianService } from "src/client/service/penelitian";

export default function Form1Data() {

    const formDefault: FormPermohonanPenelitian = {
        id: "",
        nama: "",
        check_mahasiswa: "",
        surat_izin_penelitian: "",
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
        biaya_penelitian: 0,
        file_bukti_transfer: "",
        izin_etik: "",
    }
    const [data, setData] = createSignal<GroupResponse[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [loadingSave, setLoadingSave] = createSignal(false);
    const [open, setOpen] = createSignal(false);
    const [isUpdate, setIsUpdate] = createSignal(false)
    const [form, setForm] = createSignal<FormPermohonanPenelitian|any>(formDefault)

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

    const getData = async () => {
        setLoading(true);
        const data = await GroupService.getGroup()
        if (data.data) {
            // const result = data.data.map((val, idx) => {
            //     let mulai = formatSqlDatetime(val.tgl_mulai)
            //     val.tgl_mulai = `${mulai.date} (${mulai.time})`
            //     let akhir = formatSqlDatetime(val.tgl_akhir)
            //     val.tgl_akhir = `${akhir.date} (${akhir.time})`
            // })

            data.data.map((dt) => {
                if (dt.status == "ROLLBACK") {
                    dt.status_name = "Selesai Ujian"
                } else if (dt.status == "COMMIT") {
                    dt.status_name = "Sedang Ujuin"
                } else {
                    dt.status_name = dt.status
                }
            })
            setData(data.data);
        }
        setLoading(false);
    }

    const setCreate = () => {
        setOpen(true)
        setIsUpdate(false)
    }

    const setUpdate = (u: GroupResponse) => {
        setIsUpdate(true)
        setOpen(true)
        // setForm({
        //     id: u.id,
        //     nama: u.nama,
        //     jenis: u.jenis,
        //     tgl_mulai: u.tgl_mulai,
        //     tgl_akhir: u.tgl_akhir,
        //     username: u.username,
        // })
    }

    const setSearch = (u: GroupResponse) => { window.location.href = `/pengguna/${u.id}` }

    const shwoOTP = (u: GroupResponse) => { window.location.href = `/otp/${u.id}` }

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
const validateForm = (form: FormPermohonanPenelitian|any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required text fields
    if (!form.nama.trim()) errors.push("Nama Peneliti wajib diisi");
    if (!form.check_mahasiswa.trim()) errors.push("Status Mahasiswa wajib diisi");
    if (!form.biaya_penelitian) errors.push("Biaya Penelitian wajib diisi");
    if (!form.izin_etik.trim()) errors.push("Izin Etik wajib diisi");

    // Required file fields
    const requiredFiles = [
        { field: 'surat_izin_penelitian', label: 'Surat Izin Penelitian' },
        { field: 'file_formulir_telaah_penelitian', label: 'Formulir Telaah Penelitian' },
        { field: 'file_formulir_ketersediaan_penelitian', label: 'Formulir Ketersediaan Penelitian' },
        { field: 'file_proposal_penelitian', label: 'Proposal Penelitian' },
        { field: 'file_cv_peneliti', label: 'CV Peneliti' },
        { field: 'file_bukti_transfer', label: 'Bukti Transfer' }
    ];

    requiredFiles.forEach(({field, label}) => {
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
        formData.append('check_mahasiswa', form().check_mahasiswa);
        formData.append('biaya_penelitian', form().biaya_penelitian.toString());
        formData.append('izin_etik', form().izin_etik);

        // Add file fields
        const fileFields = [
            'surat_izin_penelitian',
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
            // await PenelitianService.createPenelitian(formData);
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
        getData();

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
                        <FormLabel for="nama" text="Nama Peneliti" />
                        <Input
                            id="nama"
                            value={form().nama}
                            onInput={(e) => setForm({ ...form(), nama: e.currentTarget.value })}
                        />
                    </div>

                    <div>
                        <FormLabel for="check_mahasiswa" text="Status Mahasiswa" />
                        <Input
                            id="check_mahasiswa"
                            value={form().check_mahasiswa}
                            onInput={(e) => setForm({ ...form(), check_mahasiswa: e.currentTarget.value })}
                        />
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
                        <FormLabel for="surat_izin_penelitian" text="Surat Izin Penelitian" />
                        <Input
                            id="surat_izin_penelitian"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), surat_izin_penelitian: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_formulir_telaah_penelitian" text="Formulir Telaah Penelitian" />
                        <Input
                            id="file_formulir_telaah_penelitian"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_formulir_telaah_penelitian: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_formulir_ketersediaan_penelitian" text="Formulir Ketersediaan Penelitian" />
                        <Input
                            id="file_formulir_ketersediaan_penelitian"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_formulir_ketersediaan_penelitian: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_informasi_calon_subjek" text="Informasi Calon Subjek" />
                        <Input
                            id="file_informasi_calon_subjek"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_informasi_calon_subjek: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_pernyataan_konflik" text="Pernyataan Konflik" />
                        <Input
                            id="file_pernyataan_konflik"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_pernyataan_konflik: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_proposal_penelitian" text="Proposal Penelitian" />
                        <Input
                            id="file_proposal_penelitian"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_proposal_penelitian: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_surat_kaji_etik" text="Surat Kaji Etik" />
                        <Input
                            id="file_surat_kaji_etik"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_surat_kaji_etik: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_cv_peneliti" text="CV Peneliti" />
                        <Input
                            id="file_cv_peneliti"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_cv_peneliti: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_cv_tim_peneliti" text="CV Tim Peneliti" />
                        <Input
                            id="file_cv_tim_peneliti"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_cv_tim_peneliti: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_persetujuan" text="File Persetujuan" />
                        <Input
                            id="file_persetujuan"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_persetujuan: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_kuesioner" text="File Kuesioner" />
                        <Input
                            id="file_kuesioner"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_kuesioner: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_daftar_pustaka" text="Daftar Pustaka" />
                        <Input
                            id="file_daftar_pustaka"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_daftar_pustaka: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_bukti_transfer" text="Bukti Transfer" />
                        <Input
                            id="file_bukti_transfer"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setForm({ ...form(), file_bukti_transfer: e.currentTarget.files?.[0] as File })}
                        />
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
