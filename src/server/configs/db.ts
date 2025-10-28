// import { ConnectPG } from "../helpers/db";

import { createClient } from "@supabase/supabase-js"

// console.log("emv", process!.env.DB_KEYCLOAK_HOST)

// export const dbKeycloak = ConnectPG({
//     host: import.meta.env.DB_KEYCLOAK_HOST || "localhost",
//     port: parseInt(import.meta.env.DB_KEYCLOAK_PORT || "") || 5432,
//     username: import.meta.env.DB_KEYCLOAK_USERNAME || "root",
//     password: import.meta.env.DB_KEYCLOAK_PASSWORD || "",
//     database: import.meta.env.DB_KEYCLOAK_NAME || "test_db",
// })

// export const dbDigital = ConnectPG({
//     host: import.meta.env.DB_DIGITAL_HOST || "localhost",
//     port: parseInt(import.meta.env.DB_DIGITAL_PORT || "") || 5432,
//     username: import.meta.env.DB_DIGITAL_USERNAME || "root",
//     password: import.meta.env.DB_DIGITAL_PASSWORD || "",
//     database: import.meta.env.DB_DIGITAL_NAME || "test_db",
// })


// export const createKeycloakTransaction = async () => {
//     return await dbKeycloak.transaction();
// };

// export const createDigitalTransaction = async () => {
//   return await dbDigital.transaction();
// };

export const supabase = createClient(import.meta.env.SUPABASE_URL || "", import.meta.env.SUPABASE_KEY || "")