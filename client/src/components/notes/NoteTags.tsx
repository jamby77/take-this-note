import { Chip, Paper } from "@mui/material";
import { useNotes } from "../../providers/UseNotes.tsx";
import { TagValidation } from "../../shared/validations.ts";
import { ReducerActionsEnum } from "../../providers/NotesProvider.tsx";
import { useClerkQuery } from "../../useClerkQuery.ts";
import { useEffect } from "react";

const boxShadowElevated = {
  boxShadow: 3,
};
export const NoteTags = () => {
  const { tags, currentTag, dispatch } = useNotes();
  const handleTagClick = (tag: TagValidation) => {
    dispatch && dispatch({ type: ReducerActionsEnum.SET_TAG, value: tag });
  };
  const resultTags = useClerkQuery("api/tags");
  useEffect(() => {
    if (resultTags.status === "success" && resultTags.data) {
      dispatch &&
        dispatch({ type: ReducerActionsEnum.SET_TAGS, value: resultTags.data as TagValidation[] });
    }
  }, [resultTags.status, resultTags.data]);
  // TODO - 26.04.24 - implement tag filtering
  useEffect(() => {
    // if current tag is set, send query to filter by tag
    if (currentTag) {
      useClerkQuery("");
    }
  }, [currentTag]);

  if (!tags || tags.length === 0) return null;
  return (
    <Paper
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 0.5,
        listStyle: "none",
        py: 1,
        px: 0,
        m: 0,
        mt: 4,
      }}
      component="ul"
      elevation={0}
    >
      {tags.map((tag) => (
        <li key={tag?.id}>
          <Chip
            onClick={() => handleTagClick(tag)}
            color={currentTag?.name === tag.name ? "primary" : "default"}
            label={tag?.name}
            size="medium"
            sx={{
              fontWeight: currentTag?.name === tag.name ? "bold" : "normal",
              "&:hover": { ...boxShadowElevated, fontWeight: "bold", cursor: "pointer" },
            }}
          />
        </li>
      ))}
    </Paper>
  );
};
