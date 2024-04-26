import { useContext } from "react";
import { NotesContext } from "./NotesProvider.tsx";

export function useNotes() {
  return useContext(NotesContext);
}
