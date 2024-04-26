import { Chip, Paper, Typography } from "@mui/material";
import { Note } from "./NoteTypes.ts";

const boxShadowElevated = {
  boxShadow: 3,
};
export const NoteCardTags = ({ note }: { note: Note }) => {
  if (!note.tags || note.tags.length === 0) return null;
  return (
    <Paper
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 0.5,
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
      component="ul"
      elevation={0}
    >
      <Typography align="center" variant="body2" color="text.secondary" fontSize="x-small">
        Tags:
      </Typography>
      {note.tags.map((tag) => (
        <li key={tag}>
          <Chip
            label={tag}
            size="small"
            sx={{
              "&:hover": { ...boxShadowElevated, fontWeight: "bold" },
            }}
          />
        </li>
      ))}
    </Paper>
  );
};
