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

  getPenelitianUser: () => GET<Penelitian[]>({ url: "/api/penelitian" }),
  getPenelitianApproval: () => GET<Penelitian[]>({ url: "/api/penelitian/list" }),
  approvalPenelitian: (id:string, status:StatusPenelitian) => POST<{message:string}>({url: "/api/penelitian/approval", body: { id, status }}),

  getPenelitianEtik: () => GET<Penelitian[]>({ url: "/api/penelitian/etik" }),
  approvalEtikPenelitian: (id:string, status:StatusPenelitian) => POST<{message:string}>({url: "/api/penelitian/etik/approval", body: { id, status }}),


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