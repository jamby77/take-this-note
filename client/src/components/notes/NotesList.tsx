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
import { NoteTags } from "./NoteTags.tsx";

export function NotesList() {
  const { status, error, notes, dispatch, currentSearch, currentTag } = useNotes();
  const url = "api/notes";
  const searchParams = new URLSearchParams();
  if (currentSearch) {
    searchParams.append("q", currentSearch);
  }
  if (currentTag) {
    searchParams.append("tag", currentTag.name);
  }
  const result = useClerkQuery<Note[]>(url, searchParams);
  useEffect(() => {
    const { error: queryError, status, data } = result;
    if (queryError) {
      dispatch && dispatch({ type: ReducerActionsEnum.QUERY_ERROR, value: queryError });
    }
    if (data) {
      dispatch && dispatch({ type: ReducerActionsEnum.SET_NOTES, value: data });
    }
    dispatch && dispatch({ type: ReducerActionsEnum.SET_STATUS, value: status });
  }, [result.status, result.data, result.error]);

  return (
    <Box>
      <NoteTags />
      {status === "pending" && <LoadingIndicator />}
      {status === "error" && error && (
        <Typography align="center" py={4} variant="h3" color="error">
          Error: {error.message}
        </Typography>
      )}
      {status === "success" && notes && Array.isArray(notes) && (
        <Grid container spacing={{ xs: 1, md: 2 }} py={4}>
          {notes.map((note: Note) => (
            <Grid key={note.id} xl={3} md={4} sm={6} xs={12}>
              <NoteCard note={note} key={note.id} />
            </Grid>
          ))}
        </Grid>
      )}
      {status === "success" && notes?.length === 0 && (
        <Typography align="center" py={4} variant="h3" color="text.secondary">
          No notes found
        </Typography>
      )}
      <EditNote />
    </Box>
  );
}
