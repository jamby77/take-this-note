import { Box } from "@mui/material";
import { NotesList } from "../components/notes/NotesList.tsx";
import { TakeNote } from "../components/notes/TakeNote.tsx";
import { ConfirmDeleteNote } from "../components/notes/ConfirmDeleteNote.tsx";
import { Notification } from "../components/Notification.tsx";

export function DashboardPage() {
  return (
    <Box
      sx={{
        px: { xs: 1, md: 6 },
        pt: { xs: 2, md: 6 },
      }}
    >
      <TakeNote />
      <NotesList />
      <Notification />
      <ConfirmDeleteNote />
    </Box>
  );
}
