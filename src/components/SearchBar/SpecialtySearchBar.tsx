import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import MultiSelect, { SelectObject } from 'components/Select/MultiSelect';
import { Grid, Chip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'block'
    },
    textField: {
        width: '100%'
    },
    select: {
        width: '100%'
    },
    control: {
        padding: theme.spacing(0, 1)
    },
    button: {
        margin: theme.spacing(1),
    },
    chip: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    }
}));



interface ISpecialtySearchBarProps {
    search: (name: string, city: string, specs: Array<string>) => void;
    suggestions: Array<SelectObject>;
}

const SpecialtySearchBar: React.SFC<ISpecialtySearchBarProps> = (props) => {

    const classes = useStyles({});
    const { suggestions, search } = props;
    const [specs, setSpecs] = React.useState([]);
    const [name, setName] = React.useState('');
    const [city, setCity] = React.useState('');

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const onCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    }

    const selectChange = (val: Array<string>) => {
        setSpecs(val);
    }

    const deleteSelect = (name: string) => {
        let idx: number = specs.indexOf(name);
        if (idx >= 0) {
            setSpecs([...specs.slice(0, idx), ...specs.slice(idx + 1)]);
        }
    }

    const handleSearch = () => {
        search(name, city, specs);
    }

    return (
        <Box className={classes.root}>
            <Grid container>
                <Grid item xs={6} md={3} className={classes.control}>
                    <TextField
                        id="name"
                        label="Name"
                        className={classes.textField}
                        value={name}
                        onChange={onNameChange}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={6} md={3} className={classes.control}>
                    <TextField
                        id="city"
                        label="City"
                        className={classes.textField}
                        value={city}
                        onChange={onCityChange}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={8} md={4} className={classes.control}>
                    <MultiSelect
                        className={classes.select}
                        placeholder="Select multiple specialties"
                        suggestions={suggestions}
                        values={specs}
                        selectChange={selectChange}
                    />
                </Grid>
                <Grid item xs={4} md={2} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </Grid>
                <Grid item xs={12} className={classes.control} style={{ display: 'flex' }}>
                    {specs.map((spec, index) => (
                        <Chip
                            key={index}
                            label={spec}
                            className={classes.chip}
                            onDelete={() => deleteSelect(spec)}
                        />
                    ))}
                </Grid>
            </Grid>
        </Box>
    )
}

export default SpecialtySearchBar;