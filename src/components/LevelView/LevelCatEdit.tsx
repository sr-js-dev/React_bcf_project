import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from "components/CustomButtons/Button.jsx";

import { ProjectLevelCategory } from 'types/project';
import { Validator } from 'types/global';


const useStyles = makeStyles(theme => ({
    root: {
        border: '1px solid #EEE',
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    container: {
        width: '100%'
    },
    title: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    subtitle: {
        fontWeight: 500,
        fontSize: '1.1em',
        paddingRight: theme.spacing(1.5),
        color: '#222'
    },
    textFieldHalf: {
        width: '120px',
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            width: '150px',
        },
        [theme.breakpoints.up('md')]: {
            width: '200px',
        }
    },
    doneContainer: {
        display: 'block',
        textAlign: 'right',
        paddingRight: theme.spacing(1)
    },
    doneBtn: {
        border: '1px solid #4a148c',
        borderRadius: 0,
        color: theme.palette.primary.light,
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        marginLeft: theme.spacing(2),
        width: '160px',
        fontSize: '14px',
        bottom: 0,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        '&:disabled': {
            backgroundColor: '#CCC',
        },
    }
}));

export interface ILevelCatEditProps {
    handleSave: (item: ProjectLevelCategory) => void;
    handleCancel: () => void;
    item: ProjectLevelCategory;
}

const LevelCatEdit: React.SFC<ILevelCatEditProps> = props => {

    const { item, handleSave, handleCancel } = props;
    const [name, setName] = React.useState({
        value: item.name,
        errMsg: undefined
    } as Validator);
    const [desc, setDesc] = React.useState({
        value: item.description,
        errMsg: undefined
    } as Validator);
    const [width, setWidth] = React.useState({
        value: item.w.toString(),
        errMsg: undefined
    } as Validator);
    const [height, setHeight] = React.useState({
        value: item.h.toString(),
        errMsg: undefined
    } as Validator);
    const [length, setLength] = React.useState({
        value: item.l.toString(),
        errMsg: undefined
    } as Validator);

    const classes = useStyles({});

    const saveCategory = () => {
        if (name.value.length === 0) {
            setName({
                value: name.value,
                errMsg: 'Name is required'
            });

            return;
        }
        if (width.value === '' || width.value === '0') {
            setWidth({
                value: name.value,
                errMsg: 'Name is required'
            });

            return;
        }
        if (height.value === '' || height.value === '0') {
            setHeight({
                value: name.value,
                errMsg: 'Name is required'
            });

            return;
        }
        if (length.value === '' || length.value === '0') {
            setLength({
                value: name.value,
                errMsg: 'Name is required'
            });

            return;
        }

        const data: ProjectLevelCategory = {
            id: item.id,
            number: item.number,
            name: name.value,
            type: item.type,
            description: desc.value,
            w: parseFloat(width.value),
            h: parseFloat(height.value),
            l: parseFloat(length.value)
        };

        handleSave(data);
    }


    return (
        <ListItem
            className={classes.root}
            alignItems='flex-start'
        >
            <Box className={classes.container}>
                <Box style={{ padding: '0 16px' }}>
                    <TextField
                        label="Name"
                        margin="dense"
                        required
                        fullWidth={true}
                        error={!!name.errMsg}
                        helperText={name.errMsg}
                        value={name.value}
                        onChange={event => setName({ value: event.target.value, errMsg: undefined })}
                    />
                </Box>
                <Box style={{ display: 'flex' }}>
                    <Grid container direction='row-reverse'>
                        <Grid item xs={12} md={8} style={{ padding: '8px 16px' }}>
                            <TextField
                                label="Description"
                                margin="dense"
                                fullWidth={true}
                                multiline={true}
                                rowsMax={12}
                                error={!!desc.errMsg}
                                helperText={desc.errMsg}
                                value={desc.value}
                                onChange={event => setDesc({ value: event.target.value, errMsg: undefined })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: '8px 16px' }}>
                            <TextField
                                label="Width"
                                margin="dense"
                                required
                                type='number'
                                fullWidth={true}
                                error={!!width.errMsg}
                                helperText={width.errMsg}
                                value={width.value}
                                onChange={event => setWidth({ value: event.target.value, errMsg: undefined })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Height"
                                margin="dense"
                                required
                                type='number'
                                fullWidth={true}
                                error={!!height.errMsg}
                                helperText={height.errMsg}
                                value={height.value}
                                onChange={event => setHeight({ value: event.target.value, errMsg: undefined })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Length"
                                margin="dense"
                                required
                                type='number'
                                fullWidth={true}
                                error={!!length.errMsg}
                                helperText={length.errMsg}
                                value={length.value}
                                onChange={event => setLength({ value: event.target.value, errMsg: undefined })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box className={classes.doneContainer}>
                    <Button
                        color="primary"
                        className={classes.doneBtn}
                        onClick={saveCategory}
                    >
                        Done
                        </Button>
                    <Button
                        color="primary"
                        className={classes.doneBtn}
                        onClick={handleCancel}
                    >
                        Cancel
                        </Button>
                </Box>
            </Box>
        </ListItem>
    );
}

export default LevelCatEdit;