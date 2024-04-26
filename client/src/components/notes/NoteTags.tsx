import { useEffect } from "react";
import { Chip, Paper } from "@mui/material";
import { useClerkQuery } from "../../useClerkQuery.ts";
import { useNotes } from "../../providers/UseNotes.tsx";
import { TagValidation } from "../../shared/validations.ts";
import { ReducerActionsEnum } from "../../providers/NotesProvider.tsx";

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
      <li>
        <Chip
          onDelete={() => handleTagClick({ name: "All" })}
          variant="outlined"
          color="success"
          label="All"
          size="medium"
          disabled={currentTag === undefined}
          sx={{
            fontWeight: currentTag?.name === "All" ? "bold" : "normal",
            "&:hover": { ...boxShadowElevated, fontWeight: "bold", cursor: "pointer" },
          }}
        />
      </li>
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
