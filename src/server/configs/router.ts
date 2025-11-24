import { HomeController } from "../controllers/home";
// import { LoginController } from "../controllers/login";
import { PenelitianController } from "../controllers/penelitian";
import { StorageController } from "../controllers/storage";
import { UserController } from "../controllers/user";


const penelitan = new PenelitianController()
const storage = new StorageController()
const user = new UserController()

type Handler = (req: Request, params: Record<string, string>) => Promise<Response> | Response;
const routes = new Map<string, Handler>();

routes.set('GET:/', HomeController);
routes.set('POST:/login', user.login);
routes.set('POST:/register', user.register);

routes.set('GET:/penelitian', penelitan.getPenelitianUser);
routes.set('GET:/penelitian/notif', penelitan.getNotifikasi);
routes.set('GET:/penelitian/data', penelitan.getPenelitianById);
routes.set('POST:/penelitian', penelitan.insertPenelitianBerkas);
routes.set('POST:/penelitian-awal', penelitan.insertPenelitian);
routes.set('POST:/penelitian-perpanjang', penelitan.insertPenelitianPerpanjang);


routes.set('POST:/penelitian/update-status', penelitan.updateStatusPenelitian);

routes.set('POST:/penelitian/amandemen', penelitan.uploadAmandemen);

// getKomiteEtik
routes.set('GET:/get/komite-etik', penelitan.getKomiteEtik);

routes.set('GET:/penelitian/list', penelitan.getPenelitianApproval);
routes.set('POST:/penelitian/approval', penelitan.approvalPenelitian);
routes.set('POST:/penelitian/izin', penelitan.izinPenelitian);

routes.set('GET:/penelitian/etik', penelitan.getPenelitianEtik);
routes.set('POST:/penelitian/etik/approval', penelitan.approvalEtikPenelitian);
routes.set('POST:/penelitian/etik/telaah', penelitan.telaahEtikPenelitian);

routes.set('GET:/penelitian/telaah', penelitan.getPenelitianTelaah);
routes.set('POST:/penelitian/telaah/approval', penelitan.approvalTelaahPenelitian);

routes.set('GET:/download', storage.download);

// Register route GET /api/users/:id (dynamic param)
routes.set('GET:/users/:id', (req, params) => {
    const userId = params.id;
    return new Response(
        JSON.stringify({ userId, message: `User data for ID ${userId}` }),
        { headers: { 'Content-Type': 'application/json' } }
    );
});

export const ROUTES = routes
