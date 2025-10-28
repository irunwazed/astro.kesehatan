import Button from "@solid-ui/Button";
import { Table } from "@solid-ui/Table";
import { createSignal, onMount } from "solid-js";
import { PenelitianService } from "src/client/service/penelitian"
import type { Penelitian } from "src/helpers/dto/penelitian";
import { route } from "src/helpers/lib/route";


export default function PenelitianData() {


    const [data, setData] = createSignal<Penelitian[]>([]);
    const [loading, setLoading] = createSignal(false);

    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianUser()
        console.log("data", data.data![0])
        setData(data.data ?? [])

        setLoading(false);
    }


    onMount(async () => {
        getData()
    })

    return <div class="p-4">

        <Button onclick={() => {
            route.push("/app/penelitian/awal")
        }}>Ajukan Permohonan Penelitian</Button>
        <br />
        <Table
            columns={[
                { key: "no_idx", header: "No", width: "10px" },
                { key: "status", header: "Status" },
                { key: "nama", header: "Nama" },
                { key: "deskripsi", header: "deskripsi" },
                { key: "tujuan", header: "tujuan" },
            ]}
            data={data()}
            loading={loading()}
            files={[
                {
                    label: "Draf Penelitian",
                    icon: "download",
                    class: "bg-red-500 text-white hover:bg-red-600",
                    onClick: (row) => {
                        route.download(row.file_draft_penelitian ?? "")
                    }
                },
                {
                    label: "Surat Permohonan Instansi",
                    icon: "download",
                    class: "bg-red-500 text-white hover:bg-red-600",
                    onClick: (row) => {
                        route.download(row.file_permohonan_instansi ?? "")
                    }
                },
            ]}

            actions={[
                // {
                //     label: "Delete",
                //     icon: "delete",
                //     class: "bg-red-500 text-white hover:bg-red-600",
                //     onClick: deleteData,
                //     disabled: (row) => row.status != "DRAFT"
                //     // hidden: (row) => row.id === "f130fdfb-1e12-49b5-9fa2-a3058185bf35",     // ❌ user id=2 tombol delete disembunyikan
                // },
                // {
                //     label: "Reset Password",
                //     icon: "update",
                //     class: "bg-red-500 text-white hover:bg-red-600",
                //     onClick: resetPassword,
                //     disabled: (row) => row.status == "ROLLBACK"
                //     // hidden: (row) => row.id === "f130fdfb-1e12-49b5-9fa2-a3058185bf35",     // ❌ user id=2 tombol delete disembunyikan
                // },
            ]}
        />
    </div>;
}