


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
    deskripsi: string
    variabel_lain: string
    jumlah_minimal_sampel: number
    waktu_awal_sample: number
    waktu_akhir_sample: number
    pendanaan: number // 1. Mandiri, 2. Sponsor 
    sponsor: string
    file_permohonan_instansi: string | File;
    file_draft_penelitian: string | File;
}



export interface FormPermohonanPenelitian {
    id: string;
    nama: string;
    check_mahasiswa: string;
    surat_izin_penelitian: string | File;
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
    izin_etik: string;
}


// Total pembayaran berupa biaya penelitian ditambah biaya kaji etik penelitian yang diibayarkan melalui transfer bank melalui : 

// Bank Mandiri
// Nama              :  RPL 182 BLU RSAB HARKIT UTK OPS PNM
// No rekening   : 1170020241113