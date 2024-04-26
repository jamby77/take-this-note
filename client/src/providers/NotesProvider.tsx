/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useEffect, useReducer } from "react";
import { useClerkMutation, useClerkQuery } from "../useClerkQuery.ts";
import { Note } from "../components/notes/NoteTypes.ts";

type InsertNote = Pick<Note, "title" | "content">;

interface NotesContextType {
  status: "pending" | "error" | "success";
  error?: Error | null;
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
  currentTag?: string;
  currentSearch?: string;
}

const defaultContextValue: NotesContextType = {
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
  currentTag: undefined,
  currentSearch: undefined,
};
export const NotesContext = createContext<NotesContextType>(defaultContextValue);

const initialState: NotesReducerStateType = {
  status: "pending",
  error: null,
  notes: [],
  isEditing: false,
  currentNote: undefined,
  currentTag: undefined,
  currentSearch: undefined,
};

enum ReducerActionsEnum {
  MUTATION_SUCCESS,
  MUTATION_ERROR,
  EDIT_START,
  EDIT_STOP,
  QUERY_ERROR,
}

type NotesReducerStateType = Omit<
  NotesContextType,
  "onCreate" | "onUpdate" | "onDelete" | "onStartEdit" | "onStopEdit"
>;
type NotesReducerActionValueType = unknown | null;
type NotesReducerActionType = {
  type: ReducerActionsEnum;
  value?: NotesReducerActionValueType;
};

// @ts-ignore
function notesReducer(state: NotesReducerStateType, action: NotesReducerActionType) {
  switch (action.type) {
    case ReducerActionsEnum.MUTATION_SUCCESS:
      return {
        ...state,
        currentNote: undefined,
        error: null,
      };
    case ReducerActionsEnum.MUTATION_ERROR:
    case ReducerActionsEnum.QUERY_ERROR:
      return {
        ...state,
        error: action.value,
      };
    case ReducerActionsEnum.EDIT_START:
      return {
        ...state,
        currentNote: action.value,
        isEditing: true,
      };
    case ReducerActionsEnum.EDIT_STOP:
      return {
        ...state,
        currentNote: undefined,
        isEditing: false,
      };
  }
  return state;
}

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  // @ts-ignore
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { isEditing, currentNote, currentTag, currentSearch, error } = state;

  const mu = useClerkMutation(
    () => {
      // @ts-ignore
      dispatch({ type: ReducerActionsEnum.MUTATION_SUCCESS });
    },
    (error) => {
      // @ts-ignore
      dispatch({ type: ReducerActionsEnum.MUTATION_SUCCESS, value: error });
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
    // @ts-ignore
    dispatch({ type: ReducerActionsEnum.EDIT_START, value: note });
  };

  const handleStopEdit = () => {
    // @ts-ignore
    dispatch({ type: ReducerActionsEnum.EDIT_STOP });
  };

  const { status, error: queryError, data: notes } = useClerkQuery<Note[]>("api/notes");
  useEffect(() => {
    if (queryError) {
      // @ts-ignore
      dispatch({ type: ReducerActionsEnum.QUERY_ERROR, value: queryError });
    }
  }, [queryError]);
  return (
    <NotesContext.Provider
      value={{
        status,
        error,
        notes,
        currentNote,
        currentTag,
        currentSearch,
        isEditing,
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
