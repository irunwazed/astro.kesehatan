import type { Ujian, UjianOrang } from "src/server/models/peserta"


export type ResponseAPI<T> = {
    status?: number,
    data?: T,
    message?: string
    pagination?: {
        page: number,
        per_page: number,
        total?: number
    }
}




export type ListPegawaiUjianResponse = {
    ujian: Ujian,
    penjaga: UjianOrang,
    peserta: UjianOrang[]
}