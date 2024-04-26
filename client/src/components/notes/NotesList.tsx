import Grid from "@mui/material/Unstable_Grid2";
import { NoteCard } from "./NoteCard.tsx";
import { Note } from "./NoteTypes.ts";
import { LoadingIndicator } from "../LoadingIndicator.tsx";
import { EditNote } from "./EditNote.tsx";
import { Box } from "@mui/material";
import { useNotes } from "../../providers/UseNotes.tsx";

export function NotesList() {
  const { status, error, notes } = useNotes();
  return (
    <Box>
      {status === "pending" && <LoadingIndicator />}
      {status === "error" && error && <div>Error: {error.message}</div>}
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
