import { useClerkQuery } from "../../useClerkQuery.ts";
import { NoteCard } from "./NoteCard.tsx";
import Grid from "@mui/material/Unstable_Grid2";

export function NotesList() {
  const { status, error, data } = useClerkQuery("api/notes");
  return (
    <div>
      {status === "pending" && <div>Loading...</div>}
      {status === "error" && <div>Error: {error.message}</div>}
      {status === "success" && data && Array.isArray(data) && (
        <Grid container spacing={2} py={4}>
          {data.map((note) => (
            <Grid key={note.id} xl={4} md={2} xs={1}>
              <NoteCard note={note} key={note.id} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
