import { Card, CardContent, CardHeader } from "@mui/material";

export const NoteCard = ({
  note,
}: {
  note: {
    title: string;
    content: string;
  };
}) => (
  <Card variant="outlined" sx={{ height: 300, paddingBottom: 2 }}>
    <CardHeader title={note.title} />
    <CardContent
      sx={{ overflow: "hidden", overflowY: "scroll", maxHeight: "220px", textOverflow: "ellipsis" }}
    >
      {note.content}
    </CardContent>
  </Card>
);
