import { Pool } from 'pg'

export const db = new Pool({
    user: "postgres",
    host: "localhost",
    password: "habil",
    port: 5432,
    database: "personal_web_database",
    max:5

})
