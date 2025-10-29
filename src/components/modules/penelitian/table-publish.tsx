import Button from "@solid-ui/Button";
import { Table } from "@solid-ui/Table";
import { createSignal, onMount } from "solid-js";
import { PenelitianService } from "src/client/service/penelitian"
import { getStatusPenelitianNama, StatusPenelitian, type Penelitian } from "src/helpers/dto/penelitian";
import { route } from "src/helpers/lib/route";


export default function PenelitianPublishData() {


    const [data, setData] = createSignal<Penelitian[]>([]);
    const [loading, setLoading] = createSignal(false);

    const getData = async () => {
        setLoading(true);
        const data = await PenelitianService.getPenelitianEtik()

        const result = data.data?.map((dt) => {
            dt.status_nama = getStatusPenelitianNama(dt.status as number)
            return dt
        }) ?? []

        setData(result)

        setLoading(false);
    }


    onMount(async () => {
        getData()
    })


    const setApproval = async (row:Penelitian, status:StatusPenelitian) => {
        await PenelitianService.approvalEtikPenelitian(row.id, status)
        getData()
    }

    return <div class="p-4">
        <Table
            columns={[
                { key: "no_idx", header: "No", width: "10px" },
                { key: "status_nama", header: "Status" },
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
                {
                    label: "Terima",
                    icon: "delete",
                    class: "bg-green-500 text-white hover:bg-green-600",
                    onClick: (row) => {
                        setApproval(row, StatusPenelitian.TerimaPenelitian)
                    },
                    // disabled: (row) => row.status != "DRAFT"
                    // hidden: (row) => row.id === "f130fdfb-1e12-49b5-9fa2-a3058185bf35",     // ❌ user id=2 tombol delete disembunyikan
                },
                {
                    label: "Tolak",
                    icon: "delete",
                    class: "bg-red-500 text-white hover:bg-red-600",
                    onClick: (row) => {
                        setApproval(row, StatusPenelitian.TolakPenelitian)
                    },
                    // disabled: (row) => row.status != "DRAFT"
                    // hidden: (row) => row.id === "f130fdfb-1e12-49b5-9fa2-a3058185bf35",     // ❌ user id=2 tombol delete disembunyikan
                },
            ]}
        />
    </div>;
}