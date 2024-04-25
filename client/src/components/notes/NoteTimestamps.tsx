import { Note } from "./NoteTypes.ts";
import { Stack, Typography } from "@mui/material";

export const NoteTimestamps = ({ note }: { note: Note }) => {
  let createdString: string = "";
  let editedString: string = "";
  if (note.createdAt) {
    createdString = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "Europe/Sofia",
    }).format(new Date(note.createdAt));
  }
  if (note.updatedAt) {
    editedString = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "Europe/Sofia",
    }).format(new Date(note.updatedAt));
  }
  return (
    <Stack
      className="note-dates"
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{
        flexGrow: 0,
      }}
    >
      {createdString.length > 0 && (
        <Typography
          align="center"
          variant="body2"
          color="text.disabled"
          fontSize="xx-small"
          fontWeight="bold"
          sx={{
            transition: "font-size 0.3s ease-in-out",
            "&:hover": {
              fontSize: "x-small",
            },
          }}
        >
          Created: {createdString}
        </Typography>
      )}
      {editedString.length > 0 && (
        <Typography
          align="center"
          variant="body2"
          color="text.disabled"
          fontSize="xx-small"
          fontWeight="bold"
          sx={{
            transition: "font-size 0.3s ease-in-out",
            "&:hover": {
              fontSize: "x-small",
            },
          }}
        >
          Edited: {editedString}
        </Typography>
      )}
    </Stack>
  );
};
