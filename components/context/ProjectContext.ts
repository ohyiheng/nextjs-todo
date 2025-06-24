import { ProjectNode } from "@/lib/definitions";
import { createContext } from "react";

export const ProjectContext = createContext<ProjectNode[] | null>(null);