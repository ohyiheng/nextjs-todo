import postgres from "postgres";

const sql = postgres("postgres://postgres:example@localhost:5432/postgres");

export default sql;