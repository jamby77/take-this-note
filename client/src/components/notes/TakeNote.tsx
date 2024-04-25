import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useClerkMutation } from "../../useClerkQuery.ts";
import { NoteTagsEdit } from "./NoteTagsEdit.tsx";

const TakeNoteStatus = {
  Idle: "idle",
  Saving: "saving",
  Success: "success",
  Error: "error",
  Writing: "writing",
};
type TakeNoteStatusType = (typeof TakeNoteStatus)[keyof typeof TakeNoteStatus];

export const TakeNote = () => {
  const [status, setStatus] = useState<TakeNoteStatusType>(TakeNoteStatus.Idle);
  const [note, setNote] = useState("");
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  // Mutations
  const mu = useClerkMutation(
    "api/notes",
    "POST",
    () => {
      setStatus(TakeNoteStatus.Success);
      setNote("");
    },
    () => {
      setStatus(TakeNoteStatus.Error);
    },
  );

  const takeNoteHandler = () => {
    setStatus(TakeNoteStatus.Writing);
  };

  const changeNoteHandler = () => {
    if (textRef.current === null) {
      return;
    }
    setNote(textRef.current.value);
  };

  function saveClickHandler() {
    if (!note || !note.trim().length) {
      return;
    }
    setStatus(TakeNoteStatus.Saving);
    // take first line of the note as title
    // eslint-disable-next-line prefer-const
    let [title, content] = note.split("\n", 2);
    // if no content, use title as content
    if (!content) {
      content = title;
    }
    mu.mutate({ title, content });
  }

  const closeNoteHandler = () => setStatus(TakeNoteStatus.Idle);
  return (
    <Box>
      {status === TakeNoteStatus.Success && (
        <Typography variant="h6" color="success.main" p={2} align="center">
          Note saved
        </Typography>
      )}
      {(status === TakeNoteStatus.Idle || status === TakeNoteStatus.Success) && (
        <Card
          variant="outlined"
          sx={{ minWidth: 375, maxWidth: 600, cursor: "pointer", margin: "0 auto" }}
          onClick={takeNoteHandler}
        >
          <Button onClick={takeNoteHandler}>Take Your Note</Button>
        </Card>
      )}
      {(status === TakeNoteStatus.Writing || status === TakeNoteStatus.Saving) && (
        <Card
          sx={{
            minWidth: 375,
            maxWidth: 600,
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
          }}
        >
          <CardHeader
            action={
              <IconButton aria-label="settings" onClick={closeNoteHandler}>
                <CloseIcon />
              </IconButton>
            }
            title="Take Your Note"
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack spacing={3} sx={{}}>
              <TextField
                fullWidth
                onChange={changeNoteHandler}
                value={note}
                multiline
                placeholder="Take Note"
                inputRef={textRef}
                sx={{ flexGrow: 1 }}
              />
              <NoteTagsEdit />
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              size="small"
              onClick={saveClickHandler}
              variant="contained"
              disableElevation
              color="success"
              disabled={status === TakeNoteStatus.Saving}
            >
              Save
            </Button>
            <Button
              size="small"
              onClick={closeNoteHandler}
              color="warning"
              disabled={status === TakeNoteStatus.Saving}
            >
              Discard Changes
            </Button>
          </CardActions>
        </Card>
      )}
      {mu.isError ? (
        <Typography p={2} variant="subtitle1" color="error" align="center">
          An error occurred: {mu.error.message}
        </Typography>
      ) : null}
    </Box>
  );
};
