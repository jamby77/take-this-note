/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment */
import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { useClerkMutation } from "../useClerkQuery.ts";
import { Note } from "../components/notes/NoteTypes.ts";
import { parseNote, TagValidation } from "../shared/validations.ts";

type InsertNote = Pick<Note, "title" | "content">;

interface NotesContextType {
  /**
   *  loading status from server request
   **/
  status: "pending" | "error" | "success";
  /**
   * Any errors
   */
  error?: Error | null;
  /**
   * is editing dialog open
   */
  isEditing: boolean;
  /**
   * Notes loaded from server
   */
  notes?: Note[];
  tags?: TagValidation[];
  /**
   * currently selected note
   */
  currentNote?: Note;
  /**
   * currently selected tag
   */
  currentTag?: TagValidation;
  /**
   * currently selected note's tags
   */
  currentTags?: TagValidation[];
  /**
   * currently search string
   */
  currentSearch?: string;
  dispatch?: Dispatch<any>;
  /**
   * Perform note create
   */
  onCreateNote: (note: InsertNote, onSuccess?: () => void, onError?: () => void) => void;
  /**
   * Perform note update
   */
  onUpdateNote: (
    noteId: number,
    note: InsertNote,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void;
  /**
   * Perform note delete
   */
  onDeleteNote: (noteId: number, onSuccess?: () => void, onError?: () => void) => void;
  /**
   * Start editing note
   */
  onStartEditNote: (note: Note) => void;
  /**
   * Stop editing note
   */
  onStopEditNote: () => void;
  /**
   * handle note search
   */
  onNotesSearch: (search: string) => void;
  /**
   * Handle tags change
   */
  onTagsChange: (tags: (string | TagValidation)[]) => void;
  /**
   * handle filter by tag
   */
  onTagFilter: (tag: string) => void;
}

const defaultContextValue: NotesContextType = {
  status: "pending",
  error: null,
  notes: [],
  tags: [],
  isEditing: false,
  currentNote: undefined,
  currentTag: undefined,
  currentTags: [],
  currentSearch: undefined,
  onDeleteNote: (_: number) => {
    throw new Error("Function not implemented.");
  },
  onUpdateNote: (_: number, __: InsertNote) => {
    throw new Error("Function not implemented.");
  },
  onCreateNote: (_: InsertNote) => {
    throw new Error("Function not implemented.");
  },
  onStartEditNote: (_: Note) => {
    throw new Error("Function not implemented.");
  },
  onStopEditNote: () => {
    throw new Error("Function not implemented.");
  },
  onNotesSearch: function (search: string): void {
    throw new Error("Function not implemented." + search);
  },
  onTagsChange: function (tags: (string | TagValidation)[]): void {
    throw new Error("Function not implemented." + tags);
  },
  onTagFilter: function (tag: string): void {
    throw new Error("Function not implemented." + tag);
  },
};
export const NotesContext = createContext<NotesContextType>(defaultContextValue);

export enum ReducerActionsEnum {
  MUTATION_SUCCESS,
  MUTATION_ERROR,
  EDIT_START,
  EDIT_STOP,
  QUERY_ERROR,
  CREATE_ERROR,
  SET_SEARCH,
  SET_CURRENT_TAGS,
  SET_NOTE,
  SET_TAG,
  SET_NOTES,
  SET_TAGS,
  SET_STATUS,
}

type NotesReducerStateType = Omit<
  NotesContextType,
  | "onCreateNote"
  | "onUpdateNote"
  | "onDeleteNote"
  | "onStartEditNote"
  | "onStopEditNote"
  | "onTagFilter"
  | "onNotesSearch"
  | "onTagsChange"
>;
// type NotesReducerActionValueType = unknown | null;
type NotesReducerActionType = {
  type: ReducerActionsEnum;
  value?: any;
};

const initialState: NotesReducerStateType = {
  status: "pending",
  error: null,
  notes: [],
  isEditing: false,
  currentNote: undefined,
  currentTag: undefined,
  currentSearch: undefined,
  currentTags: [],
};
function notesReducer(state: NotesReducerStateType, action: NotesReducerActionType) {
  switch (action.type) {
    case ReducerActionsEnum.SET_SEARCH:
      return {
        ...state,
        currentSearch: action.value,
      };
    case ReducerActionsEnum.SET_CURRENT_TAGS:
      return {
        ...state,
        currentTags: action.value,
      };
    case ReducerActionsEnum.SET_NOTE:
      return {
        ...state,
        currentNote: action.value,
      };
    case ReducerActionsEnum.SET_TAG:
      if (action.value.name === "All") {
        return {
          ...state,
          currentTag: undefined,
        };
      }
      return {
        ...state,
        currentTag: action.value,
      };
    case ReducerActionsEnum.SET_NOTES:
      return {
        ...state,
        notes: action.value,
      };
    case ReducerActionsEnum.MUTATION_SUCCESS:
      return {
        ...state,
        currentNote: undefined,
        error: null,
      };
    case ReducerActionsEnum.MUTATION_ERROR:
    case ReducerActionsEnum.CREATE_ERROR:
    case ReducerActionsEnum.QUERY_ERROR:
      return {
        ...state,
        error: action.value,
      };
    case ReducerActionsEnum.EDIT_START:
      let { tags = [] } = action.value;
      if (tags.length > 0) {
        // @ts-ignore
        tags = tags.map((tag) => {
          if (typeof tag === "string") {
            return { name: tag };
          }
          return tag;
        });
      }
      return {
        ...state,
        currentNote: action.value,
        currentTags: tags,
        isEditing: true,
      };
    case ReducerActionsEnum.EDIT_STOP:
      return {
        ...state,
        currentNote: undefined,
        isEditing: false,
      };
    case ReducerActionsEnum.SET_STATUS:
      return {
        ...state,
        status: action.value,
      };
    case ReducerActionsEnum.SET_TAGS:
      return {
        ...state,
        tags: action.value,
      };
  }
  return state;
}

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const mu = useClerkMutation(
    () => {
      dispatch({ type: ReducerActionsEnum.MUTATION_SUCCESS });
    },
    (error) => {
      dispatch({ type: ReducerActionsEnum.MUTATION_SUCCESS, value: error });
    },
  );

  const handleNoteCreate = (newNote: InsertNote, onSuccess?: () => void, onError?: () => void) => {
    const validationResult = parseNote(newNote);
    if (!validationResult.success) {
      dispatch({
        type: ReducerActionsEnum.CREATE_ERROR,
        value: validationResult.error,
      });
      onError && onError();
      return;
    }
    mu.mutate(
      {
        url: "api/notes",
        method: "POST",
        data: validationResult.data,
      },
      { onError, onSuccess },
    );
  };

  const handleNoteDelete = (noteId: number, onSuccess?: () => void, onError?: () => void) => {
    mu.mutate(
      {
        url: `api/notes/${noteId}`,
        method: "DELETE",
      },
      { onError, onSuccess },
    );
  };

  const handleNoteUpdate = (
    noteId: number,
    newNote: InsertNote,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    const validationResult = parseNote(newNote);
    if (!validationResult.success) {
      dispatch({
        type: ReducerActionsEnum.CREATE_ERROR,
        value: validationResult.error,
      });
      onError && onError();
      return;
    }
    mu.mutate(
      {
        url: `api/notes/${noteId}`,
        method: "PUT",
        data: validationResult.data,
      },
      { onError, onSuccess },
    );
  };

  const handleStartNoteEdit = (note: Note) => {
    dispatch({ type: ReducerActionsEnum.EDIT_START, value: note });
  };

  const handleStopEdit = () => {
    dispatch({ type: ReducerActionsEnum.EDIT_STOP });
  };

  const handleSearch = (search: string) => {
    dispatch({ type: ReducerActionsEnum.SET_SEARCH, value: search });
  };

  const handleFilterByTag = (tag: string) => {
    dispatch({ type: ReducerActionsEnum.SET_TAG, value: tag });
  };

  const handleSetTags = (tags: (string | TagValidation)[]) => {
    dispatch({ type: ReducerActionsEnum.SET_CURRENT_TAGS, value: tags });
  };

  return (
    <NotesContext.Provider
      value={{
        ...state,
        onStartEditNote: handleStartNoteEdit,
        onStopEditNote: handleStopEdit,
        onDeleteNote: handleNoteDelete,
        onUpdateNote: handleNoteUpdate,
        onCreateNote: handleNoteCreate,
        onNotesSearch: handleSearch,
        onTagFilter: handleFilterByTag,
        onTagsChange: handleSetTags,
        dispatch,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
