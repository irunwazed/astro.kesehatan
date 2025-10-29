import { PenelitianRepository } from "../repositories/penelitian.repository";
import { uploadFilePermohonan } from "../helpers/storage";
import { uuidv7 } from "../helpers/crypto";
import type { InsertPenelitianAwal } from "../types/penelitian";
import { supabase } from "../configs/db";
import { UserRepository } from "../repositories/user.repository";
import { StatusPenelitian } from "src/helpers/dto/penelitian";


const repository = new PenelitianRepository();
const userRepository = new UserRepository();

const processFormData = async (formData: FormData) => {
  const fileFields = [
    'surat_izin_penelitian',
    'file_formulir_telaah_penelitian',
    'file_formulir_ketersediaan_penelitian',
    'file_informasi_calon_subjek',
    'file_pernyataan_konflik',
    'file_proposal_penelitian',
    'file_surat_kaji_etik',
    'file_cv_peneliti',
    'file_cv_tim_peneliti',
    'file_persetujuan',
    'file_kuesioner',
    'file_daftar_pustaka',
    'file_bukti_transfer'
  ];

  const data: Record<string, any> = {};

  // Process text fields
  data.nama = formData.get('nama') as string;
  data.check_mahasiswa = formData.get('check_mahasiswa') as string;
  data.biaya_penelitian = Number(formData.get('biaya_penelitian'));
  data.izin_etik = formData.get('izin_etik') as string;

  let no = 1
  // Process file fields
  for (const field of fileFields) {
    const file = formData.get(field) as File;
    if (file && file.size > 0) {
      const filePath = await uploadFilePermohonan(field + "_" + uuidv7() + ".pdf", file);
      data[field] = filePath;
    }
    no++;
  }

  return data;
}


const processFormDataPenelitianAwal = async (user_id: string, formData: FormData): Promise<InsertPenelitianAwal> => {

  const data: InsertPenelitianAwal = {
    nama: formData.get('nama') as string,
    tujuan: formData.get('tujuan') as string,
    deskripsi: formData.get('deskripsi') as string,
    variabel_lain: formData.get('variabel_lain') as string,
    jumlah_minimal_sampel: parseInt(formData.get('jumlah_minimal_sampel') as string),
    pendanaan: parseInt(formData.get('pendanaan') as string),
    sponsor: formData.get('sponsor') as string,
    user_id: user_id,
    waktu_awal_sample: parseInt(formData.get('waktu_awal_sample') as string),
    waktu_akhir_sample: parseInt(formData.get('waktu_akhir_sample') as string),
    file_draft_penelitian: "",
    file_permohonan_instansi: "",
  };

  const file_draft_penelitian = formData.get("file_draft_penelitian") as File;
  const file_draft_penelitian_path = await uploadFilePermohonan("file_draft_penelitian" + "_" + uuidv7() + ".pdf", file_draft_penelitian);
  data.file_draft_penelitian = file_draft_penelitian_path ?? ""


  const file_permohonan_instansi = formData.get("file_permohonan_instansi") as File;
  const file_permohonan_instansi_path = await uploadFilePermohonan("file_permohonan_instansi" + "_" + uuidv7() + ".pdf", file_permohonan_instansi);
  data.file_permohonan_instansi = file_permohonan_instansi_path ?? ""

  return data;
}

export class PenelitianController {

  constructor() {
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


      const data: InsertPenelitianAwal = await processFormDataPenelitianAwal(auth.id, formData);

      const result = await repository.create(data);

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

  async approvalPenelitian(request: Request) {
    try {
      const { status, id } = await request.json();

      const result = await repository.approval(id, status as number == StatusPenelitian.TerimaPenelitian);

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
      const { status, id } = await request.json();

      const result = await repository.approval(id, status as number == StatusPenelitian.TerimaPenelitianEtik);

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

  async updatePenelitian(request: Request) {
    try {
      const formData = await request.formData();
      const data: any = await processFormData(formData);

      const result = await repository.insertPenelitian(data);

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