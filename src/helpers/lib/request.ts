

export const readQuery = (req: Request): Record<string, string> => {
    const url = new URL(req.url);
    const query: Record<string, string> = {};
    url.searchParams.forEach((value: string, key: string) => {
        query[key] = value;
    });
    return query;
}



export async function HTTP_GET<T = unknown>(
    url: string,
    cookie?: string,
    options?: RequestInit
): Promise<T> {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { 'Cookie': cookie } : {}),
                ...(options?.headers || {}),
            },
            ...options,
        });
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        return res.json() as Promise<T>;
    } catch (err) { 
        console.log("error", err)
    }
    return {} as T
}

export async function HTTP_POST<T = unknown>(
    url: string,
    data: any,
    cookie?: string,
    options?: RequestInit
): Promise<T> {
    try {

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { 'Cookie': cookie } : {}),
                ...(options?.headers || {}),
            },
            body: JSON.stringify(data),
            ...options,
        });
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        return res.json() as Promise<T>;

    } catch (err) {

    }

    return {} as T
}


export async function HTTP_PUT<T = unknown>(
    url: string,
    data: any,
    cookie?: string,
    options?: RequestInit
): Promise<T> {
    try {

        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { 'Cookie': cookie } : {}),
                ...(options?.headers || {}),
            },
            body: JSON.stringify(data),
            ...options,
        });
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        return res.json() as Promise<T>;

    } catch (err) {

    }

    return {} as T
}


export async function HTTP_DELETE<T = unknown>(
    url: string,
    cookie?: string,
    options?: RequestInit
): Promise<T> {
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { 'Cookie': cookie } : {}),
                ...(options?.headers || {}),
            },
            ...options,
        });
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        return res.json() as Promise<T>;
    } catch (err) { 
        console.log("error", err)
    }
    return {} as T
}