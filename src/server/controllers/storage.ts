import { downloadFile } from "../helpers/storage";


export class StorageController {
    //   private repository: StorageRepository;

    constructor() {
        // this.repository = new StorageRepository();
    }

    async download(request: Request) {

        const url = new URL(request.url);
        const filePath = url.searchParams.get('path');
        console.log("filePath", filePath)

        if (!filePath) {
            return new Response(JSON.stringify({
                status: false,
                message: 'Missing "path" parameter',
            }), { status: 400 });
        }
        const data = await downloadFile(filePath)
        if (!data) {
            return new Response(JSON.stringify({
                status: false,
                message: "gagal download",
            }), { status: 400 });
        }

        const blob = await data.arrayBuffer();

        return new Response(blob, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="document.pdf"',
                'Cache-Control': 'public, max-age=3600',
            },
        });

    }


}