import { getRefreshToken, getToken } from "./storage";


// Decode JWT payload dari base64
const decodeJwtPayload = (token: string): { exp: number; [key: string]: any } | null => {
    try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return null;

        // Decode Base64 URL-safe
        const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Gagal decode JWT", error);
        return null;
    }
};

// Refresh token ke Keycloak menggunakan fetch
const refreshKeycloakToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token found");

    const body = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: import.meta.env.PUBLIC_SSO_CLIENT_ID,
        refresh_token: refreshToken,
    });

    const response = await fetch(
        `${import.meta.env.PUBLIC_SSO_URL}/realms/${import.meta.env.PUBLIC_SSO_REALM}/protocol/openid-connect/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        }
    );

    if (!response.ok) {
        throw new Error(`Refresh token failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const { access_token, refresh_token: newRefreshToken } = data;

    

    return data;
};

// Fungsi utama refreshToken
export const refreshToken = async (): Promise<any | null> => {
    const token = getToken();
    if (!token) return null;

    const decoded = decodeJwtPayload(token);
    console.log("decoded", decoded)
    if (!decoded) return null;

    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;
    const expired = (decoded.exp  - now - (10*60*60) - (15*60))
    console.log("decoded.exp - now < fiveMinutes",expired, fiveMinutes)

    if (expired < fiveMinutes) {
        console.log("Token hampir expired, melakukan refresh...");
        return await refreshKeycloakToken();
    }

    return token;
};
