import { PenelitianRepository } from "../repositories/penelitian.repository";
import { uploadFilePermohonan } from "../helpers/storage";
import { uuidv7 } from "../helpers/crypto";
import type { FormPermohonanPenelitian, InsertPenelitianAwal, InsertPenelitianPerpanjang } from "../types/penelitian";
import { supabase } from "../configs/db";
import { UserRepository } from "../repositories/user.repository";
import { StatusPenelitian, type PenelitianDetail } from "src/helpers/dto/penelitian";
import type { KomiteEtikTelaah } from "../models/penelitian";


const repository = new PenelitianRepository();
const userRepository = new UserRepository();




const processFormDataPenelitian = async (formData: FormData) => {



  const data: FormPermohonanPenelitian = {
    id: formData.get('id') as string,
    nama: formData.get('nama') as string,
    mahasiswa_proposal: formData.get('check_mahasiswa') as string,
    biaya_penelitian: parseInt(formData.get('biaya_penelitian') as string),
    izin_etik: (formData.get('izin_etik') as string),
  };

  if (formData.get("file_surat_izin_penelitian")) {
    const file_surat_izin_penelitian = formData.get("file_surat_izin_penelitian") as File;
    const file_surat_izin_penelitian_path = await uploadFilePermohonan("file_surat_izin_penelitian" + "_" + uuidv7() + ".pdf", file_surat_izin_penelitian);
    data.file_surat_izin_penelitian = file_surat_izin_penelitian_path ?? ""
  }

  if (formData.get("file_formulir_telaah_penelitian")) {
    const file_formulir_telaah_penelitian = formData.get("file_formulir_telaah_penelitian") as File;
    const file_formulir_telaah_penelitian_path = await uploadFilePermohonan("file_formulir_telaah_penelitian" + "_" + uuidv7() + ".pdf", file_formulir_telaah_penelitian);
    data.file_formulir_telaah_penelitian = file_formulir_telaah_penelitian_path ?? ""
  }


  if (formData.get("file_informasi_calon_subjek")) {
    const file_informasi_calon_subjek = formData.get("file_informasi_calon_subjek") as File;
    const file_informasi_calon_subjek_path = await uploadFilePermohonan("file_informasi_calon_subjek" + "_" + uuidv7() + ".pdf", file_informasi_calon_subjek);
    data.file_informasi_calon_subjek = file_informasi_calon_subjek_path ?? ""
  }

  if (formData.get("file_pernyataan_konflik")) {
    const file_pernyataan_konflik = formData.get("file_pernyataan_konflik") as File;
    const file_pernyataan_konflik_path = await uploadFilePermohonan("file_pernyataan_konflik" + "_" + uuidv7() + ".pdf", file_pernyataan_konflik);
    data.file_pernyataan_konflik = file_pernyataan_konflik_path ?? ""
  }

  if (formData.get("file_proposal_penelitian")) {
    const file_proposal_penelitian = formData.get("file_proposal_penelitian") as File;
    const file_proposal_penelitian_path = await uploadFilePermohonan("file_proposal_penelitian" + "_" + uuidv7() + ".pdf", file_proposal_penelitian);
    data.file_proposal_penelitian = file_proposal_penelitian_path ?? ""
  }

  if (formData.get("file_surat_kaji_etik")) {
    const file_surat_kaji_etik = formData.get("file_surat_kaji_etik") as File;
    const file_surat_kaji_etik_path = await uploadFilePermohonan("file_surat_kaji_etik" + "_" + uuidv7() + ".pdf", file_surat_kaji_etik);
    data.file_surat_kaji_etik = file_surat_kaji_etik_path ?? ""
  }

  if (formData.get("file_cv_peneliti")) {
    const file_cv_peneliti = formData.get("file_cv_peneliti") as File;
    const file_cv_peneliti_path = await uploadFilePermohonan("file_cv_peneliti" + "_" + uuidv7() + ".pdf", file_cv_peneliti);
    data.file_cv_peneliti = file_cv_peneliti_path ?? ""
  }

  if (formData.get("file_cv_tim_peneliti")) {
    const file_cv_tim_peneliti = formData.get("file_cv_tim_peneliti") as File;
    const file_cv_tim_peneliti_path = await uploadFilePermohonan("file_cv_tim_peneliti" + "_" + uuidv7() + ".pdf", file_cv_tim_peneliti);
    data.file_cv_tim_peneliti = file_cv_tim_peneliti_path ?? ""
  }

  if (formData.get("file_persetujuan")) {
    const file_persetujuan = formData.get("file_persetujuan") as File;
    const file_persetujuan_path = await uploadFilePermohonan("file_persetujuan" + "_" + uuidv7() + ".pdf", file_persetujuan);
    data.file_persetujuan = file_persetujuan_path ?? ""
  }

  if (formData.get("file_kuesioner")) {
    const file_kuesioner = formData.get("file_kuesioner") as File;
    const file_kuesioner_path = await uploadFilePermohonan("file_kuesioner" + "_" + uuidv7() + ".pdf", file_kuesioner);
    data.file_kuesioner = file_kuesioner_path ?? ""
  }

  if (formData.get("file_daftar_pustaka")) {
    const file_daftar_pustaka = formData.get("file_daftar_pustaka") as File;
    const file_daftar_pustaka_path = await uploadFilePermohonan("file_daftar_pustaka" + "_" + uuidv7() + ".pdf", file_daftar_pustaka);
    data.file_daftar_pustaka = file_daftar_pustaka_path ?? ""
  }

  if (formData.get("file_bukti_transfer")) {
    const file_bukti_transfer = formData.get("file_bukti_transfer") as File;
    const file_bukti_transfer_path = await uploadFilePermohonan("file_bukti_transfer" + "_" + uuidv7() + ".pdf", file_bukti_transfer);
    data.file_bukti_transfer = file_bukti_transfer_path ?? ""
  }

  return data;
}


const processFormDataPenelitianAwal = async (user_id: string, formData: FormData): Promise<{
  data: InsertPenelitianAwal,
  id: string | null,
}> => {

  const id: string = formData.get('id') == null ? "" : formData.get('id') as string
  console.log("sad", formData.get('kategori') as string)

  const data: InsertPenelitianAwal = {
    nama: formData.get('nama') as string,
    tujuan: formData.get('tujuan') as string,
    deskripsi: formData.get('deskripsi') as string,
    variabel_lain: formData.get('variabel_lain') as string,
    jumlah_minimal_sampel: parseInt(formData.get('jumlah_minimal_sampel') as string),
    pendanaan: parseInt(formData.get('pendanaan') as string),
    sponsor: formData.get('sponsor') as string,
    jenis: formData.get('jenis') as string,
    user_id: user_id,
    waktu_awal_sample: parseInt(formData.get('waktu_awal_sample') as string),
    waktu_akhir_sample: parseInt(formData.get('waktu_akhir_sample') as string),
    kategori: formData.get('kategori') as string,
    is_internal: formData.get('is_internal') as string == "true"
  };

  if (formData.get("file_draft_penelitian")) {
    const file_draft_penelitian = formData.get("file_draft_penelitian") as File;
    const file_draft_penelitian_path = await uploadFilePermohonan("file_draft_penelitian" + "_" + uuidv7() + ".pdf", file_draft_penelitian);
    data.file_draft_penelitian = file_draft_penelitian_path ?? ""
  }

  if (formData.get("file_permohonan_instansi")) {
    const file_permohonan_instansi = formData.get("file_permohonan_instansi") as File;
    const file_permohonan_instansi_path = await uploadFilePermohonan("file_permohonan_instansi" + "_" + uuidv7() + ".pdf", file_permohonan_instansi);
    data.file_permohonan_instansi = file_permohonan_instansi_path ?? ""
  }

  return {
    data: data,
    id: id
  };
}


const processFormDataPenelitianPerpanjang = async (user_id: string, formData: FormData): Promise<InsertPenelitianPerpanjang> => {

  const data: InsertPenelitianPerpanjang = {
    bahasa: formData.get('bahasa') as string,
    penelitian_id: formData.get('id') as string,
    file_Kaji_etik_penelitian: "",
    file_perpanjangan: "",
    file_proposal_penelitian: "",
  };

  const file_Kaji_etik_penelitian = formData.get("file_Kaji_etik_penelitian") as File;
  const file_Kaji_etik_penelitian_path = await uploadFilePermohonan("file_Kaji_etik_penelitian" + "_" + uuidv7() + ".pdf", file_Kaji_etik_penelitian);
  data.file_Kaji_etik_penelitian = file_Kaji_etik_penelitian_path ?? ""

  const file_perpanjangan = formData.get("file_perpanjangan") as File;
  const file_perpanjangan_path = await uploadFilePermohonan("file_perpanjangan" + "_" + uuidv7() + ".pdf", file_perpanjangan);
  data.file_perpanjangan = file_perpanjangan_path ?? ""

  const file_proposal_penelitian = formData.get("file_proposal_penelitian") as File;
  const file_proposal_penelitian_path = await uploadFilePermohonan("file_proposal_penelitian" + "_" + uuidv7() + ".pdf", file_proposal_penelitian);
  data.file_proposal_penelitian = file_proposal_penelitian_path ?? ""

  return data;
}

export class PenelitianController {

  constructor() {
  }

  async getNotifikasi(req: Request) {
    try {
      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ message: 'Token tidak valid' }),
          { status: 401 }
        );
      }
      const role = auth.user_metadata.roles as string[]

      // console.log("auth", auth)

      if (!role) {
        return new Response(JSON.stringify({
          status: false,
          message: "Role tidak ditemukan",
        }), { status: 400 });
      }

      const data = await repository.getNotifPenelitian(role[0] ?? "");
      return new Response(JSON.stringify({
        status: true,
        message: "Data berhasil didapat",
        data: data
      }), { status: 200 });
    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async getKomiteEtik(req: Request) {
    const data = await userRepository.getKomiteEtik()
    return new Response(JSON.stringify({
      status: true,
      message: "Data berhasil didapat",
      data: data
    }), { status: 200 });
  }

  async getPenelitianById(req: Request) {
    try {

      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ message: 'Token tidak valid' }),
          { status: 401 }
        );
      }


      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      // console.log("id", id)

      const data = await repository.getById(id ?? "")
      if (!data) {

        return new Response(JSON.stringify({
          status: true,
          message: "Data tidak ditemukan",
        }), { status: 404 });
      }

      const user = await userRepository.getProfileId(data.user_id)



      const result: PenelitianDetail = {
        user: {
          nama: user![0].full_name,
          email: ""
        },
        penelitian: data
      }

      return new Response(JSON.stringify({
        status: true,
        message: "Data berhasil didapat",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async getPenelitianUser(req: Request) {
    try {

      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ message: 'Token tidak valid' }),
          { status: 401 }
        );
      }

      const result = await repository.getByUser(auth.id)

      return new Response(JSON.stringify({
        status: true,
        message: "Data berhasil didapat",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async getPenelitianApproval(req: Request) {
    try {

      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ message: 'Token tidak valid' }),
          { status: 401 }
        );
      }

      const result = await repository.getReadyApproval()

      return new Response(JSON.stringify({
        status: true,
        message: "Data berhasil didapat",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async getPenelitianEtik(req: Request) {
    try {

      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ message: 'Token tidak valid' }),
          { status: 401 }
        );
      }

      const result = await repository.getReadyEtik()

      return new Response(JSON.stringify({
        status: true,
        message: "Data berhasil didapat",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async getPenelitianTelaah(req: Request) {
    try {

      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ message: 'Token tidak valid' }),
          { status: 401 }
        );
      }

      const result = await repository.getReadyTelaah(auth.id)

      return new Response(JSON.stringify({
        status: true,
        message: "Data berhasil didapat",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }


  async insertPenelitian(req: Request) {
    try {
      const formData = await req.formData();

      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ error: 'Token tidak valid' }),
          { status: 401 }
        );
      }

      const { data, id } = await processFormDataPenelitianAwal(auth.id, formData);
      // console.log("id", id)

      let result: any
      if (id == "" || id == null) {
        result = await repository.create(data);
      } else {
        result = await repository.update(id, data);
      }

      if (result.error) {
        return new Response(JSON.stringify({
          status: true,
          message: result.statusText,
          data: result
        }), { status: 400 });
      }

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil dibuat",
        data: result
      }), { status: 201 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async insertPenelitianPerpanjang(req: Request) {
    try {
      const formData = await req.formData();

      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ error: 'Token tidak valid' }),
          { status: 401 }
        );
      }

      const data: InsertPenelitianPerpanjang = await processFormDataPenelitianPerpanjang(auth.id, formData);

      const result = await repository.createPerpanjang(data);

      if (result.error) {
        return new Response(JSON.stringify({
          status: true,
          message: result.statusText,
          data: result
        }), { status: 400 });
      }

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil dibuat",
        data: result
      }), { status: 201 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async insertPenelitianBerkas(req: Request) {
    try {
      const formData = await req.formData();

      const auth = await userRepository.getAuth(req)
      if (!auth) {
        return new Response(
          JSON.stringify({ error: 'Token tidak valid' }),
          { status: 401 }
        );
      }


      const data: FormPermohonanPenelitian = await processFormDataPenelitian(formData);

      const result = await repository.insertPenelitianBerkas(data);

      if (result.error) {
        return new Response(JSON.stringify({
          status: true,
          message: result.statusText,
          data: result
        }), { status: 400 });
      }

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil dibuat",
        data: result
      }), { status: 201 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  
  async updateStatusPenelitian(request: Request) {
    try {
      const { id, status } = await request.json();

      const result = await repository.updateStatus(id, status);

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async uploadAmandemen(request: Request) {
    try {
      
      
      const formData = await request.formData();


      const data: {
        id: string,
        file_amandemen: string
      } = {
        id: formData.get('id') as string,
        file_amandemen: "",
      }

      
      const file_amandemen = formData.get("file_amandemen") as File;
      const file_amandemen_path = await uploadFilePermohonan("file_amandemen" + "_" + uuidv7() + ".pdf", file_amandemen);
      data.file_amandemen = file_amandemen_path ?? ""

      const result = await repository.uploadAmandemen(data.id, data.file_amandemen);

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil diapproval",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async approvalPenelitian(request: Request) {
    try {
      const { status, jenis, id, alasan } = await request.json();

      const result = await repository.approval(id, jenis, status, alasan);

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil diapproval",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async approvalEtikPenelitian(request: Request) {
    try {
      // const { status, id, nomor, alasan } = await request.json();

      const formData = await request.formData();


      const data: {
        id: string,
        status: number
        nomor: string
        alasan: string
        file_etik: string
        komite_etik: string
        jenis: string
      } = {
        id: formData.get('id') as string,
        nomor: formData.get('nomor') as string,
        status: parseInt(formData.get('status') as string),
        alasan: formData.get('alasan') as string,
        file_etik: "",
        komite_etik: formData.get('komite_etik') as string,
        jenis: formData.get('jenis') as string,
      }

      const file_etik = formData.get("file_etik") as File;
      const file_etik_path = await uploadFilePermohonan("file_etik" + "_" + uuidv7() + ".pdf", file_etik);
      data.file_etik = file_etik_path ?? ""

      let komite: KomiteEtikTelaah[] = []

      // { label: "Exempted Review", value: "exempted_review" },
      // { label: "Expedited Review", value: "expedited_review" },
      // { label: "Full Board Review", value: "full_board_review" },

      console.log("data", data)

      let status = StatusPenelitian.TolakPenelitianEtik
      if (data.jenis == "expedited_review") {
        try {
          const etik = JSON.parse(data.komite_etik)
          etik.map((e: { label: string, value: string }) => {
            komite.push({
              id: e?.value,
              nama: e?.label,
              telaah: "",
              note: ""
            })
          })
        } catch (err) { console.log("err", err) }
        status = StatusPenelitian.SiapTelaah
      } else if (data.jenis == "full_board_review") {
        try {
          const data_etik = await userRepository.getKomiteEtik()
          data_etik.map((e) => {
            komite.push({
              id: e?.id,
              nama: e?.full_name,
              telaah: "",
              note: ""
            })
          })
        } catch (err) { console.log("err", err) }
        status = StatusPenelitian.SiapTelaah
      } else if (data.jenis == "exempted_review" && data.status == StatusPenelitian.SiapTelaah) {
        status = StatusPenelitian.SiapPublish
      }
      console.log("komite", komite)
      console.log("status", status)
      const result = await repository.approvalEtik(data.id, data.nomor, status, data.alasan, data.file_etik, data.jenis, komite);

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil diapproval",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  
  async telaahEtikPenelitian(request: Request) {
    try {

      const formData = await request.formData();


      const data: {
        id: string,
        telaah: string
        nomor: string
        alasan: string
        file_etik: string
      } = {
        id: formData.get('id') as string,
        telaah: formData.get('telaah') as string,
        nomor: formData.get('nomor') as string,
        alasan: formData.get('alasan') as string,
        file_etik: "",
      }

      const file_etik = formData.get("file_etik") as File;
      const file_etik_path = await uploadFilePermohonan("file_etik" + "_" + uuidv7() + ".pdf", file_etik);
      data.file_etik = file_etik_path ?? ""

      const result = await repository.telaahEtik(data.id, data.telaah, data.nomor, data.alasan, data.file_etik);

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil ditelaah",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  async approvalTelaahPenelitian(request: Request) {
    try {
      // const { status, id, nomor, alasan } = await request.json();


      const auth = await userRepository.getAuth(request)
      if (!auth) {
        return new Response(
          JSON.stringify({ error: 'Token tidak valid' }),
          { status: 401 }
        );
      }

      const formData = await request.formData();


      const data: {
        id: string,
        telaah: string
        note: string
      } = {
        id: formData.get('id') as string,
        telaah: formData.get('telaah') as string,
        note: formData.get('note') as string,
      }

      console.log("data", data)
      const result = await repository.approvalTelaah(auth.id, data.id, data.telaah, data.note);

      return new Response(JSON.stringify({
        status: true,
        message: "Data penelitian berhasil diapproval",
        data: result
      }), { status: 200 });

    } catch (error) {
      console.log("error", error)
      return new Response(JSON.stringify({
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      }), { status: 500 });
    }
  }

  // async updatePenelitian(request: Request) {
  //   try {
  //     const formData = await request.formData();
  //     const data: any = await processFormData(formData);

  //     const result = await repository.insertPenelitian(data);

  //     return new Response(JSON.stringify({
  //       status: true,
  //       message: "Data penelitian berhasil dibuat",
  //       data: result
  //     }), { status: 201 });

  //   } catch (error) {
  //     console.log("error", error)
  //     return new Response(JSON.stringify({
  //       status: false,
  //       message: error instanceof Error ? error.message : "Terjadi kesalahan",
  //     }), { status: 500 });
  //   }
  // }

  async getAll() {
    // try {
    //   const data = await this.repository.findAll();

    //   return new Response(JSON.stringify({
    //     status: true,
    //     data
    //   }));

    // } catch (error) {
    //   return new Response(JSON.stringify({
    //     status: false,
    //     message: error instanceof Error ? error.message : "Terjadi kesalahan",
    //   }), { status: 500 });
    // }
  }


}