import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { useState } from "react";
import { useNotes } from "../../providers/UseNotes.tsx";

interface OptionType {
  name: string;
  inputValue?: string;
}

const filter = createFilterOptions<OptionType>();

export const NoteTagsEdit = () => {
  const { currentTags, tags, onTagsChange } = useNotes();
  const [value, setValue] = useState<OptionType[]>(currentTags || []);
  return (
    <div>
      <Autocomplete
        size="small"
        multiple
        id="tags-outlined"
        filterSelectedOptions
        getOptionLabel={(option) => {
          // Add "xxx" option created dynamically
          return option.name;
        }}
        renderInput={(params) => <TextField {...params} label="Note tags" placeholder="Tags" />}
        options={tags || []}
        value={value}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.name);
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              name: `Add "${inputValue}"`,
            });
          }

          return filtered;
        }}
        isOptionEqualToValue={(option, value1) => {
          return option.name === value1.name;
        }}
        onChange={(_, newValue: OptionType[]) => {
          setValue(
            newValue.map((item) => {
              return { name: item.inputValue ? item.inputValue : item.name };
            }),
          );
          if (onTagsChange) {
            onTagsChange(newValue);
          }
        }}
      />
    </div>
  );
};
