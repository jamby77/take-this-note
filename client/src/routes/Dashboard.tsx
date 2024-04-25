import { NotesList } from "../components/notes/NotesList.tsx";
import { TakeNote } from "../components/notes/TakeNote.tsx";
import { Box, Container } from "@mui/material";
import { NotesProvider } from "../providers/NotesProvider.tsx";

export function DashboardPage() {
  return (
    <Container maxWidth="xl">
      <Box p={6}>
        <NotesProvider>
          <TakeNote />
          <NotesList />
        </NotesProvider>
      </Box>
    </Container>
  );
}
