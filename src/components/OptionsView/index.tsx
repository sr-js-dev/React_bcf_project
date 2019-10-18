import * as React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ProjectLevel, ProjectLevelCategory } from 'types/project';
import { NodeInfo } from 'types/global';

import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import Section from './Section';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        minHeight: '100%',
        position: 'relative',
        paddingTop: theme.spacing(1)
    },
    titlebar: {
        padding: theme.spacing(0),
        fontSize: '1.5em',
    },
    levelbar: {
        padding: theme.spacing(1, 0)
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
        color: '#222'
    },
    value: {
        fontWeight: 500,
        fontSize: '1.0em',
        padding: theme.spacing(0, 1),
        color: '#222',
        flexGrow: 1,
        textAlign: 'right',
    },
}));

interface IProjectOptionEditProps {
    root: NodeInfo;
    level: ProjectLevel;
    room: ProjectLevelCategory;
    roomUpdated: () => Promise<void>;
}

const ProjectOptionEdit: React.SFC<IProjectOptionEditProps & withSnackbarProps> = (props) => {
    const classes = useStyles({});
    const { root, level, room, roomUpdated } = props;

    if (!level || !room) {
        return <Box className={classes.root}>No level or room selected</Box>
    }

    return (
        <Box className={classes.root}>
            <List aria-label='project-options' style={{ padding: '16px 0' }}>
                <ListItem className={classes.titlebar}>
                    <Typography className={classes.title}>
                        {root.name}&nbsp;&nbsp;&nbsp;
                        <span className={classes.subtitle}>{root.description}</span>
                    </Typography>
                </ListItem>
                <ListItem alignItems='flex-start' className={classes.levelbar}>
                    <Box style={{ width: '100%' }}>
                        <Typography className={classes.title}>
                            {room.name}
                            &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                            <span className={classes.subtitle}>{room.type}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span className={classes.subtitle}>
                                {`( ${level.name} : ${level.description} )`}
                            </span>
                        </Typography>
                        <Box style={{ display: 'flex' }}>
                            <Grid container direction='row-reverse'>
                                <Grid item xs={12} md={8} style={{ padding: '8px 16px' }}>
                                    <Typography className={classes.subtitle}>Description:</Typography>
                                    {room.description && <Typography variant='body2'>{room.description}</Typography>}
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: '8px 16px', display: 'flex' }}>
                                    <Box>
                                        <Typography style={{ display: 'flex' }}>
                                            {'Width:'}<span className={classes.value}>{room.w}</span>
                                        </Typography>
                                        <Typography style={{ display: 'flex' }}>
                                            {'Height:'}<span className={classes.value}>{room.h}</span>
                                        </Typography>
                                        <Typography style={{ display: 'flex' }}>
                                            {'Length:'}<span className={classes.value}>{room.l}</span>
                                        </Typography>
                                    </Box>
                                    <Box style={{ flexGrow: 1 }}>
                                        <Typography style={{ flexGrow: 1 }}>m</Typography>
                                        <Typography style={{ flexGrow: 1 }}>m</Typography>
                                        <Typography style={{ flexGrow: 1 }}>m</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </ListItem>
                <Divider />
            </List>
            {root && root.children && root.children.length > 0 && root.children.map(item => (
                <Section
                    key={item.id}
                    component={item}
                    room={room}
                    roomUpdated={roomUpdated}
                    showMessage={props.showMessage}
                />
            ))}
            {/* {component && (
                    <React.Fragment>
                        <ListItem>
                            <Typography className={classes.title}>
                                {`Component: ${component.name} ( ${component.description} )`}
                            </Typography>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                )}
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
                        Select Category
                    </Typography>
                    <Select
                        style={{ minWidth: 180 }}
                        value={selection ? selection.id : ''}
                        onChange={nodeChange}
                        name="sub-nodes"
                        className={classes.catBox}
                    >
                        {node && node.children && node.children.map(item => (
                            <MenuItem value={item.id} key={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {selection && (
                        <Typography className={classes.subtitle}>
                            &nbsp;&nbsp;&nbsp;&nbsp;{selection.description}
                        </Typography>
                    )}
                </ListItem>
                {component && selection && (
                    <ListItem>
                        <Typography className={classes.bold}>
                            {(edit.length > 0) ? 'Edit Options' : 'Add Options'}
                        </Typography>
                        <Fab
                            color="primary"
                            aria-label="Add"
                            className={classes.fab}
                            onClick={() => setModal(true)}
                        >
                            {(edit.length > 0) ? <EditIcon /> : <AddIcon />}
                        </Fab>
                        {modal && (
                            <>
                                <Button onClick={handleSelect} className={classes.doneBtn}>Select</Button>
                                <Button onClick={handleCancel} className={classes.doneBtn}>Cancel</Button>
                            </>
                        )}
                    </ListItem>
                )}
                {component && room.selectionList &&
                    room.selectionList.filter(selection => component.id === selection.category.id).map(opt => (
                        <React.Fragment key={opt.id}>
                            <Divider />
                            <ListItem>
                                <Box style={{ width: '100%' }}>
                                    <Typography className={classes.subtitle}>
                                        {`Current Options ( ${buildCrumb(buildPath(opt)).join(' / ')} )`}
                                    </Typography>
                                    {Object.keys(opt.option).map(key => (
                                        <Typography key={key} style={{ paddingLeft: 32 }}>{`${key} : ${opt.option[key]}`}</Typography>
                                    ))}
                                </Box>
                            </ListItem>
                        </React.Fragment>
                    ))}
            </List>
            <Box hidden={!modal} style={{ maxWidth: 640 }}>
                <Grid container>
                    {Object.keys(option).map(itemKey => (
                        <React.Fragment key={itemKey}>
                            <Grid item xs={5} style={{ padding: '4px 8px' }}>
                                <TextField
                                    label="Key"
                                    margin="dense"
                                    fullWidth={true}
                                    value={itemKey}
                                    disabled={true}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} style={{ padding: '4px 8px' }}>
                                <TextField
                                    label="Value"
                                    margin="dense"
                                    fullWidth={true}
                                    value={option[itemKey]}
                                    disabled={true}
                                    required
                                />
                            </Grid>
                            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconButton onClick={() => deleteItem(itemKey)} style={{ height: 36 }}>
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
                                errMsg: event.target.value.length > 0 ? undefined : 'Key is required'
                            })}
                        />
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton onClick={addItem} style={{ height: 36 }}>
                            <AddIcon fontSize='small' color='action' />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            {busy && <CircularProgress className={classes.busy} />} */}
        </Box>
    );
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default withSnackbar<IProjectOptionEditProps>(connect(mapStateToProps, mapDispatchToProps)(ProjectOptionEdit));