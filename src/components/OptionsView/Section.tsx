import * as React from 'react';

import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { ProjectLevelCategory, RoomOption } from 'types/project';
import { Validator, NodeInfo } from 'types/global';

import ProjApi from 'services/project';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative'
    },
    title: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    bold: {
        fontWeight: 600
    },
    subtitle: {
        fontWeight: 500,
        fontSize: '1rem',
        paddingRight: theme.spacing(1.5),
        color: '#222',
        paddingTop: theme.spacing(0.5)
    },
    fab: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        margin: theme.spacing(0, 5),
    },
    catBox: {
        margin: theme.spacing(0, 3)
    },
    value: {
        fontWeight: 500,
        fontSize: '1.0em',
        padding: theme.spacing(0, 1),
        color: '#222',
        flexGrow: 1,
        textAlign: 'right',
    },
    doneBtn: {
        border: '1px solid #4a148c',
        borderRadius: 0,
        color: theme.palette.primary.light,
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        marginRight: theme.spacing(2),
        width: '120px',
        // fontSize: '14px',
        bottom: 0,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: '#FFF'
        },
        '&:disabled': {
            backgroundColor: '#CCC',
        },
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    }
}));

interface ISectionProps {
    component: NodeInfo;
    room: ProjectLevelCategory;
    roomUpdated: () => Promise<void>;
    showMessage: (suc: boolean, msg: string) => void;
}

const Section: React.FunctionComponent<ISectionProps> = (props) => {

    const { component, room, roomUpdated, showMessage } = props;
    const classes = useStyles({});

    const [key, setKey] = React.useState<Validator>({
        value: '',
        errMsg: undefined
    });
    const [value, setValue] = React.useState<Validator>({
        value: '',
        errMsg: undefined
    });



    const [category, setCategory] = React.useState(component.id);
    const [curRoom, setCurRoom] = React.useState(room.id);


    const [modal, setModal] = React.useState(false);

    const [option, setOption] = React.useState<{ key: Validator, value: Validator }[]>([]);
    const [busy, setBusy] = React.useState(false);

    const pathFromOption = () => {
        const crumb = [component];

        if (!room.selectionList) return crumb;
        const current = room.selectionList.filter(selection => component.id === selection.category.id);
        if (current.length === 0) return crumb;
        const ids = current[0].breadcrumb;
        if (!ids || ids.length === 0) return crumb;

        let curNode = component;
        for (let i = 0; i < ids.length; i++) {
            const matches = curNode.children.filter(item => item.id === ids[i]);
            if (matches.length === 1) {
                crumb.push(matches[0]);
                curNode = matches[0];
            } else {
                break;
            }
        }

        return crumb;
    }

    const curPath = pathFromOption();
    const [node, setNode] = React.useState<NodeInfo>(curPath[curPath.length - 1]);
    const [path, setPath] = React.useState<NodeInfo[]>(curPath);

    const reload = () => {
        setCategory(component.id);
        setCurRoom(room.id);
        setModal(false);
        setBusy(false);

        setPath(curPath);
        setNode(curPath[curPath.length - 1]);
    }

    if (category !== component.id) {
        reload();
    } else if (room.id !== curRoom) {
        reload();
    }

    const nodeChange = e => {
        const count = node.children.length;
        // if (selection && selection.id === e.target.value) return;
        if (node.id === e.target.value) return;

        for (let i = 0; i < count; i++) {
            if (node.children[i].id === e.target.value) {
                let newPath = path;
                if (!node.children || node.children.length === 0) {
                    newPath.pop();
                }
                setPath([...newPath, node.children[i]]);
                setNode(node.children[i]);
                setKey({ value: '', errMsg: undefined });
                setValue({ value: '', errMsg: undefined });
            }
        }
    }

    const keyChange = e => {
        if (option.some(opt => opt.key.value === e.target.value)) {
            setKey({
                value: e.target.value,
                errMsg: 'Same key exists'
            });
        } else if (e.target.value.length === 0) {
            setKey({
                value: '',
                errMsg: 'Key is required'
            });
        }
        else {
            setKey({
                value: e.target.value,
                errMsg: undefined
            });
        }
    }

    const buildPath = (opt: RoomOption) => {
        if (!opt.breadcrumb) {
            return [];
        } else {
            return [...opt.breadcrumb];
        }
    }

    const buildCrumb = (ids: string[]) => {
        let crumb = [];
        let curNode = component;
        for (let i = 0; i < ids.length; i++) {
            const matches = curNode.children.filter(item => item.id === ids[i]);
            if (matches.length === 1) {
                crumb.push(matches[0].name);
                curNode = matches[0];
            } else {
                crumb = [];
                break;
            }
        }

        crumb.unshift(component.name);
        return crumb;
    }

    const clickCrumb = id => {
        const idx = path.indexOf(id);
        if (idx < 0) return;
        if (idx === (path.length - 1)) return;

        const newPath = path.slice(0, idx + 1);
        setPath(newPath);
        setNode(newPath[newPath.length - 1]);
        setKey({ value: '', errMsg: undefined });
        setValue({ value: '', errMsg: undefined });
    }

    const handleSelect = async () => {

        let newOpts = option;
        const postOption = {};
        let err = false;
        for (let i = 0; i < newOpts.length; i++) {
            if (Object.keys(postOption).includes(newOpts[i].key.value)) {
                newOpts[i].key.errMsg = 'Same key exists';
                err = true;
            }

            if (newOpts[i].key.value.length === 0) {
                newOpts[i].key.errMsg = 'Key is required'
                err = true;
            }

            if (newOpts[i].value.value.length === 0) {
                newOpts[i].value.errMsg = 'Value is required'
                err = true;
            }

            postOption[newOpts[i].key.value] = newOpts[i].value.value;
        }

        if (err) {
            setOption([...newOpts]);
            return;
        }

        // call api
        setBusy(true);
        try {
            if (edit.length > 0) {
                await ProjApi.updateSelection(edit, postOption)
            } else {
                // delete existing selections
                const existing = room.selectionList.filter(sel => sel.category.id === component.id);
                if (existing.length > 0) {
                    for (let item of existing) {
                        await ProjApi.deleteSelection(item.id);
                    }
                }

                // create a new selection
                let crumb = [];
                if (path.length > 1) crumb = path.slice(1, path.length).map(item => item.id);
                await ProjApi.createSelection(room.id, component.id, node.id, postOption, crumb);
            }

            // update room information
            await roomUpdated();
            setBusy(false);
            setModal(false);
            setKey({ value: '', errMsg: undefined });
            setValue({ value: '', errMsg: undefined });
            showMessage(true, 'Saved');
        } catch (error) {
            console.log('ProjectOptionView.handleSelect: ', error);
            setBusy(false);
            showMessage(false, 'Save option failed');
        }
    }

    const handleCancel = () => {
        setModal(false);
        setKey({ value: '', errMsg: undefined });
        setValue({ value: '', errMsg: undefined });
    }

    const deleteItem = (index: number) => {
        let newOpt = option;
        newOpt.splice(index, 1);
        setOption([...newOpt]);
    }

    const addItem = () => {
        if (key.errMsg || value.errMsg) return;
        if (key.value.length === 0) {
            setKey({ value: '', errMsg: 'Key is required' });
            return;
        }

        if (value.value.length === 0) {
            setValue({ value: '', errMsg: 'Value is required' });
            return;
        }

        // save options
        setOption([...option, { key: { value: key.value, errMsg: undefined }, value: { value: value.value, errMsg: undefined } }]);
        setKey({ value: '', errMsg: undefined });
        setValue({ value: '', errMsg: undefined });
    }

    let edit = '';
    let opts = undefined;
    if (room.selectionList) {
        const filtered = room.selectionList.filter(item => (item.category.id === component.id && item.selection.id === node.id));
        if (filtered.length === 1) {
            opts = Object.keys(filtered[0].option).map(itemKey => ({
                key: { value: itemKey, errMsg: undefined },
                value: { value: filtered[0].option[itemKey], errMsg: undefined }
            }));
            edit = filtered[0].id;
        } else if (filtered.length > 1) {
            console.log('OptionView: some error');
        }
    }

    const showForm = () => {
        setOption(opts || []);
        setModal(true);
    }

    const existingKeyChange = (index: number, newKey: string) => {
        let newOpt = option;
        newOpt[index].key = { value: newKey, errMsg: undefined };
        setOption([...newOpt]);
    }

    const existingValueChange = (index: number, value: string) => {
        let newOpt = option;
        newOpt[index].value = { value: value, errMsg: undefined };;
        setOption([...newOpt]);
    }

    return (
        <Box className={classes.root}>
            <List>
                <ListItem>
                    <Typography className={classes.title}>
                        {`${component.name} ( ${component.description} )`}
                    </Typography>
                </ListItem>
                <Divider />
                <ListItem>
                    <Breadcrumbs>
                        {path.map(item => (
                            <Link key={item.id} onClick={() => clickCrumb(item)} style={{ cursor: 'pointer' }}>
                                {item.name}
                            </Link>
                        ))}
                    </Breadcrumbs>
                </ListItem>
                <ListItem>
                    <Typography className={classes.bold}>
                        Category
                    </Typography>
                    <Select
                        style={{ minWidth: 180 }}
                        placeholder={node && node.name}
                        value={node.id}
                        onChange={nodeChange}
                        name="sub-nodes"
                        className={classes.catBox}
                    >
                        <MenuItem value={node.id} key={node.id}>
                            {(!node.children || node.children.length === 0) ? node.name : `Select option for ${node.name}`}
                        </MenuItem>
                        {node && node.children && node.children.map(item => (
                            <MenuItem value={item.id} key={item.id}>
                                {`  > ${item.name}`}
                            </MenuItem>
                        ))}
                        {/* {initSelection && (
                            <MenuItem value={initSelection.id}>
                                {initSelection.name}
                            </MenuItem>
                        )} */}
                    </Select>
                    <Typography className={classes.subtitle}>
                        &nbsp;&nbsp;&nbsp;&nbsp;{node.description}
                    </Typography>
                </ListItem>
                {edit.length === 0 && (
                    <ListItem>
                        <Typography className={classes.subtitle}>
                            Options
                        </Typography>
                        <IconButton
                            color='primary'
                            // size='small'
                            aria-label='Add'
                            className={classes.fab}
                            onClick={showForm}
                        >
                            {(edit.length > 0) ? <EditIcon fontSize='small' /> : <AddIcon fontSize='small' />}
                        </IconButton>
                    </ListItem>
                )}
                {edit.length === 0 && modal && (
                    <React.Fragment>
                        <Divider />
                        <ListItem>
                            <Grid container style={{ maxWidth: 640 }}>
                                {option.map((opt, index) => (
                                    <React.Fragment key={index}>
                                        <Grid item xs={5} style={{ padding: '4px 8px' }}>
                                            <TextField
                                                label="Key"
                                                margin="dense"
                                                fullWidth={true}
                                                value={opt.key.value}
                                                error={!!opt.key.errMsg}
                                                helperText={opt.key.errMsg}
                                                onChange={e => existingKeyChange(index, e.target.value)}
                                                // disabled={true}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={6} style={{ padding: '4px 8px' }}>
                                            <TextField
                                                label="Value"
                                                margin="dense"
                                                fullWidth={true}
                                                value={opt.value.value}
                                                error={!!opt.value.errMsg}
                                                helperText={opt.value.errMsg}
                                                onChange={(e) => existingValueChange(index, e.target.value)}
                                                // disabled={true}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IconButton onClick={() => deleteItem(index)} style={{ height: 36 }}>
                                                <DeleteIcon fontSize='small' color='error' />
                                            </IconButton>
                                        </Grid>
                                    </React.Fragment>
                                ))}
                                <Grid item xs={5} style={{ padding: '4px 8px' }}>
                                    <TextField
                                        label="Key"
                                        margin="dense"
                                        fullWidth={true}
                                        error={!!key.errMsg}
                                        helperText={key.errMsg}
                                        value={key.value}
                                        onChange={keyChange}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{ padding: '4px 8px' }}>
                                    <TextField
                                        label="Value"
                                        margin="dense"
                                        fullWidth={true}
                                        error={!!value.errMsg}
                                        helperText={value.errMsg}
                                        value={value.value}
                                        onChange={event => setValue({
                                            value: event.target.value,
                                            errMsg: event.target.value.length > 0 ? undefined : 'Value is required'
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconButton onClick={addItem} style={{ height: 36 }}>
                                        <AddIcon fontSize='small' color='action' />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </React.Fragment>
                )}
                {edit.length === 0 && (
                    <ListItem>
                        <Button onClick={handleSelect} className={classes.doneBtn}>Select</Button>
                        <Button onClick={handleCancel} className={classes.doneBtn}>Cancel</Button>
                    </ListItem>
                )}
                {room.selectionList && room.selectionList.filter(selection => component.id === selection.category.id).map(opt => (
                    <React.Fragment key={opt.id}>
                        <Divider />
                        <ListItem>
                            <Box style={{ width: '100%' }}>
                                <Typography className={classes.subtitle}>
                                    {`Current Selection: < ${buildCrumb(buildPath(opt)).join(' / ')} >`}
                                </Typography>
                                <Box style={{ display: 'flex' }}>
                                    <Typography className={classes.subtitle}>
                                        Options
                                    </Typography>
                                    {edit.length > 0 && (
                                        <IconButton
                                            color='primary'
                                            aria-label='Add'
                                            className={classes.fab}
                                            onClick={showForm}
                                        >
                                            {(Object.keys(opt.option).length > 0) ? <EditIcon fontSize='small' /> : <AddIcon fontSize='small' />}
                                        </IconButton>
                                    )}
                                </Box>
                                {opt.option && Object.keys(opt.option).length > 0 && (
                                    <ul>
                                        {Object.keys(opt.option).map(key => (
                                            <li key={key} style={{ padding: 4, listStyleType: 'disc' }}>{`${key} : ${opt.option[key]}`}</li>
                                        ))}
                                    </ul>
                                )}
                            </Box>
                        </ListItem>
                    </React.Fragment>
                ))}
                {edit.length > 0 && modal && (
                    <React.Fragment>
                        <Divider />
                        <ListItem>
                            <Grid container style={{ maxWidth: 640 }}>
                                {option.map((opt, index) => (
                                    <React.Fragment key={index}>
                                        <Grid item xs={5} style={{ padding: '4px 8px' }}>
                                            <TextField
                                                label="Key"
                                                margin="dense"
                                                fullWidth={true}
                                                value={opt.key.value}
                                                error={!!opt.key.errMsg}
                                                helperText={opt.key.errMsg}
                                                onChange={e => existingKeyChange(index, e.target.value)}
                                                // disabled={true}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={6} style={{ padding: '4px 8px' }}>
                                            <TextField
                                                label="Value"
                                                margin="dense"
                                                fullWidth={true}
                                                value={opt.value.value}
                                                error={!!opt.value.errMsg}
                                                helperText={opt.value.errMsg}
                                                onChange={(e) => existingValueChange(index, e.target.value)}
                                                // disabled={true}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IconButton onClick={() => deleteItem(index)} style={{ height: 36 }}>
                                                <DeleteIcon fontSize='small' color='error' />
                                            </IconButton>
                                        </Grid>
                                    </React.Fragment>
                                ))}
                                <Grid item xs={5} style={{ padding: '4px 8px' }}>
                                    <TextField
                                        label="Key"
                                        margin="dense"
                                        fullWidth={true}
                                        error={!!key.errMsg}
                                        helperText={key.errMsg}
                                        value={key.value}
                                        onChange={keyChange}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{ padding: '4px 8px' }}>
                                    <TextField
                                        label="Value"
                                        margin="dense"
                                        fullWidth={true}
                                        error={!!value.errMsg}
                                        helperText={value.errMsg}
                                        value={value.value}
                                        onChange={event => setValue({
                                            value: event.target.value,
                                            errMsg: event.target.value.length > 0 ? undefined : 'Value is required'
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconButton onClick={addItem} style={{ height: 36 }}>
                                        <AddIcon fontSize='small' color='action' />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </React.Fragment>
                )}
                {edit.length > 0 && (
                    <ListItem>
                        <Button onClick={handleSelect} className={classes.doneBtn}>Select</Button>
                        <Button onClick={handleCancel} className={classes.doneBtn}>Cancel</Button>
                    </ListItem>
                )}
            </List>
            {busy && <CircularProgress className={classes.busy} />}
        </Box>
    );
};

export default Section;
