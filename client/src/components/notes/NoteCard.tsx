import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteForeverTwoTone";
import EditNoteIcon from "@mui/icons-material/EditNoteTwoTone";

import { Note } from "./NoteTypes.ts";
import { NodeCardTags } from "./NodeCardTags.tsx";

export const NoteCard = ({ note }: { note: Note }) => {
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
    <Card
      variant="outlined"
      sx={{
        height: 300,
      }}
    >
      <Stack direction="column" spacing={0.5} sx={{ height: "100%" }}>
        <CardHeader title={note.title} subheader={<NodeCardTags note={note} />} />
        <CardContent
          sx={{
            overflow: "hidden",
            overflowY: "scroll",
            maxHeight: "220px",
            textOverflow: "ellipsis",
            flexGrow: 1,
          }}
        >
          <Stack direction="column" spacing={2}>
            <Typography variant="body1">{note.content}</Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ height: 48, flexShrink: 0 }}>
          <Stack sx={{ flexGrow: 1 }} direction="row" className="card-actions">
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
            <Stack
              sx={{ flexGrow: 1 }}
              className="note-actions"
              direction="row"
              spacing={1}
              justifyContent="flex-end"
            >
              <IconButton size="small">
                <EditNoteIcon color="action" aria-label="Edit Note" titleAccess="Edit Note" />
              </IconButton>
              <IconButton size="small">
                <DeleteIcon color="error" aria-label="Delete Note" titleAccess="Delete Note" />
              </IconButton>
            </Stack>
          </Stack>
        </CardActions>
      </Stack>
    </Card>
  );
};
