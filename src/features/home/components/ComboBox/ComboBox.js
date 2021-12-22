import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useMemo } from "react";
import PropTypes from "prop-types";

const filter = createFilterOptions();

export default function ComboBox({
    suggestions,
    label,
    help,
    required,
    error,
    value,
    setValue,
}) {
    suggestions = useMemo(() => {
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
                    setValue(newValue);
                } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setValue({ title: newValue.inputValue });
                } else {
                    setValue(newValue);
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                    option => inputValue === option.title,
                );
                if (inputValue !== "" && !isExisting) {
                    filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`,
                    });
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={suggestions ?? []}
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
                <TextField
                    fullWidth
                    {...params}
                    label={label}
                    required={required}
                    error={error !== undefined}
                    helperText={help}
                />
            )}
        />
    );
}

ComboBox.propTypes = {
    suggestions: PropTypes.array,
    label: PropTypes.string,
    help: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.any,
    value: PropTypes.string,
    setValue: PropTypes.func,
};
