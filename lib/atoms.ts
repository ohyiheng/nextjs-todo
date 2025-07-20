import { atom } from "jotai";
import { Project } from "./definitions";

export const activeProjectAtom = atom<Project | null>(null);
export const editingProjectAtom = atom<Project | null>(null);

export const addTaskDialogOpenAtom = atom(false);
export const projectEditOpenAtom = atom(true);