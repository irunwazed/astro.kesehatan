import { DELETE, GET, POST, PUT } from "../service";
import type { FormResetPassword, FormUser, UserResponse } from "src/helpers/dto/user";


export const UserService = {
    getUser: (group_id:string, page:number, per_page:number) => GET<UserResponse[]>({ url: `/api/user?page=${page}&per_page=${per_page}&group_id=${group_id}` }),
    createUser: (body: FormUser) => POST({ url: "/api/user", body: body }),
    resetPasswordUser: (body:FormResetPassword) => PUT({ url: `/api/user/reset-password`, body: body }),
    deleteUser: (id:string) => DELETE({ url: `/api/user?id=${id}` }),
}