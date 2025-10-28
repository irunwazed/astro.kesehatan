import type { FormUjianInput } from "src/helpers/dto/ujian";
import { DELETE, GET, POST, PUT } from "../service";
import type { Ujian } from "src/server/models/peserta";


export const UjianService = {
    getUjian: () => GET<Ujian[]>({ url: "/api/ujian" }),
    createUjian: (body: FormUjianInput) => POST({ url: "/api/ujian", body: body }),
    updateUjian: (body: FormUjianInput) => PUT({ url: "/api/ujian", body: body }),
    deleteUjian: (id:string) => DELETE({ url: `/api/ujian/${id}` }),
}