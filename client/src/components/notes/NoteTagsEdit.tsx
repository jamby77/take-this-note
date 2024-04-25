import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useClerkQuery } from "../../useClerkQuery.ts";

interface OptionType {
  name: string;
  inputValue?: string;
}

const filter = createFilterOptions<OptionType>();

export const NoteTagsEdit = () => {
  const [tags, setTags] = useState<OptionType[]>([]);

  const [value, setValue] = useState<OptionType[]>([]);

  const { data, status } = useClerkQuery("api/tags");

  useEffect(() => {
    if (status === "success" && data) {
      setTags(data);
    }
  }, [status, data]);
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
        options={tags}
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
        }}
      />
    </div>
  );
};
