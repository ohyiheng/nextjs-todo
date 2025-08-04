import postgres from "postgres";

let { POSTGRES_USER } = process.env;
const { POSTGRES_PASSWORD, POSTGRES_CONTAINER_NAME } = process.env;

if (!POSTGRES_USER) POSTGRES_USER = "postgres";
if (!POSTGRES_PASSWORD) {
    throw new Error("POSTGRES_PASSWORD is not set")
}

const sql = postgres(
    `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER_NAME}:5432/postgres`,
    {
        idle_timeout: 10,
        transform: {
            ...postgres.camel,
        },
        max: 10
    },
);

async function seedUsers() {
    await sql`CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL
    )`;
}

async function seedSessions() {
    await sql`CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        secret_hash BYTEA NOT NULL,
        created_at INTEGER NOT NULL,
        username TEXT NOT NULL REFERENCES users(username)
    )`;
}

async function seedProjects() {
    // await sql`DROP TABLE IF EXISTS projects CASCADE`;
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        last_modified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        sort_by TEXT DEFAULT 'priority' CHECK (sort_by IN ('priority', 'start', 'due', 'name')) NOT NULL,
        sort_order TEXT DEFAULT 'desc' CHECK (sort_order IN ('asc', 'desc')) NOT NULL,
        is_inbox BOOLEAN DEFAULT FALSE NOT NULL,
        owner TEXT REFERENCES users(username) ON DELETE CASCADE NOT NULL
    )`;
}

async function seedTasks() {
    // await sql`DROP TABLE IF EXISTS tasks CASCADE`;

    await sql`
    CREATE TABLE IF NOT EXISTS tasks (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        last_modified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        priority CHAR(1) DEFAULT '0' NOT NULL,
        description TEXT,
        start_date TIMESTAMPTZ,
        start_time TIME WITH TIME ZONE,
        due_date DATE,
        due_time TIME WITH TIME ZONE,
        parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        project_id INT DEFAULT 1 REFERENCES projects(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT false NOT NULL
    )
  `;
}

async function seedTags() {
    // await sql`DROP TABLE IF EXISTS tags CASCADE`;

    await sql`CREATE TABLE IF NOT EXISTS tags (
        id TEXT,
        owner TEXT REFERENCES users(username) ON DELETE CASCADE,
        PRIMARY KEY (id, owner)
    )`;
}

async function seedTasksTags() {
    // await sql`DROP TABLE IF EXISTS tasks_tags CASCADE`;

    await sql`CREATE TABLE IF NOT EXISTS tasks_tags (
        task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        tag_id TEXT,
        tag_owner TEXT,

        PRIMARY KEY (task_id, tag_id, tag_owner),
        FOREIGN KEY (tag_id, tag_owner) REFERENCES tags(id, owner)
    )`;

    await sql`CREATE OR REPLACE FUNCTION check_tag_owner()
        RETURNS TRIGGER AS $$
        DECLARE
            task_owner TEXT;
        BEGIN
            SELECT projects.owner INTO task_owner
            FROM tasks JOIN projects ON (tasks.project_id = projects.id)
            WHERE tasks.id = NEW.task_id;

            IF NOT task_owner = NEW.tag_owner THEN
                RAISE EXCEPTION 'Tag owner does not match task owner';
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `

    await sql`CREATE OR REPLACE TRIGGER check_tag_owner_before_insert
        BEFORE INSERT ON tasks_tags
        FOR EACH ROW
        EXECUTE FUNCTION check_tag_owner();
    `
}

try {
    await sql.begin(async () => {
        await seedUsers();
        await seedSessions();
        await seedProjects();
        await seedTasks();
        await seedTags();
        await seedTasksTags();
    });
} catch (error) {
    console.log(error);
}
