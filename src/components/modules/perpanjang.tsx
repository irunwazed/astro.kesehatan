import { createSignal, onMount } from "solid-js";
import FormLabel from "@solid-ui/FormLabel";
import Input from "@solid-ui/Input";
import Button from "@solid-ui/Button";
import { showAlert } from "@solid-ui/alertStore";
import type { FormPermohonanPenelitian, FormPerpanjangPenelitian, GroupResponse, Penelitian } from "src/helpers/dto/penelitian";
import { GroupService } from "src/client/service/group";
import { PenelitianService } from "src/client/service/penelitian";
import { route } from "src/helpers/lib/route";

export default function FormPerpanjang() {

    const formDefault: FormPerpanjangPenelitian = {
        id: "",
        file_Kaji_etik_penelitian: "",
        file_perpanjangan: "",
        file_proposal_penelitian: "",
        bahasa: "",
    }

    const [id, setId] = createSignal("");
    const [data, setData] = createSignal<Penelitian|null>(null);
    const [loading, setLoading] = createSignal(false);
    const [loadingSave, setLoadingSave] = createSignal(false);
    const [open, setOpen] = createSignal(false);
    const [isUpdate, setIsUpdate] = createSignal(false)
    const [form, setForm] = createSignal<FormPerpanjangPenelitian>(formDefault)

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

        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get("id");
            console.log("id", id)
            setId(id ?? "");
            setTimeout(() => {
                getData()
            }, 1000)
        }
    });

    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianById(id())
        console.log("data", data)
        if (data.data) {
            setData(data.data);
        }
        setLoading(false);
    }

    const setCreate = () => {
        setOpen(true)
        setIsUpdate(false)
    }


    // Add this validation helper function at the top of your file
    const validateForm = (form: FormPerpanjangPenelitian): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Required text fields
        // if (!form.nama.trim()) errors.push("Nama Peneliti wajib diisi");
        if (!form.bahasa) errors.push("Biaya Penelitian wajib diisi");

        if (!form.file_Kaji_etik_penelitian) errors.push(`Kaji Etik wajib diupload`);
        if (!form.file_perpanjangan) errors.push(`Form Perpanjangan wajib diupload`);
        if (!form.file_proposal_penelitian) errors.push(`Proposal wajib diupload`);

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
            formData.append('id', id());
            formData.append('bahasa', form().bahasa);
            formData.append('file_Kaji_etik_penelitian', form().file_Kaji_etik_penelitian);
            formData.append('file_perpanjangan', form().file_perpanjangan);
            formData.append('file_proposal_penelitian', form().file_proposal_penelitian);

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
                await PenelitianService.createPenelitianPerpanjang(formData);
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
                        />
                    </div>

                    <div>
                        <FormLabel for="bahasa" text="Status Mahasiswa" />
                        <Input
                            id="bahasa"
                            value={form().bahasa}
                            onInput={(e) => setForm({ ...form(), bahasa: e.currentTarget.value })}
                        />
                    </div>
                    
                    {/* File Uploads */}

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
                        <FormLabel for="file_Kaji_etik_penelitian" text="Kaji Etik Penelitian" />
                        <Input
                            id="file_Kaji_etik_penelitian"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_Kaji_etik_penelitian: e.currentTarget.files?.[0] as File })}
                        />
                    </div>

                    <div>
                        <FormLabel for="file_perpanjangan" text="Form Permohonan Perpanjangan Etik Penelitian" />
                        <Input
                            id="file_perpanjangan"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setForm({ ...form(), file_perpanjangan: e.currentTarget.files?.[0] as File })}
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
