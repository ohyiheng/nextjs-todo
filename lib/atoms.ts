import { atom } from "jotai";
import { Project } from "./definitions";

export const addTaskDialogOpenAtom = atom(false);

export const activeProjectAtom = atom<Project | null>(null);
export const editingProjectAtom = atom<Project | null>(null);
export const projectAddOpenAtom = atom(false);
export const projectEditOpenAtom = atom(false);

export const activeTagAtom = atom<string | null>(null);
export const editingTagAtom = atom<string | null>(null);
export const tagEditOpenAtom = atom(false);