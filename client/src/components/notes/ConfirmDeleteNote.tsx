import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNotes } from "../../providers/UseNotes.tsx";
import { ReducerActionsEnum } from "../../providers/NotesProvider.tsx";

export const ConfirmDeleteNote = () => {
  const { deleteNote, dispatch } = useNotes();

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={deleteNote !== undefined}
    >
      <DialogTitle>Delete Note</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Are you sure you want to delete this note? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => dispatch && dispatch({ type: ReducerActionsEnum.CLEAR_DELETE_NOTE })}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            dispatch && dispatch({ type: ReducerActionsEnum.DELETE_NOTE });
          }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
