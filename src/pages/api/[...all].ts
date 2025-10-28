export const prerender = false;
import type { APIRoute } from 'astro';
import { HTTPResponse } from 'src/helpers/lib/response';
import { ROUTES } from 'src/server/configs/router';

export const ALL: APIRoute = async ({ request, params }) => {
    const method = request.method.toUpperCase();
    const pathSegments = Array.isArray(params.all)
        ? params.all
        : typeof params.all === 'string'
            ? [params.all]
            : [];

    // Try exact match first
    const exactKey = `${method}:/${pathSegments.join('/')}`;
    if (ROUTES.has(exactKey)) {
        return ROUTES.get(exactKey)!(request, {});
    }

    // Try dynamic routes
    for (const [key, handler] of ROUTES.entries()) {
        if (!key.startsWith(method)) continue;

        const routePath = key.split(':')[1]; // e.g. "/users/:id"
        const routeSegments = routePath.slice(1).split('/'); // ['users', ':id']

        if (routeSegments.length !== pathSegments.length) continue;

        let matched = true;
        const paramsObj: Record<string, string> = {};

        for (let i = 0; i < routeSegments.length; i++) {
            if (routeSegments[i].startsWith(':')) {
                const paramName = routeSegments[i].slice(1);
                paramsObj[paramName] = pathSegments[i];
            } else if (routeSegments[i] !== pathSegments[i]) {
                matched = false;
                break;
            }
        }

        if (matched) {
            return handler(request, paramsObj);
        }
    }

    return HTTPResponse({
        status: 404,
        message: "Not Found"
    });
};