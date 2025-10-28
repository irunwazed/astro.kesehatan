

const push = (path:string) => {
    window.location.href = path
}

const download = (path:string) => {  
    const url = "/api/download?path=" + encodeURIComponent(path);
  window.open(url, "_blank"); // 🔥 buka di tab baru
}



export const route = { push, download}