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
import { NoteCardTags } from "./NoteCardTags.tsx";
import { NoteTimestamps } from "./NoteTimestamps.tsx";

import { useNotes } from "../../providers/UseNotes.tsx";

export const NoteCard = ({ note }: { note: Note }) => {
  const { onStartEditNote } = useNotes();

  return (
    <Card
      variant="outlined"
      sx={{
        height: 300,
        "&:hover": { boxShadow: 3, cursor: "pointer", borderWidth: 2 },
      }}
      onClick={() => onStartEditNote(note)}
    >
      <Stack direction="column" spacing={0.5} sx={{ height: "100%" }}>
        <CardHeader title={note.title} subheader={<NoteCardTags note={note} />} />
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
            <NoteTimestamps note={note} />
            <Stack
              sx={{ flexGrow: 1 }}
              className="note-actions"
              direction="row"
              spacing={1}
              justifyContent="flex-end"
            >
              <IconButton size="small" onClick={() => onStartEditNote(note)}>
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
