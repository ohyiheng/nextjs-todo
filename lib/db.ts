import postgres from "postgres";

let { POSTGRES_USER } = process.env;
const { POSTGRES_PASSWORD, POSTGRES_HOSTNAME } = process.env;

if (!POSTGRES_USER) POSTGRES_USER = "postgres";
if (!POSTGRES_PASSWORD) {
    throw new Error("POSTGRES_PASSWORD is not set")
}

const sql = postgres(
    `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:5432/postgres`,
    {
        idle_timeout: 10,
        transform: {
            ...postgres.camel,
            undefined: null,
        },
        max: 10
    },
);

export default sql;