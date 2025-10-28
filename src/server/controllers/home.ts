import { HTTPResponse } from "src/helpers/lib/response"


export const HomeController = async (req: Request) => {

    return HTTPResponse({
        status: 200,
        message: "selamat datang w",
        data: []
    })
}