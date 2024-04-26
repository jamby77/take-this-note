import { Alert, Snackbar } from "@mui/material";
import { useNotes } from "../providers/UseNotes.tsx";

export const Notification = () => {
  const { notification, onClearNotification } = useNotes();
  return (
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
  );
};
