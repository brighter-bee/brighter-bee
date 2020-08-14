import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

// Skill selection autocomplete dropdown component
export default function Skills(props) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            axios.get('http://localhost:8000/api/skill')
                .then((response) => {
                    setOptions(response.data);
                });
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const [value, setValue] = React.useState(options[0]);

    return (
        <Autocomplete
            multiple
            id="skills"
            style={{width: "100%"}}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.full_name === value.full_name}
            getOptionLabel={(option) => option.full_name}
            onChange={(event, newValue) => {
                setValue(newValue);
                let values = props.skills;
                newValue.forEach(function (item) {
                    values.push(item['id'])
                });
                console.log(values);
                props.handleSkills(values)
            }}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    multiple
                    {...params}
                    label="Add skills"
                    placeholder="Type to search"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
