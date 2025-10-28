// import prisma from "../../helpers/lib/prisma";
import type { Penelitian } from "src/helpers/dto/penelitian";
import { supabase } from "../configs/db";
import type { FormPermohonanPenelitian, InsertPenelitianAwal } from "../types/penelitian";




export class PenelitianRepository {

  async getByUser(user_id: string):Promise<Penelitian[]> {
    let { data: penelitian, error } = await supabase
      .from('penelitian')
      .select('*')
      .eq("user_id", user_id)

    if(!penelitian){
      console.log("error ", error)
      return []
    }
    return penelitian
  }

  async create(data: InsertPenelitianAwal) { // FormPermohonanPenelitian

    return await supabase.from('penelitian').insert([
      {
        user_id: data.user_id,
        nama: data.nama,
        tujuan: data.tujuan,
        deskripsi: data.deskripsi,
        variabel_lain: data.variabel_lain,
        jumlah_minimal_sampel: data.jumlah_minimal_sampel,
        waktu_awal_sample: data.waktu_awal_sample,
        waktu_akhir_sample: data.waktu_akhir_sample,
        pendanaan: data.pendanaan,
        sponsor: data.sponsor,
        file_permohonan_instansi: data.file_permohonan_instansi,
        file_draft_penelitian: data.file_draft_penelitian
      }
    ])
  }

  async insertPenelitian(data: any) { // FormPermohonanPenelitian
    // return await prisma.penelitian.create({
    //   data: {
    //     nama: data.nama,
    //     // check_mahasiswa: data.check_mahasiswa,
    //     biaya_penelitian: data.biaya_penelitian,
    //     izin_etik: data.izin_etik,
    //     surat_izin_penelitian: data.surat_izin_penelitian,
    //     file_formulir_telaah_penelitian: data.file_formulir_telaah_penelitian,
    //     file_formulir_ketersediaan_penelitian: data.file_formulir_ketersediaan_penelitian,
    //     file_informasi_calon_subjek: data.file_informasi_calon_subjek,
    //     file_pernyataan_konflik: data.file_pernyataan_konflik,
    //     file_proposal_penelitian: data.file_proposal_penelitian,
    //     file_surat_kaji_etik: data.file_surat_kaji_etik,
    //     file_cv_peneliti: data.file_cv_peneliti,
    //     file_cv_tim_peneliti: data.file_cv_tim_peneliti,
    //     file_persetujuan: data.file_persetujuan,
    //     file_kuesioner: data.file_kuesioner,
    //     file_daftar_pustaka: data.file_daftar_pustaka,
    //     file_bukti_transfer: data.file_bukti_transfer,
    //   }
    // });
  }

  async findAll() {
    // return await prisma.penelitian.findMany({
    //   orderBy: {
    //     createdAt: 'desc'
    //   }
    // });
  }

  async findById(id: string) {
    // return await prisma.penelitian.findUnique({
    //   where: { id }
    // });
  }

  async update(id: string, data: Partial<FormPermohonanPenelitian>) {
    // return await prisma.penelitian.update({
    //   where: { id },
    //   data
    // });
  }

  async delete(id: string) {
    // return await prisma.penelitian.delete({
    //   where: { id }
    // });
  }
}