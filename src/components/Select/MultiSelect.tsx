import React from 'react';
// import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
    control: {
        width: '100%'
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            // width: '100%',
        },
    },
};

export interface SelectObject {
    id: string;
    name: string;
}

interface MultiSelectProps {
    placeholder?: string;
    suggestions: Array<SelectObject>;
    values: Array<string>;
    selectChange: (values: Array<string>) => void;
    className?: string;
}

const MultiSelect: React.SFC<MultiSelectProps> = (props) => {
    const classes = useStyles({});
    const { placeholder,
        selectChange,
        values,
        suggestions,
        className,
    } = props;

    const [open, setOpen] = React.useState(false);
    const handleChange = (event: React.ChangeEvent<{ name?: string; value: Array<string> }>) => {
        selectChange(event.target.value);
        setOpen(false);
    }

    return (
        <FormControl
            className={className || classes.control}
            margin='dense'
        >
            <InputLabel htmlFor="select-multiple-checkbox">{placeholder}</InputLabel>
            <Select
                multiple
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={values}
                onChange={handleChange}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={(selected: Array<string>) => <Box>
                    {selected.join(', ')}
                </Box>}
                MenuProps={MenuProps}
            >
                {suggestions.map(suggest => (
                    <MenuItem key={suggest.id} value={suggest.name}>
                        <Checkbox checked={values.indexOf(suggest.name) > -1} />
                        <ListItemText primary={suggest.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export const CustomTextField = withStyles({
    root: {
        '& .MuiInputBase-input': {
            paddingTop: '1.1875em'
        },
        '& .MuiInputLabel-formControl': {
            paddingTop: '0.75em'
        }
    },
})(TextField);

export default MultiSelect;