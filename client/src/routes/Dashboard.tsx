import { NotesList } from "../components/notes/NotesList.tsx";
import { TakeNote } from "../components/notes/TakeNote.tsx";
import { Box, Container } from "@mui/material";

export function DashboardPage() {
  return (
    <Container maxWidth="xl">
      <Box p={6}>
        <TakeNote />
        <NotesList />
      </Box>
    </Container>
  );
}
