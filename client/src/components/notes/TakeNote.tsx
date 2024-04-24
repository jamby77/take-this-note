import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TakeNoteStatus = {
  Idle: "idle",
  Saving: "saving",
  Success: "success",
  Error: "error",
  Writing: "writing",
};
type TakeNoteStatusType = (typeof TakeNoteStatus)[keyof typeof TakeNoteStatus];

export const TakeNote = ({}) => {
  const [status, setStatus] = useState<TakeNoteStatusType>(TakeNoteStatus.Idle);
  const [note, setNote] = useState("");
  const textRef = useRef<HTMLTextAreaElement | null>(null);

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
    setStatus(TakeNoteStatus.Saving);
  }

  const closeNoteHandler = () => setStatus(TakeNoteStatus.Idle);
  return (
    <Box>
      {status === TakeNoteStatus.Idle && (
        <Card
          variant="outlined"
          sx={{ minWidth: 375, maxWidth: 600, cursor: "pointer", margin: "0 auto" }}
          onClick={takeNoteHandler}
        >
          <Button onClick={takeNoteHandler}>Take Your Note</Button>
        </Card>
      )}
      {status === TakeNoteStatus.Writing && (
        <Card
          variant="outlined"
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
            <TextField
              fullWidth
              onChange={changeNoteHandler}
              value={note}
              multiline
              placeholder="Take Note"
              inputRef={textRef}
              sx={{ flexGrow: 1 }}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              size="small"
              onClick={saveClickHandler}
              variant="contained"
              disableElevation
              color="success"
            >
              Save
            </Button>
            <Button size="small" onClick={closeNoteHandler} color="warning">
              Discard Changes
            </Button>
          </CardActions>
        </Card>
      )}
      {note}
    </Box>
  );
};
