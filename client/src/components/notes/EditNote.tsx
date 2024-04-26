import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";

import { useNotes } from "../../providers/UseNotes.tsx";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function EditNote() {
  const { currentNote: note, isEditing: open, onStopEditNote, onUpdateNote } = useNotes();

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onClose = () => {
    setIsOpen(false);
    onStopEditNote();
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const title = formData.get("title") as string;
          const content = formData.get("content") as string;
          onUpdateNote(note?.id as number, { title, content });
        },
      }}
    >
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="title"
          name="title"
          label="Note Title"
          type="text"
          fullWidth
          variant="outlined"
          defaultValue={note?.title}
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          inputProps={{ maxLength: 500 }}
          multiline
          minRows={3}
          maxRows={10}
          required
          margin="dense"
          id="content"
          name="content"
          label="Note Content"
          fullWidth
          variant="outlined"
          defaultValue={note?.content}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
