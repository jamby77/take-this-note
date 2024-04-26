import { NotesList } from "../components/notes/NotesList.tsx";
import { TakeNote } from "../components/notes/TakeNote.tsx";
import { Alert, Box, Snackbar } from "@mui/material";
import { useNotes } from "../providers/UseNotes.tsx";

export function DashboardPage() {
  const { notification, onClearNotification } = useNotes();
  return (
    <Box
      sx={{
        px: { xs: 1, md: 6 },
        pt: { xs: 2, md: 6 },
      }}
    >
      <TakeNote />
      <NotesList />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={notification !== undefined}
        autoHideDuration={5000}
        onClose={onClearNotification}
      >
        <Alert
          onClose={onClearNotification}
          severity={notification?.severity ?? "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
