import postgres from "postgres";

const sql = postgres(
    "postgres://postgres:example@localhost:5432/postgres",
    { 
        transform: { 
            ...postgres.camel,
            undefined: null
        },
        max: 10
    },
);

export default sql;