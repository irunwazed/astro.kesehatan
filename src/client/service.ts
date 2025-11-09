import { showAlert } from "@solid-ui/alertStore"
import type { ResponseAPI } from "src/helpers/dto/peserta"
import { HTTP_DELETE, HTTP_GET, HTTP_POST, HTTP_PUT } from "src/helpers/lib/request"
import { getToken } from "src/helpers/lib/storage"


export const HTTP = async <T>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, body?: any): Promise<T> => {
    const token = getToken()
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Tambahkan Authorization jika token ada
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        if (res.status >= 500) {
            showAlert({
                icon: "error",
                title: "ERROR",
                message: "Internal Server Error",
            })
        } else if (res.status == 404 && method != "GET") {
            showAlert({
                icon: "warning",
                title: "Perhatian",
                message: res.statusText,
            })
        } else if (res.status >= 400 && res.status != 404) {
            showAlert({
                icon: "warning",
                title: "Perhatian",
                message: res.statusText,
            })
        }
    }

    const result: T = await res.json()
    const data = result as ResponseAPI<any>

    try {
        console.log("data2", data)
        if (data?.status) {
            if (data?.status >= 500) {
                showAlert({
                    icon: "error",
                    title: "ERROR",
                    message: "Internal Server Error",
                })
            } else if (data.status == 404 && method != "GET") {
                showAlert({
                    icon: "warning",
                    title: "Perhatian",
                    message: data?.message ?? "Bad Request",
                })
            } else if (data.status >= 400 && data.status != 404) {
                showAlert({
                    icon: "warning",
                    title: "Perhatian",
                    message: data?.message ?? "Bad Request",
                })
            }
        }

    } catch (err) {
        console.log("ERR", err)
    }


    return result;
}

export const GET = async <T = unknown>(payload: {
    url: string,
}): Promise<ResponseAPI<T>> => {
    return HTTP<ResponseAPI<T>>("GET", payload.url)
}

export const POST = async <T = unknown>(payload: {
    url: string,
    body: unknown
}): Promise<ResponseAPI<T>> => {
    return HTTP<ResponseAPI<T>>("POST", payload.url, payload.body)
}

export const PUT = async <T = unknown>(payload: {
    url: string,
    body: unknown
}): Promise<ResponseAPI<T>> => {
    return HTTP<ResponseAPI<T>>("PUT", payload.url, payload.body)
}

export const DELETE = async <T = unknown>(payload: {
    url: string
}): Promise<ResponseAPI<T>> => {
    return HTTP<ResponseAPI<T>>("DELETE", payload.url)
}

export const HTTPUpload = async (url: string, formData: FormData) => {
  const token = getToken()
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating penelitian:', error);
    throw error;
  }
}