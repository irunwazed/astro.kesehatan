
export enum StatusPenelitian {
    Draft = 101,
    Submit = 102,
    TerimaPenelitian = 201,
    TolakPenelitian = 202,
    PenelitianUpload = 205,
    TerimaPenelitianEtik = 301,
    TolakPenelitianEtik = 302,
    Expired = 401,
    PermintaanPerpanjangan = 402,
    SiapTelaah = 501,
    SudahTelaah = 502,
    SiapAmandemen = 601,
    UploadAmandemen = 602,
    SiapApprovalAmandemen = 603,
    Amandemen = 604,
    SiapPublish = 901,
    EthicalApproval = 902,
    Diizinkan = 903,
}

export const getStatusPenelitianNama = (status: number) => {
    if (status == 101) return "Draft"
    if (status == 102) return "Submit"
    if (status == 201) return "Penelitian Diterima"
    if (status == 202) return "Informasi Kurang"
    if (status == 205) return "Penelitian Upload"
    if (status == 301) return "Proses Kaji Etik"
    if (status == 302) return "Revisi"
    if (status == 401) return "Expired"
    if (status == 402) return "Permintaan Perpanjangan"
    if (status == 501) return "Siap ditelaah Komite Etik"
    if (status == 502) return "Sudah ditelaah"
    if (status == 601) return "Siap Amandemen"
    if (status == 602) return "Upload Amandemen"
    if (status == 603) return "Siap Approval Amandemen"
    if (status == 604) return "Amandemen"
    if (status == 901) return "Siap Publish Penelitian"
    if (status == 902) return "Ethical Approval"
    if (status == 903) return "Penelitian Diizinkan"
    return ""
}

export const getStatusCalonPenelitianNama = (status: number) => {
    if (status == 101) return "Draft"
    if (status == 102) return "Submit"
    if (status == 201) return "Penelitian Diterima"
    if (status == 202) return "Informasi Kurang"
    if (status == 205) return "Penelitian Upload"
    if (status == 301) return "Proses Kaji Etik"
    if (status == 302) return "Revisi"
    if (status == 401) return "Expired"
    if (status == 402) return "Permintaan Perpanjangan"
    if (status == 501) return "Proses Kaji Etik"
    if (status == 502) return "Proses Kaji Etik"
    if (status == 601) return "Proses Amandemen"
    if (status == 602) return "Proses Amandemen"
    if (status == 603) return "Proses Amandemen"
    if (status == 604) return "Amandemen"
    if (status == 901) return "Proses Verifikasi Publish"
    if (status == 902) return "Ethical Approval"
    if (status == 903) return "Penelitian Diizinkan"
    return ""
}

export const getStatusPenelitianData = (status: number) => {
    if (status == 101) return { name: getStatusPenelitianNama(101), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 102) return { name: getStatusPenelitianNama(102), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 201) return { name: getStatusPenelitianNama(201), class: "bg-green-200 text-green-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 202) return { name: getStatusPenelitianNama(202), class: "bg-red-200 text-red-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 205) return { name: getStatusPenelitianNama(205), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 301) return { name: getStatusPenelitianNama(301), class: "bg-green-200 text-green-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 302) return { name: getStatusPenelitianNama(302), class: "bg-red-200 text-red-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 401) return { name: getStatusPenelitianNama(401), class: "bg-red-200 text-red-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 402) return { name: getStatusPenelitianNama(402), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 501) return { name: getStatusPenelitianNama(501), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 502) return { name: getStatusPenelitianNama(502), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 601) return { name: getStatusPenelitianNama(601), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 602) return { name: getStatusPenelitianNama(602), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 603) return { name: getStatusPenelitianNama(603), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 604) return { name: getStatusPenelitianNama(604), class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 901) return { name: getStatusPenelitianNama(901), class: "bg-green-200 text-green-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 902) return { name: getStatusPenelitianNama(902), class: "bg-green-200 text-green-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    if (status == 903) return { name: getStatusPenelitianNama(903), class: "bg-green-200 text-green-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
    return { name: "", class: "bg-slate-200 text-slate-800 hover:opacity-90 rounded-xl shadow-xl align-middle flex justify-center py-1" }
}


export const getStatusPendanaanNama = (status: string) => {
    if (status == "SPONSOR_OBSERVASIONAL") return "[SPONSOR] Penelitian Observasional (Prospektif)"
    if (status == "SPONSOR_UJI_KLINIS") return "[SPONSOR] Uji Klinis"
    if (status == "NON_SPONSOR_OBSERVASIONAL_PROSPEKTIF") return "[NON SPONSOR] Penelitian Observasional (Prospektif)"
    if (status == "NON_SPONSOR_OBSERVASIONAL_RETROSPEKTIF") return "[NON SPONSOR] Penelitian Observasional (Retrospektif)"
    if (status == "NON_SPONSOR_UJI_KLINIS_FARMAKOTERAPI") return "[NON SPONSOR] Uji Klinis - Farmakoterapi"
    if (status == "NON_SPONSOR_UJI_KLINIS_NON_FARMAKOTERAPI") return "[NON SPONSOR] Uji Klinis - Non Farmakoterapi"
    return ""
}

export type GroupResponse = {
    id: string
    nama: string
    jenis: string
    tgl_mulai: string
    tgl_akhir: string
    username: string
    petugas: string
    status: string
    status_name?: string
}

export interface FormPermohonanAwalPenelitian {
    id: string;
    nama: string;
    tujuan: string;
    deskripsi: string;
    variabel_lain: string
    jumlah_minimal_sampel: number
    waktu_awal_sample: number
    waktu_akhir_sample: number
    pendanaan: number // 1. Mandiri, 2. Sponsor 
    sponsor: string
    file_permohonan_instansi: string | File;
    file_draft_penelitian: string | File;
    jenis: string;
    is_internal: boolean;
    kategori: string;
}



export interface FormPermohonanPenelitian {
    id: string;
    nama: string;
    check_mahasiswa: string;
    file_surat_izin_penelitian: string | File;
    file_formulir_telaah_penelitian: string | File;
    file_formulir_ketersediaan_penelitian: string | File;
    file_informasi_calon_subjek: string | File;
    file_pernyataan_konflik: string | File;
    file_proposal_penelitian: string | File;
    file_surat_kaji_etik: string | File;
    file_cv_peneliti: string | File;
    file_cv_tim_peneliti: string | File;
    file_persetujuan: string | File;
    file_kuesioner: string | File;
    file_daftar_pustaka: string | File;
    biaya_penelitian: number;
    file_bukti_transfer: string | File;
    file_informed_consent: string | File
    izin_etik: string;
}

export interface FormPerpanjangPenelitian {
    id: string;
    file_proposal_penelitian: string | File;
    file_Kaji_etik_penelitian: string | File;
    file_perpanjangan: string | File;
    bahasa: string;
}

export interface Penelitian {
    id: string;
    created_at: string;              // ISO date string
    updated_at: string | null;
    deleted_at: string | null;
    status: number;                  // contoh: 'draft' | 'submitted' | 'approved'
    status_nama?: string;             // contoh: 'draft' | 'submitted' | 'approved'
    alasan?: string;
    jenis: string;                   // contoh: 'skripsi' | 'tesis' | 'mandiri'
    user_id: string;

    nama: string;
    tujuan: string;
    deskripsi: string;
    variabel_lain: string | null;
    jumlah_minimal_sampel: number | null;

    waktu_awal_sample: string | null;   // ISO date string
    waktu_akhir_sample: string | null;  // ISO date string

    pendanaan: string | null;
    sponsor: string | null;

    biaya_penelitian:number,
    check_mahasiswa:string,

    file_permohonan_instansi: string | null;
    file_draft_penelitian: string | null;
    mahasiswa_proposal: string | null;
    file_surat_izin_penelitian: string | null;
    file_formulir_telaah_penelitian: string | null;
    file_formulir_ketersediaan_penelitian: string | null;
    file_informasi_calon_subjek: string | null;
    file_pernyataan_konflik: string | null;
    file_proposal_penelitian: string | null;
    file_surat_kaji_etik: string | null;
    file_cv_peneliti: string | null;
    file_cv_tim_peneliti: string | null;
    file_persetujuan: string | null;
    file_kuesioner: string | null;
    file_daftar_pustaka: string | null;
    file_bukti_transfer: string | null;
    file_etik: string | null

    izin_etik: string,

    kategori:string
    nomor_regis: string
    is_internal: boolean

    komite_etik_approval:any[]
    telaah?:string
}

export interface PenelitianDetail {
    user: {
        nama: string
        email:string
    }
    penelitian: Penelitian
}


// Total pembayaran berupa biaya penelitian ditambah biaya kaji etik penelitian yang diibayarkan melalui transfer bank melalui : 

// Bank Mandiri
// Nama              :  RPL 182 BLU RSAB HARKIT UTK OPS PNM
// No rekening   : 1170020241113