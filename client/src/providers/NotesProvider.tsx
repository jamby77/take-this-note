/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useClerkMutation, useClerkQuery } from "../useClerkQuery.ts";
import { editorState, Note } from "../components/notes/NoteTypes.ts";

type InsertNote = Pick<Note, "title" | "content">;

interface NotesContextType {
  status: "pending" | "error" | "success";
  error: Error | null;
  isEditing: boolean;
  onDelete: (noteId: number, onSuccess?: () => void, onError?: () => void) => void;
  onUpdate: (
    noteId: number,
    note: InsertNote,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void;
  onCreate: (note: InsertNote, onSuccess?: () => void, onError?: () => void) => void;
  onStartEdit: (note: Note) => void;
  onStopEdit: () => void;
  notes?: Note[];
  currentNote?: Note;
}
export const NotesContext = createContext<NotesContextType>({
  status: "pending",
  error: null,
  notes: [],
  isEditing: false,
  onDelete: (_: number) => {},
  onUpdate: (_: number, __: InsertNote) => {},
  onCreate: (_: InsertNote) => {},
  onStartEdit: (_: Note) => {},
  onStopEdit: () => {},
  currentNote: undefined,
});

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [edit, setEditState] = useState<editorState>("closed");
  const [currentNote, setCurrentNote] = useState<Note>();
  const [error, setError] = useState<Error | null>(null);

  const mu = useClerkMutation(
    () => {
      setCurrentNote(undefined);
      setError(null);
    },
    (error) => {
      setError(error);
    },
  );

  const handleCreate = (note: InsertNote, onSuccess?: () => void, onError?: () => void) => {
    mu.mutate(
      {
        url: "api/notes",
        method: "POST",
        data: note,
      },
      { onError, onSuccess },
    );
  };

  const handleDelete = (noteId: number, onSuccess?: () => void, onError?: () => void) => {
    mu.mutate(
      {
        url: `api/notes/${noteId}`,
        method: "DELETE",
      },
      { onError, onSuccess },
    );
  };
  const handleUpdate = (
    noteId: number,
    note: InsertNote,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    mu.mutate(
      {
        url: `api/notes/${noteId}`,
        method: "PUT",
        data: note,
      },
      { onError, onSuccess },
    );
  };

  const handleStartEdit = (note: Note) => {
    setCurrentNote(note);
    setEditState("open");
  };

  const handleStopEdit = () => {
    setCurrentNote(undefined);
    setEditState("closed");
  };

  const { status, error: queryError, data: notes } = useClerkQuery<Note[]>("api/notes");
  useEffect(() => {
    if (queryError) {
      setError(queryError);
    }
  }, [queryError]);
  return (
    <NotesContext.Provider
      value={{
        status,
        error,
        notes,
        currentNote,
        isEditing: edit === "open",
        onStartEdit: handleStartEdit,
        onStopEdit: handleStopEdit,
        onDelete: handleDelete,
        onUpdate: handleUpdate,
        onCreate: handleCreate,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export function useNotes() {
  return useContext(NotesContext);
}
