import React from 'react';

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import LevelCat from 'components/LevelView/LevelCat';
import LevelCatEdit from 'components/LevelView/LevelCatEdit';
import { ProjectLevel, ProjectLevelCategory } from 'types/project';
import { Validator } from 'types/global';


const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)',
    },
    waitingSpin: {
        position: 'absolute',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    titlebar: {
        padding: theme.spacing(0),
        fontSize: '1.5em',
    },
    title: {
        display: 'block',
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    subtitle: {
        display: 'block',
        fontWeight: 400,
        fontSize: '1.1em',
        paddingRight: theme.spacing(1.5),
        color: '#333'
    },
    action: {
        display: 'flex',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(1)
    },
    left: {
        float: 'left'
    },
    right: {
        float: 'right'
    },
    fullWidth: {
        width: '100%'
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)'
    },
    fab: {
        width: '40px',
        height: '40px',
        marginLeft: '40px',
    },
}));

interface ILevelViewProps {
    editable: boolean;
    level: ProjectLevel;
    editLevel: (id: string) => void;
    deleteLevel: (id: string) => void;
    addCategory: (id: string, cat: ProjectLevelCategory) => void;
    updateCategory: (cat: ProjectLevelCategory) => void;
    deleteCategory: (id: string) => void;
}

const LevelView: React.SFC<ILevelViewProps & withSnackbarProps> = (props) => {

    const {
        level,
        editLevel,
        deleteLevel,
        addCategory,
        updateCategory,
        deleteCategory,
        showMessage,
    } = props;
    const classes = useStyles({});

    const [edit, setEdit] = React.useState('');
    const [type, setType] = React.useState('BATHROOM');
    const [modal, setModal] = React.useState(false);
    const [number, setNumber] = React.useState({
        value: '1',
        errMsg: undefined
    } as Validator);
    const [name, setName] = React.useState({
        value: '',
        errMsg: undefined
    } as Validator);
    const [desc, setDesc] = React.useState({
        value: '',
        errMsg: undefined
    } as Validator);
    const [width, setWidth] = React.useState({
        value: '0',
        errMsg: undefined
    } as Validator);
    const [height, setHeight] = React.useState({
        value: '0',
        errMsg: undefined
    } as Validator);
    const [length, setLength] = React.useState({
        value: '0',
        errMsg: undefined
    } as Validator);

    const typeChange = event => {
        setType(event.target.value);
    }

    const handleAddCategory = () => {
        setModal(true);
    }

    const handleEdit = (id: string) => {
        setEdit(id);
    }

    const handleDelete = (id: string) => {
        deleteCategory(id);
        setEdit('');
    }

    const saveCategory = (item: ProjectLevelCategory) => {
        if (item.name.length === 0 ||
            item.w === 0 ||
            item.h === 0 ||
            item.l === 0) {
            showMessage(false, 'Fill in all the required fields');
            return;
        }
        updateCategory(item);
        setEdit('');
    }

    const cancelEdit = () => {
        setEdit('');
    }

    const handleAdd = () => {
        const roomNo = parseInt(number.value);
        if (level.rooms && level.rooms.some(item => item.number === roomNo)) {
            setNumber({
                value: number.value,
                errMsg: 'This room number is already taken'
            });

            return;
        }
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

        const cat: ProjectLevelCategory = {
            id: '',
            number: parseInt(number.value),
            name: name.value,
            type,
            description: desc.value,
            w: parseFloat(width.value),
            h: parseFloat(height.value),
            l: parseFloat(length.value)
        };

        addCategory(level.id, cat);
        setModal(false);
        setName({ value: '', errMsg: undefined });
        setDesc({ value: '', errMsg: undefined });
        setWidth({ value: '0', errMsg: undefined });
        setHeight({ value: '0', errMsg: undefined });
        setLength({ value: '0', errMsg: undefined });
    }

    const cats = [
        { name: 'Bath Room', value: 'BATHROOM' },
        { name: 'Bed Room', value: 'BEDROOM' },
        { name: 'Living Room', value: 'LIVINGROOM' },
        { name: 'Kitchen', value: 'KITCHEN' },
        { name: 'Rooftop', value: 'ROOFTOP' },
        { name: 'Hallway', value: 'HALLWAY' },
        { name: 'Stairs', value: 'STAIRS' },
        { name: 'Other', value: 'OTHER' }
    ];

    return (
        <Box className={classes.root}>
            <List aria-label='project-level' style={{ padding: '16px 0' }}>
                <ListItem className={classes.titlebar}>
                    <Box>
                        <Typography className={classes.title}>
                            {level.name}
                        </Typography>
                        <Typography>
                            {level.description}
                        </Typography>
                    </Box>
                    {props.editable && (
                        <Box className={classes.action}>
                            <IconButton aria-label="Delete" onClick={(e) => {
                                e.stopPropagation();
                                editLevel(level.id);
                            }} >
                                <EditIcon fontSize='large' />
                            </IconButton>
                            <IconButton aria-label="Delete" onClick={(e) => {
                                e.stopPropagation();
                                deleteLevel(level.id);
                            }} >
                                <DeleteIcon fontSize='large' />
                            </IconButton>
                        </Box>
                    )}
                </ListItem>
                <ListItem style={{ padding: '8px 16px' }}>
                    {props.editable && (
                        <>
                            <Typography className={classes.title} style={{ fontSize: '1.5em' }}>
                                Rooms
                            </Typography>
                            <Fab
                                color="primary"
                                aria-label="Add"
                                className={classes.fab}
                                onClick={handleAddCategory}
                            >
                                <AddIcon />
                            </Fab>
                        </>
                    )}
                </ListItem>
                {level.rooms && level.rooms.map(cat => {
                    if (cat.id !== edit) {
                        return (
                            <React.Fragment key={cat.id}>
                                <Divider />
                                <LevelCat
                                    edit={props.editable}
                                    item={cat}
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                />
                            </React.Fragment>
                        )
                    } else {
                        return (
                            <React.Fragment key={cat.id}>
                                <Divider />
                                <LevelCatEdit
                                    item={cat}
                                    handleSave={saveCategory}
                                    handleCancel={cancelEdit}
                                />
                            </React.Fragment>
                        )
                    }
                })}
            </List>

            <Dialog
                open={modal}
                onClose={() => setModal(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add a Room</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} md={6} style={{ padding: '8px 0px' }}>
                            <TextField
                                autoFocus
                                fullWidth
                                required
                                margin='dense'
                                label='Room Number'
                                type='number'
                                error={!!number.errMsg}
                                helperText={number.errMsg}
                                value={parseInt(number.value)}
                                onChange={event => setNumber({ value: event.target.value, errMsg: undefined })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} style={{ padding: '29px 0px 8px 24px' }}>
                            <Select
                                style={{ minWidth: 180 }}
                                value={type}
                                onChange={typeChange}
                                name="level-categories"
                                fullWidth
                            >
                                {cats.map((cat, index) => (
                                    <MenuItem value={cat.value} key={index}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <Box>
                        <TextField
                            required
                            label="Name"
                            margin="dense"
                            error={!!name.errMsg}
                            helperText={name.errMsg}
                            value={name.value}
                            fullWidth={true}
                            onChange={event => setName({ value: event.target.value, errMsg: undefined })}
                        />
                    </Box>
                    <Box>
                        <Grid container direction='row-reverse'>
                            <Grid item xs={12} md={8} style={{ padding: '8px 0px 8px 24px' }}>
                                <TextField
                                    label="Description"
                                    margin="dense"
                                    value={desc.value}
                                    fullWidth={true}
                                    multiline={true}
                                    rowsMax={12}
                                    onChange={event => setDesc({ value: event.target.value, errMsg: undefined })}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} style={{ padding: '8px 0px' }}>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        color="primary"
                        defaultChecked
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default withSnackbar<ILevelViewProps>(LevelView);
