

export enum StatusPenelitian  {
    Draft = 101,
    Submit = 102,
    TerimaPenelitian = 201,
    TolakPenelitian = 202,
    PenelitianUpload = 205,
    TerimaPenelitianEtik = 301,
    TolakPenelitianEtik = 302,
}

export const getStatusPenelitianNama = (status: number) => {
    if(status == 101) return "Draft"
    if(status == 102) return "Submit"
    if(status == 201) return "TerimaPenelitian"
    if(status == 202) return "TolakPenelitian"
    if(status == 202) return "PenelitianUpload"
    if(status == 301) return "TerimaPenelitianEtik"
    if(status == 302) return "TolakPenelitianEtik"
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

export interface Penelitian {
  id: string;
  created_at: string;              // ISO date string
  updated_at: string | null;
  deleted_at: string | null;
  status: number;                  // contoh: 'draft' | 'submitted' | 'approved'
  status_nama?: string;  
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
}


// Total pembayaran berupa biaya penelitian ditambah biaya kaji etik penelitian yang diibayarkan melalui transfer bank melalui : 

// Bank Mandiri
// Nama              :  RPL 182 BLU RSAB HARKIT UTK OPS PNM
// No rekening   : 1170020241113