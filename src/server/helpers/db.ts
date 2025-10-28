import knex from "knex"

type configDB = {
    host: string
    port: number
    username: string
    password: string
    database: string
}

export const ConnectMySQL = (config: configDB) => {
    const db = knex({
        client: "mysql2",
        connection: {
            host: config.host,
            port: config.port,
            user: config.username,
            password: config.password,
            database: config.database,
        },
        pool: { min: 0, max: 10 },
    });

    console.log("tes db", {
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
    });

    return db
}

export const ConnectPG = (config: configDB) => {
    const db = knex({
        client: "pg",
        connection: {
            host: config.host,
            port: config.port,
            user: config.username,
            password: config.password,
            database: config.database,
        },
        pool: { min: 0, max: 10 },
    });

    console.log("tes db", {
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
    });

    return db
}