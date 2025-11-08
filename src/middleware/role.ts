
import { defineMiddleware } from "astro/middleware";
import { getUserFromToken } from "src/helpers/lib/jwt";

type RouterType = {
  path: string;
  name: string;
  icon: string;
  role: string[];
  children: {
    path: string;
    name: string;
    icon: string;
    role: string[];
    isShow: boolean;
  }[];
  isShow: boolean;
}

const ROUTES: RouterType[] = [
  {
    path: "/",
    name: "Home",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },
  {
    path: "/app",
    name: "FAQ",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },
  {
    path: "/app/download",
    name: "FAQ",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },
  {
    path: "/app/penelitian",
    name: "FAQ",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },
  {
    path: "/app/penelitian/awal",
    name: "FAQ",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },
  {
    path: "/app/penelitian/form1",
    name: "FAQ",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },
  {
    path: "/app/penelitian/inbox",
    name: "FAQ",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },
  {
    path: "/app/penelitian/perpanjang",
    name: "FAQ",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },
  {
    path: "/app/penelitian/publish",
    name: "FAQ",
    icon: "Home",
    role: ["*"],
    children: [],
    isShow: true,
  },

]




export const role = defineMiddleware((context, next) => {
  try {
    const url = context.request.url;
    const { pathname } = new URL(url);

    // by pass halaman utama
    if (pathname == "/") return next()
    if (pathname == "/login") return next()

    try {
      // API
      if (pathname.slice(0, 10) == "/api/login") return next()
    } catch (err) { }

    const authHeader = context.request.headers.get("authorization")?.replace("Bearer ", "") || "";
    const dataLogin = getUserFromToken(authHeader);

    let isLogin = false
    let isPath = false


    for (let i = 0; i < ROUTES.length; i++) {
      if (ROUTES[i]!.children.length == 0 && ROUTES[i]!.path == pathname) {
        isPath = true
        ROUTES[i]!.role.map(route => {
          if (route == "*") isLogin = true
          dataLogin?.roles.map(login => {
            if (route == login) isLogin = true
          })
        })
      } else {
        ROUTES[i]!.children.map(route => {
          if (route.path == pathname) {
            isPath = true
            route.role.map(r => {
              if (r == "*") isLogin = true
              dataLogin?.roles.map(login => {
                if (r == login) isLogin = true
              })
            })
          }
        })
      }
      if (isLogin || isPath) break
    }

    if (isLogin || !isPath) return next()
  } catch (err) {
    console.log("err midd", err)
  }

  return Response.redirect(new URL("/", context.url), 302);
});
