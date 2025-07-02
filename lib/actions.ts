"use server";

import { z } from "zod/v4";
import { TaskFormSchema } from "@/components/app/task-form";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTaskNodeById } from "./utils";

const sql = postgres(
    "postgres://postgres:example@localhost:5432/postgres",
    {
        idle_timeout: 10,
        transform: {
            ...postgres.camel,
            undefined: null
        },
        max: 100
    },
);

export async function updateTask(task: z.infer<typeof TaskFormSchema>) {
    try {
        await sql`UPDATE tasks SET
            name = ${task.name},
            description = ${task.description}
            WHERE id = ${task.id}`;
    } catch (error) {
        console.error(error);
    }
    revalidatePath("/app/inbox");
    revalidatePath("/app/project/[id]", "page");
}