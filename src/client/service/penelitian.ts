import { getToken } from "src/helpers/lib/storage";
import { GET, HTTP, HTTPUpload, POST } from "../service";
import type { Penelitian, StatusPenelitian } from "src/helpers/dto/penelitian";

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
}


export const PenelitianService = {

  async createPenelitianAwal(formData: FormData): Promise<ApiResponse<any>> {
    return await HTTPUpload('/api/penelitian-awal', formData)
  },

  async createPenelitian(formData: FormData): Promise<ApiResponse<any>> {
    return await HTTPUpload('/api/penelitian', formData)
  },

  async createPenelitianPerpanjang(formData: FormData): Promise<ApiResponse<any>> {
    return await HTTPUpload('/api/penelitian-perpanjang', formData)
  },

  getPenelitianUser: () => GET<Penelitian[]>({ url: "/api/penelitian" }),
  getNotifikasi: () => GET<Penelitian[]>({ url: "/api/penelitian/notif" }),
  getPenelitianById: (id:string) => GET<Penelitian|null>({ url: "/api/penelitian/data?id="+id }),
  getPenelitianApproval: () => GET<Penelitian[]>({ url: "/api/penelitian/list" }),
  approvalPenelitian: (id:string, jenis:string, status:StatusPenelitian, alasan:string) => POST<{message:string}>({url: "/api/penelitian/approval", body: { id, jenis, status, alasan }}),

  getPenelitianEtik: () => GET<Penelitian[]>({ url: "/api/penelitian/etik" }),
  approvalEtikPenelitian: (formData: FormData) => HTTPUpload("/api/penelitian/etik/approval", formData),


  // async createPenelitian(formData: FormData): Promise<ApiResponse<any>> {
  //   try {
  //     const response = await fetch('/api/penelitian', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error creating penelitian:', error);
  //     throw error;
  //   }
  // },

  // async updatePenelitian(id: string, formData: FormData): Promise<ApiResponse<any>> {
  //   try {
  //     const response = await fetch(`/api/penelitian/${id}`, {
  //       method: 'PUT',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error updating penelitian:', error);
  //     throw error;
  //   }
  // }
};