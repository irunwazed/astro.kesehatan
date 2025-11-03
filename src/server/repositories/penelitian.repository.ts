// import prisma from "../../helpers/lib/prisma";
import { StatusPenelitian, type Penelitian } from "src/helpers/dto/penelitian";
import { supabase } from "../configs/db";
import type { FormPermohonanPenelitian, InsertPenelitianAwal, InsertPenelitianPerpanjang } from "../types/penelitian";
import { getTimeNow } from "src/helpers/lib/time";




export class PenelitianRepository {

  async getById(id: string): Promise<Penelitian | null> {
    let { data: penelitian, error } = await supabase
      .from('penelitian')
      .select('*')
      .eq("id", id)
      .limit(1)

    if (!penelitian || penelitian.length == 0) {
      console.log("error ", error)
      return null
    }
    return penelitian[0]
  }

  async getByUser(user_id: string): Promise<Penelitian[]> {
    let { data: penelitian, error } = await supabase
      .from('penelitian')
      .select('*')
      .eq("user_id", user_id)
      .order("updated_at", { ascending: false })

    if (!penelitian) {
      console.log("error ", error)
      return []
    }
    return penelitian
  }


  async getReadyApproval(): Promise<Penelitian[]> {
    let { data: penelitian, error } = await supabase
      .from('penelitian')
      .select('*')
      .eq("status", StatusPenelitian.Submit)

    if (!penelitian) {
      console.log("error ", error)
      return []
    }
    return penelitian
  }


  async getReadyEtik(): Promise<Penelitian[]> {
    let { data: penelitian, error } = await supabase
      .from('penelitian')
      .select('*')
      .in('status', [StatusPenelitian.PenelitianUpload, StatusPenelitian.PermintaanPerpanjangan])

    if (!penelitian) {
      console.log("error ", error)
      return []
    }
    return penelitian
  }

  async create(data: InsertPenelitianAwal) { // FormPermohonanPenelitian

    return await supabase.from('penelitian').insert([
      {
        ...data,
        user_id: data.user_id,
        // nama: data.nama,
        // tujuan: data.tujuan,
        // deskripsi: data.deskripsi,
        // variabel_lain: data.variabel_lain,
        // jumlah_minimal_sampel: data.jumlah_minimal_sampel,
        // waktu_awal_sample: data.waktu_awal_sample,
        // waktu_akhir_sample: data.waktu_akhir_sample,
        // pendanaan: data.pendanaan,
        // sponsor: data.sponsor,
        // file_permohonan_instansi: data.file_permohonan_instansi,
        // file_draft_penelitian: data.file_draft_penelitian,
        status: StatusPenelitian.Submit,
        updated_at: getTimeNow(),
      }
    ])
  }


  async update(id:string, data: InsertPenelitianAwal) { // FormPermohonanPenelitian

    return await supabase.from('penelitian').update({
        ...data,
        user_id: data.user_id,
        // nama: data.nama,
        // tujuan: data.tujuan,
        // deskripsi: data.deskripsi,
        // variabel_lain: data.variabel_lain,
        // jumlah_minimal_sampel: data.jumlah_minimal_sampel,
        // waktu_awal_sample: data.waktu_awal_sample,
        // waktu_akhir_sample: data.waktu_akhir_sample,
        // pendanaan: data.pendanaan,
        // sponsor: data.sponsor,
        // file_permohonan_instansi: data.file_permohonan_instansi,
        // file_draft_penelitian: data.file_draft_penelitian,
        status: StatusPenelitian.Submit,
        updated_at: getTimeNow(),
      }).eq("id", id)
  }

  async createPerpanjang(data: InsertPenelitianPerpanjang) { // FormPermohonanPenelitian

    await supabase.from('penelitian').update(
      {
        status: StatusPenelitian.PermintaanPerpanjangan,
        updated_at: getTimeNow(),
      }
    ).eq("id", data.penelitian_id)


    return await supabase.from('penelitian_perpanjang').insert([
      {
        penelitian_id: data.penelitian_id,
        file_proposal_penelitian: data.file_proposal_penelitian,
        file_Kaji_etik_penelitian: data.file_Kaji_etik_penelitian,
        file_perpanjangan: data.file_perpanjangan,
        bahasa: data.bahasa
      }
    ])
  }

  async approval(id: string, jenis: string, status: boolean, alasan: string) { // FormPermohonanPenelitian
    return await supabase.from('penelitian').update({
      jenis: jenis,
      alasan: alasan,
      status: status ? StatusPenelitian.TerimaPenelitian : StatusPenelitian.TolakPenelitian,
      updated_at: getTimeNow(),
    }).eq("id", id)
  }

  async approvalEtik(id: string, nomor: string, status: boolean, alasan: string, file_etik: string) { // FormPermohonanPenelitian
    return await supabase.from('penelitian').update({
      nomor: nomor,
      alasan: alasan,
      status: status ? StatusPenelitian.PublishPenelitian : StatusPenelitian.TolakPenelitianEtik,
      file_etik: file_etik,
      updated_at: getTimeNow(),
    }).eq("id", id)
  }

  async insertPenelitianBerkas(data: any) { // FormPermohonanPenelitian
    return await supabase.from('penelitian').update([
      {
        ...data,
        // check_mahasiswa: data.check_mahasiswa,
        // biaya_penelitian: data.biaya_penelitian,
        // izin_etik: data.izin_etik,
        // surat_izin_penelitian: data.surat_izin_penelitian,
        // file_formulir_telaah_penelitian: data.file_formulir_telaah_penelitian,
        // file_formulir_ketersediaan_penelitian: data.file_formulir_ketersediaan_penelitian,
        // file_informasi_calon_subjek: data.file_informasi_calon_subjek,
        // file_pernyataan_konflik: data.file_pernyataan_konflik,
        // file_proposal_penelitian: data.file_proposal_penelitian,
        // file_surat_kaji_etik: data.file_surat_kaji_etik,
        // file_cv_peneliti: data.file_cv_peneliti,
        // file_cv_tim_peneliti: data.file_cv_tim_peneliti,
        // file_persetujuan: data.file_persetujuan,
        // file_kuesioner: data.file_kuesioner,
        // file_daftar_pustaka: data.file_daftar_pustaka,
        // file_bukti_transfer: data.file_bukti_transfer,
        status: StatusPenelitian.PenelitianUpload,
        updated_at: getTimeNow(),
      }
    ]).eq("id", data.id)
  }

}