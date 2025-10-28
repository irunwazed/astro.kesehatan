import type { FormUjianInput } from "src/helpers/dto/ujian";
import { DELETE, GET, POST, PUT } from "../service";
import type { Ujian } from "src/server/models/peserta";
import type { FormGroup, GroupResponse } from "src/helpers/dto/penelitian";
import { getToken } from "src/helpers/lib/storage";

async function uploadExcelFile(file: File, body: FormGroup): Promise<{ status: number; message: string }> {
    const allowedExtensions = ['.xls', '.xlsx'];
    const fileName = file.name.toLowerCase();
    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
        return { status: 400, message: 'File harus berekstensi .xls atau .xlsx' };
    }

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', body.id);
        formData.append('jenis', body.jenis);
        formData.append('nama', body.nama);
        formData.append('tgl_mulai', body.tgl_mulai);
        formData.append('tgl_akhir', body.tgl_akhir);
        formData.append('username', body.username);

        const token = getToken()
        const headers: Record<string, string> = {
        };

        // Tambahkan Authorization jika token ada
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/import/group', {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { status: errorData.status, message: errorData.message || 'Upload gagal' };
        }

        const data = await response.json();
        return { status: 200, message: data.message || 'Upload berhasil' };
    } catch {
        return { status: 500, message: 'Terjadi kesalahan saat upload' };
    }
}


export const GroupService = {
    getGroup: () => GET<GroupResponse[]>({ url: "/api/group" }),
    createGroup: (body: FormGroup) => POST({ url: "/api/group", body: body }),
    updateGroup: (body: FormGroup) => PUT({ url: "/api/group", body: body }),
    deleteGroup: (id: string) => DELETE({ url: `/api/group?id=${id}` }),
    importGroup: (file: File, body: FormGroup) => uploadExcelFile(file, body)
}