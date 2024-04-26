import Grid from "@mui/material/Unstable_Grid2";
import { NoteCard } from "./NoteCard.tsx";
import { Note } from "./NoteTypes.ts";
import { LoadingIndicator } from "../LoadingIndicator.tsx";
import { EditNote } from "./EditNote.tsx";
import { Box, Typography } from "@mui/material";
import { useNotes } from "../../providers/UseNotes.tsx";
import { useClerkQuery } from "../../useClerkQuery.ts";
import { useEffect } from "react";
import { ReducerActionsEnum } from "../../providers/NotesProvider.tsx";

export function NotesList() {
  const { status, error, notes, dispatch, currentSearch } = useNotes();
  let url = "api/notes";
  if (currentSearch) {
    url += `?q=${currentSearch}`;
  }
  const result = useClerkQuery<Note[]>(url);
  useEffect(() => {
    const { error: queryError, status, data } = result;
    if (queryError) {
      dispatch && dispatch({ type: ReducerActionsEnum.QUERY_ERROR, value: queryError });
    }
    if (data) {
      dispatch && dispatch({ type: ReducerActionsEnum.SET_NOTES, value: data });
    }
    dispatch && dispatch({ type: ReducerActionsEnum.SET_STATUS, value: status });
  }, [result.status, result.data, result.error, dispatch]);
  return (
    <Box>
      {status === "pending" && <LoadingIndicator />}
      {status === "error" && error && <Typography color="error">Error: {error.message}</Typography>}
      {status === "success" && notes && Array.isArray(notes) && (
        <Grid container spacing={2} py={4}>
          {notes.map((note: Note) => (
            <Grid key={note.id} xl={4} md={2} xs={1}>
              <NoteCard note={note} key={note.id} />
            </Grid>
          ))}
        </Grid>
      )}
      <EditNote />
    </Box>
  );
}
