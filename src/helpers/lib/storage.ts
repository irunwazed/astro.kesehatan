
// ===================== COOKIE FUNCTIONS =====================
export const setCookie = (name: string, value: string, minutes: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + minutes * 60 * 1000);
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + encodeURIComponent(name) + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

export const deleteCookie = (name: string) => {
    document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// ===================== LOCAL/STORAGE FUNCTIONS =====================
export const setStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key: string): any | null => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};

export const deleteStorage = (key: string) => {
    localStorage.removeItem(key);
};

// ===================== CLEAR ALL =====================
export const clearAllCookieStorage = () => {
    // Clear cookies
    document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Clear localStorage
    localStorage.clear();
};

export const getToken = () => {
    const auth = getCookie("token")
    return auth as string
}
// export const getRefreshToken = () => {
//     const auth = getStorage("auth")
//     return auth?.refresh_token as string
// }


// export const checkIsAuth = () => {
//     const session = getCookie("session")
//     const auth = getStorage("auth")

//     if(!session){
//         return false
//     }
//     if(!auth?.token){
//         return false
//     }

//     return true
// }
