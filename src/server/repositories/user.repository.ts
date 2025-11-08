// import { createClient } from "@supabase/supabase-js";

import { supabase } from "../configs/db"

// const supabase = createClient(import.meta.env.SUPABASE_URL || "", import.meta.env.SUPABASE_KEY || "")

// const supabaseAdmin = createClient(import.meta.env.SUPABASE_URL || "", import.meta.env.SUPABASE_KEY || "")

export class UserRepository {

    async getAuth(req: Request) {

        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }
        const token = authHeader.split(' ')[1];
        const dataUser = await supabase.auth.getUser(token);
        if (dataUser.error || !dataUser.data.user) {
            return null
        }

        return dataUser.data.user
    }

    async register(email: string, password: string, fullName: string, roles: string[] = ["user"]) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "https://your-app.com/welcome",
                data: { full_name: fullName, roles: roles }, // otomatis masuk ke auth metadata
            },
        })


        if (error) return false
        console.log('User terdaftar:', data.user)

        // Tambahkan ke tabel profiles
        const regisProfile = await supabase.from('profiles').insert([{ id: data?.user?.id ?? "", full_name: fullName, roles: roles, status: 1 }])
        console.log("regisProfile", regisProfile)


        //    const confirm = await supabaseAdmin.auth.admin.updateUserById(data?.user?.id ?? "", {
        //         email_confirm: true,
        //     })
        //     console.log("confirm", confirm)
        return true
    }

    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) return null // { message: error.message }
        console.log('Login sukses:', data.session)
        return data.session
    }

    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Logout gagal:', error.message)
        else console.log('Logout sukses!')
    }


    async getProfiles() {
        const { data, error } = await supabase.from('profiles').select('*')
        if (error) console.error('Gagal ambil data:', error.message)
        else console.table(data)
    }

    async updateProfile(fullName: string, role: string) {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName, role: role })
            .eq('id', user?.id)

        if (error) console.error('Gagal update:', error.message)
        else console.log('Profil diperbarui')
    }
}