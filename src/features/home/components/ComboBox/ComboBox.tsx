import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useMemo } from "react";

interface IComboBox {
  suggestions: string[];
  label: string;
  help: string;
  required: boolean;
  error: boolean;
  value: string | { title: string; inputValue?: string };
  setValue: (e: { title: string; inputValue?: string } | null) => void;
}

const filter = createFilterOptions<{ title: string; inputValue?: string }>();

export default function ComboBox({ suggestions, label, help, required, error, value, setValue }: IComboBox) {
  const suggestions_mapped = useMemo<{ title: string; inputValue?: string }[]>(() => {
    return suggestions.map(suggestion => {
      return {
        title: suggestion,
      };
    });
  }, [suggestions]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({ title: newValue });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({ title: newValue.inputValue });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        if (params.inputValue !== "") {
          filtered.push({
            inputValue: params.inputValue,
            title: `Add "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={suggestions_mapped ?? []}
      getOptionLabel={option => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      freeSolo
      renderInput={params => (
        <TextField {...params} fullWidth label={label} required={required} error={error} helperText={help} />
      )}
    />
  );
}
