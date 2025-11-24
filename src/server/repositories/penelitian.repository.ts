// import prisma from "../../helpers/lib/prisma";
import { StatusPenelitian, type Penelitian } from "src/helpers/dto/penelitian";
import { supabase } from "../configs/db";
import type { FormPermohonanPenelitian, InsertPenelitianAwal, InsertPenelitianPerpanjang } from "../types/penelitian";
import { getTimeNow } from "src/helpers/lib/time";
import { USER } from "src/helpers/lib/constant";
import { generateNomor } from "../helpers/crypto";
import type { KomiteEtikTelaah } from "../models/penelitian";


function extractNomorUrut(nomorRegis: string): number {
  try {
    if (!nomorRegis) return 0;

    const parts = nomorRegis.split("/");
    if (parts.length < 2) return 0;

    const num = parseInt(parts[1], 10);

    return isNaN(num) ? 0 : num;
  } catch (err) {
    return 0;
  }
}


const getLastNoNow = async (): Promise<number> => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const { data: penelitian, error } = await supabase
    .from("penelitian")
    .select("nomor_regis")
    .like("nomor_regis", `%/${month}/${year}`)
    .order("nomor_regis", { ascending: false }) // ambil nomor terakhir
    .limit(1);

  if (error) {
    console.error("Supabase error:", error);
    return 0;
  }

  if (!penelitian || penelitian.length === 0) {
    return 0;
  }

  return extractNomorUrut(penelitian[0].nomor_regis);
};


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
      .in('status', [StatusPenelitian.Submit, StatusPenelitian.PenelitianUpload, StatusPenelitian.PermintaanPerpanjangan, StatusPenelitian.SiapPublish, StatusPenelitian.UploadAmandemen])

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
      .in('status', [StatusPenelitian.TerimaPenelitianEtik, StatusPenelitian.SudahTelaah, StatusPenelitian.SiapApprovalAmandemen])

    if (!penelitian) {
      console.log("error ", error)
      return []
    }
    return penelitian
  }


  async getReadyTelaah(user_id: string): Promise<Penelitian[]> {
    let { data: penelitian, error } = await supabase
      .from('penelitian')
      .select('*')
      .in('status', [StatusPenelitian.SiapTelaah])

    console.log("penelitian", penelitian?.length)
    const telaah: Penelitian[] = []
    penelitian?.map((p) => {
      p?.komite_etik_approval?.map((ep: KomiteEtikTelaah) => {
        if (ep.id == user_id) {
          telaah.push(p)
        }
      })
    })

    console.log("telaah", telaah?.length)

    if (error) {
      console.log("error ", error)
      return []
    }
    return telaah
  }



  async create(data: InsertPenelitianAwal) { // FormPermohonanPenelitian

    const no = generateNomor(await getLastNoNow() + 1)
    console.log("no", no)
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
        nomor_regis: no,
        updated_at: getTimeNow(),
      }
    ])
  }


  async update(id: string, data: InsertPenelitianAwal) { // FormPermohonanPenelitian

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
  
  async uploadAmandemen(id: string, file_amandemen:string) { // FormPermohonanPenelitian
    return await supabase.from('penelitian').update({
      // jenis: jenis,
      file_amandemen: file_amandemen,
      status: StatusPenelitian.UploadAmandemen,
      updated_at: getTimeNow(),
    }).eq("id", id)
  }

  
  async updateStatus(id: string, status: StatusPenelitian) { 
    console.log("update", id, status)
    return await supabase.from('penelitian').update({
      status: status,
      updated_at: getTimeNow(),
    }).eq("id", id)
  }

  async approval(id: string, jenis: string, status: number, alasan: string) { // FormPermohonanPenelitian
    return await supabase.from('penelitian').update({
      // jenis: jenis,
      alasan: alasan,
      status: status,
      updated_at: getTimeNow(),
    }).eq("id", id)
  }

  async approvalEtik(id: string, nomor: string, status: StatusPenelitian, alasan: string, file_etik: string, jenis: string, komite_etik: any) { // FormPermohonanPenelitian
    return await supabase.from('penelitian').update({
      nomor: nomor,
      alasan: alasan,
      status: status,
      file_etik: file_etik,
      komite_etik_approval: komite_etik,
      updated_at: getTimeNow(),
    }).eq("id", id)
  }

  

  async telaahEtik(id: string, telaah:string, nomor: string, alasan: string, file_etik: string) { // FormPermohonanPenelitian
    let update:any = {
      nomor: nomor,
      alasan: alasan,
      telaah: telaah,
      file_etik: file_etik,
      status: StatusPenelitian.SiapAmandemen,
      updated_at: getTimeNow(),
    }
    if(telaah.toLowerCase() == "Disetujui".toLowerCase()){
      update.status = StatusPenelitian.SiapPublish
    }
    return await supabase.from('penelitian').update(update).eq("id", id)
  }

  async approvalTelaah(user_id: string, id: string, telaah: string, note: string) {


    let { data: penelitian, error } = await supabase
      .from('penelitian')
      .select('*')
      .eq("id", id)

    const telaahData: KomiteEtikTelaah[] = []
    let isAll = true
    penelitian?.map((p) => {
      p?.komite_etik_approval?.map((ep: KomiteEtikTelaah) => {
        if (ep.id == user_id && p.id == id) {
          ep.telaah = telaah
          ep.note = note
        }
        telaahData.push(ep)

        if(ep.telaah == ""){
          isAll = false
        }
      })
    })

    let update:any = {
      komite_etik_approval: telaahData,
      updated_at: getTimeNow(),
    }
    if(isAll){
      update.status = StatusPenelitian.SudahTelaah
    }

    return await supabase.from('penelitian').update(update).eq("id", id)
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

  //   async getNotifPenelitian(role:string): Promise<Penelitian[]> {

  //     let query = supabase.from('penelitian').select('*').order("updated_at", { ascending: false })

  //     if (role == USER.ADMIN_ETIK) {
  //       query = query.in('status', [StatusPenelitian.PenelitianUpload, StatusPenelitian.PermintaanPerpanjangan])
  //     } else if (role == USER.ADMIN_VALIDASI) {
  //       query = query.eq('status', StatusPenelitian.Submit)
  //     } else if (role == USER.ADMIN) {
  //       query = query.in('status', [StatusPenelitian.PenelitianUpload, StatusPenelitian.PermintaanPerpanjangan, StatusPenelitian.Submit])
  //     } else {
  //       return []
  //     }

  //     let { data: penelitian, error } = await query
  //     if (!penelitian || penelitian.length == 0) {
  //       console.log("error ", error)
  //       return []
  //     }
  //     return penelitian
  //   }

  async getNotifPenelitian(role: string): Promise<Penelitian[]> {
    // Menghitung tanggal 7 hari yang lalu
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Mengurangi 7 hari dari tanggal hari ini
    const sevenDaysAgoISOString = sevenDaysAgo.toISOString(); // Mengubahnya menjadi format ISO string

    // Membangun query dasar
    let query = supabase.from('penelitian').select('*').order("updated_at", { ascending: false });

    // Menambahkan filter untuk 'updated_at' yang lebih kecil dari 7 hari yang lalu
    // query = query.lt('updated_at', sevenDaysAgoISOString); // Mengambil data yang lebih lama dari 7 hari

    // Menambahkan kondisi berdasarkan role
    if (role == USER.ADMIN_ETIK) {
      query = query.in('status', [StatusPenelitian.PenelitianUpload, StatusPenelitian.PermintaanPerpanjangan]);
    } else if (role == USER.ADMIN_VALIDASI) {
      query = query.eq('status', StatusPenelitian.Submit);
    } else if (role == USER.ADMIN) {
      query = query.in('status', [StatusPenelitian.PenelitianUpload, StatusPenelitian.PermintaanPerpanjangan, StatusPenelitian.Submit]);
    } else {
      return [];
    }

    // Menjalankan query dan menangani hasilnya
    const { data: penelitian, error } = await query;
    if (error) {
      console.log("Error fetching penelitian data:", error);
      return [];
    }

    if (!penelitian || penelitian.length == 0) {
      console.log("No penelitian data found");
      return [];
    }

    return penelitian;
  }

}