import { sequence } from "astro/middleware";
import { role } from "./role";

export const onRequest = sequence(role);
