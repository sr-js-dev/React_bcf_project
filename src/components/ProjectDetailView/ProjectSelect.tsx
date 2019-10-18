import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';

import MuiTreeView from 'material-ui-treeview';

import ProjectOptionView from 'components/OptionsView';
import * as TemplActions from 'store/actions/tem-actions';
import TempApi from 'services/template';
import ProjApi from 'services/project';
import { ProjectLevel, ProjectInfo, ProjectLevelCategory } from 'types/project';
import { UserProfile, NodeInfo } from 'types/global';


const styles = createStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        minHeight: '100%',
    },
    sidebar: {
        borderRight: `1px solid ${theme.palette.divider}`,
        minWidth: 200,
        padding: theme.spacing(1)
    },
    select: {
        paddingLeft: theme.spacing(2),
    },
    contents: {
        padding: theme.spacing(0, 2),
        flex: 1,
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)',
    },
    buttonContainer: {
        textAlign: 'center',
        width: '100%',
        padding: theme.spacing(1)
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    }
}));

export interface IProjectSelectProps extends RouteComponentProps, StyledComponentProps {
    levels: ProjectLevel[];
    roots: NodeInfo[];
    userProfile: UserProfile;
    project: ProjectInfo;
}

interface IProjectSelectState {
    rootId: string;
    level: string;
    tree: Array<any>
    currentRoot?: NodeInfo;
    currentRoom?: ProjectLevelCategory;
    isBusy: boolean;
}

class ProjectSelect extends React.Component<IProjectSelectProps, IProjectSelectState> {
    constructor(props: Readonly<IProjectSelectProps>) {
        super(props);

        this.state = {
            currentRoot: undefined,
            currentRoom: undefined,
            rootId: (props.roots && props.roots.length > 0) ? props.roots[0].id : '',
            level: '',
            tree: props.levels.map(level => ({
                id: level.id,
                value: level.name,
                nodes: level.rooms.map(room => ({
                    id: room.id,
                    value: room.name
                }))
            })),
            isBusy: false
        }
    }

    async componentDidMount() {
        if (this.state.rootId && this.state.rootId.length > 0) {
            try {
                const data = await TempApi.getNode(this.state.rootId);
                this.setState({ currentRoot: data });
            } catch (error) {
                console.log('ProjectSelect.CDM: ', error);
            }
        }
    }


    rootChange = async event => {
        this.setState({ isBusy: true });
        try {
            const data = await TempApi.getNode(event.target.value);
            this.setState({ currentRoot: data, rootId: event.target.value, isBusy: false });
        } catch (error) {
            console.log('ProjectSelect.CDM: ', error);
            this.setState({ isBusy: false });
        }
    }

    roomSelected = async leaf => {
        if (!leaf.parent) return;

        this.setState({ isBusy: true });
        try {
            const data = await ProjApi.getRoom(leaf.id);
            this.setState({
                currentRoom: data,
                level: leaf.parent.id,
                isBusy: false
            });
        } catch (error) {
            console.log('ProjectSelect.RoomSelected: ', error);
            this.setState({ isBusy: false });
        }
    }

    roomUpdated = async () => {
        try {
            const data = await ProjApi.getRoom(this.state.currentRoom.id);
            this.setState({ currentRoom: data });
        } catch (error) {
            console.log('ProjectSelect.RoomUpdated: ', error);
        }
    }

    public render() {
        const { classes, levels, roots } = this.props;
        const { rootId, level, tree, currentRoot, currentRoom, isBusy } = this.state;

        if (!levels) {
            return <Box className={classes.root}>No levels exist</Box>
        }
        if (!rootId || rootId.length === 0 || !currentRoot) {
            return <Box className={classes.root}>No template selected</Box>
        }

        let curLevel: ProjectLevel = undefined;
        for (let lvl of levels) {
            if (lvl.id === level) {
                curLevel = lvl;
                break;
            }
        }

        return (
            <Box className={classes.root}>
                <Box className={classes.sidebar}>
                    <Typography component='h3' variant='h6' style={{ paddingTop: 8, fontSize: '1.2em' }}>Templates</Typography>
                    <Select
                        value={rootId}
                        onChange={this.rootChange}
                        name='root-template'
                        fullWidth
                        className={classes.select}
                    >
                        {roots.map(node => (
                            <MenuItem key={node.id} value={node.id}>{node.name}</MenuItem>
                        ))}
                    </Select>
                    <Typography component='h3' variant='h6' style={{ paddingTop: 16, paddingBottom: 8, fontSize: '1.2em' }}>Levels</Typography>
                    <MuiTreeView tree={tree} onLeafClick={this.roomSelected} />
                </Box>
                <Box className={classes.contents}>
                    {currentRoom && (
                        <ProjectOptionView
                            root={currentRoot}
                            level={curLevel}
                            room={currentRoom}
                            roomUpdated={this.roomUpdated}
                        />
                    )}
                    {!currentRoom && 'No room selected'}
                </Box>
                {isBusy && <CircularProgress className={classes.busy} />}
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    // currentNode: state.tem_data.currentNode,
    nodeTree: state.tem_data.nodeTree,
    userProfile: state.global_data.userProfile,
    roots: state.tem_data.roots,
    levels: state.gen_data.levels
});

const mapDispatchToProps = dispatch => ({
    selectTree: id => dispatch(TemplActions.selectTree(id)),
    appendTree: (name, id) => dispatch(TemplActions.appendTree(name, id)),
    clearTree: () => dispatch(TemplActions.clearTree()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectSelect));