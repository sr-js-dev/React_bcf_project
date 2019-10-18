import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AddIcon from '@material-ui/icons/Add';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import TabPanel from 'components/TabPanel';
import LevelView from 'components/LevelView';
import withConfirm, { withConfirmProps } from 'components/HOCs/withConfirm';

import { ProjectLevel, ProjectLevelCategory } from 'types/project';
import { Validator } from 'types/global';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        paddingTop: theme.spacing(1)
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        minWidth: 200
    },
    contents: {
        padding: 0,
        width: '100%'
    },
    buttonContainer: {
        textAlign: 'center',
        width: '100%',
        padding: theme.spacing(1)
    }
}));

export interface IProjectLevelsProps extends RouteComponentProps {
    levels: ProjectLevel[];
    addLevel: (number: number, name: string, desc: string) => void;
    updateLevel: (id: string, no: number, name: string, desc: string) => Promise<void>;
    deleteLevel: (id: string) => Promise<void>;
    addCategory: (id: string, cat: ProjectLevelCategory) => void;
    updateCategory: (id: string, cat: ProjectLevelCategory) => void;
    deleteCategory: (id: string, catId: string) => void;
}

const ProjectLevels: React.SFC<IProjectLevelsProps & withConfirmProps> = props => {

    const {
        levels,
        addLevel,
        updateLevel,
        deleteLevel,
        updateCategory,
        addCategory,
        deleteCategory,
        showConfirm,
        hideConfirm
    } = props;
    const classes = useStyles({});

    const editable = props.match.path.includes('gen-contractor');

    const [value, setValue] = React.useState(0);
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
    const [showModal, setModal] = React.useState(false);
    const [editId, setEditId] = React.useState('');

    const handleChange = (e, val) => setValue(val);
    const handleAdd = () => {
        const levelNo = parseInt(number.value);
        if (editId.length === 0) {
            if (levels && levels.some(item => item.number === levelNo)) {
                setNumber({
                    value: number.value,
                    errMsg: 'This level number is already taken'
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

            setModal(false);
            addLevel(parseInt(number.value), name.value, desc.value);
            setName({ value: '', errMsg: undefined });
            setDesc({ value: '', errMsg: undefined });
        } else {
            const editing = levels.filter(level => level.id === editId);
            if (levelNo !== editing[0].number && levels.some(item => item.number === levelNo)) {
                setNumber({
                    value: number.value,
                    errMsg: 'This level number is already taken'
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

            setModal(false);
            updateLevel(editId, levelNo, name.value, desc.value);
            setName({ value: '', errMsg: undefined });
            setDesc({ value: '', errMsg: undefined });
        }
    }

    const closeDialog = () => setModal(false);
    const showAddDialog = () => {
        setModal(true);
        setEditId('');
    };

    const showEditDialog = (id) => {
        console.log(id);
        const editing = levels.filter(level => level.id === id);
        setNumber({ value: editing[0].number.toString(), errMsg: undefined });
        setName({ value: editing[0].name, errMsg: undefined });
        setDesc({ value: editing[0].description, errMsg: undefined });
        setEditId(id);
        setModal(true);
    }

    const handleDelete = async (id: string) => {
        hideConfirm();
        if (value === (levels.length - 1)) setValue(value - 1);
        await deleteLevel(id);
    }

    const deleteLvl = (id) => {
        showConfirm('Confirm', 'Do you really want to delete this level?', () => handleDelete(id), true);
    }


    return (
        <Box className={classes.root}>
            {(!levels || !levels.length) && editable && (
                <Box className={classes.buttonContainer}>
                    <Button onClick={showAddDialog} color="primary">
                        <AddIcon />&nbsp;&nbsp;Add Level
                    </Button>
                </Box>
            )}
            {levels && !!levels.length && (
                <React.Fragment>
                    <Box className={classes.tabs}>
                        <Tabs
                            orientation="vertical"
                            // variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="project-level-tab"
                        >
                            {
                                levels.map((level, index) => (
                                    <Tab key={index} label={(
                                        <Typography style={{ fontSize: '1.2em', padding: 8, fontWeight: 600 }}>
                                            {level.name}
                                        </Typography>
                                    )} />
                                ))
                            }
                        </Tabs>
                        {editable && (
                            <Box className={classes.buttonContainer}>
                                <Button onClick={showAddDialog} color="primary">
                                    <AddIcon />{' '}Add Level
                                </Button>
                            </Box>
                        )}
                    </Box>
                    <Box className={classes.contents}>
                        {levels.map((level, index) => (
                            <TabPanel hidden={value !== index} key={level.id}>
                                <LevelView
                                    editable={editable}
                                    level={level}
                                    editLevel={showEditDialog}
                                    deleteLevel={deleteLvl}
                                    addCategory={addCategory}
                                    updateCategory={cat => updateCategory(level.id, cat)}
                                    deleteCategory={cat => deleteCategory(level.id, cat)}
                                />
                            </TabPanel>

                        ))}
                    </Box>
                </React.Fragment>
            )}

            <Dialog
                open={showModal}
                onClose={closeDialog}
                aria-labelledby='form-dialog-title'
            >
                <DialogTitle id='form-dialog-title'>Add a Level</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please input the level information
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        margin='dense'
                        label='Level Number'
                        type='number'
                        error={!!number.errMsg}
                        helperText={number.errMsg}
                        value={parseInt(number.value)}
                        onChange={event => setNumber({ value: event.target.value, errMsg: undefined })}
                    />
                    <TextField
                        fullWidth
                        required
                        margin='dense'
                        label='Name'
                        error={!!name.errMsg}
                        helperText={name.errMsg}
                        value={name.value}
                        onChange={event => setName({ value: event.target.value, errMsg: undefined })}
                    />
                    <TextField
                        fullWidth
                        margin='dense'
                        label='Description'
                        value={desc.value}
                        onChange={event => setDesc({ value: event.target.value, errMsg: undefined })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        color='primary'
                        defaultChecked
                    >
                        {editId.length === 0 ? 'Add' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default withConfirm<IProjectLevelsProps>(ProjectLevels);