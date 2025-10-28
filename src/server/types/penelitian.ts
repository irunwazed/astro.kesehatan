

export type InsertPenelitianAwal = {
  user_id: string,
  nama: string
  tujuan: string
  deskripsi: string
  variabel_lain: string
  jumlah_minimal_sampel: number
  waktu_awal_sample: number
  waktu_akhir_sample: number
  pendanaan: number // 1. Mandiri, 2. Sponsor 
  sponsor: string
  file_permohonan_instansi: string
  file_draft_penelitian: string
}

export type FormPermohonanPenelitian = {

        nama: string,
        check_mahasiswa: string,
        biaya_penelitian: number,
        izin_etik: number,
        surat_izin_penelitian: number,
        file_formulir_telaah_penelitian: string,
        file_formulir_ketersediaan_penelitian: string,
        file_informasi_calon_subjek: string,
        file_pernyataan_konflik: string,
        file_proposal_penelitian: string,
        file_surat_kaji_etik: string,
        file_cv_peneliti: string,
        file_cv_tim_peneliti: string,
        file_persetujuan: string,
        file_kuesioner: string,
        file_daftar_pustaka: string,
        file_bukti_transfer: string,
}