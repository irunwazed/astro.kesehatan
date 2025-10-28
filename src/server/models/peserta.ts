

export type UjianJenis = {
    id: number
    nama: string
}

export type UjianStatus = "PENGAJUAN" | "DISETUJUI" | "DIBUKA" | "DITUTUP"
export type OrangStatus = "PENJAGA" | "PETUGAS" | "PESERTA"

export type Ujian = {
    id: string
    nama: string
    ujian_jenis_id: number
    tgl_mulai: string
    tgl_akhir: string
    status: UjianStatus
}

export type UjianOrang = {
    id: string,
    orang_id: string,
    ujian_id: string
    instansi_id: string
    instansi_nama: string
    nama: string,
    username: string
    nip?: string
    nik?: string
    status: OrangStatus
}

export type UserSecret = {
    username: string
    nama:string
    secret:string
}