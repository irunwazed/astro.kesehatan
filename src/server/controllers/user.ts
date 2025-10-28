import { UserRepository } from "../repositories/user.repository";


type LoginRequest = {
    email: string
    password: string
}


export class UserController {

    constructor() {
    }

    async register(req: Request) {

    }

    async login(req: Request) {
        const repository = new UserRepository();
        const { email, password } = await req.json();
        const login = await repository.login(email, password)

        if (!login) return new Response(JSON.stringify({
            status: false,
            message: 'salah akun',
        }), { status: 400 });

        return new Response(JSON.stringify({
            status: true,
            data: login,
        }), { status: 200 });
    }

}