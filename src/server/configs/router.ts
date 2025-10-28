import { HomeController } from "../controllers/home";
import { LoginController } from "../controllers/login";
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

routes.set('GET:/penelitian', penelitan.getPenelitianUser);
routes.set('POST:/penelitian-awal', penelitan.insertPenelitian);
routes.set('POST:/penelitian', penelitan.updatePenelitian);

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
