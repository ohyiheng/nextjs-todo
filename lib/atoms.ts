import { atom } from "jotai";
import { ProjectNode } from "./definitions";

export const activeProjectAtom = atom<ProjectNode | null>(null);