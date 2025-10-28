import { decodeJWT } from "src/middleware/jwt";


export const getAuthToken = (request: Request) => {
    const authHeader = request.headers.get('Authorization') ?? " ";
    const token = authHeader.split(' ')[1];
    const claims = decodeJWT(token);
    return claims
}