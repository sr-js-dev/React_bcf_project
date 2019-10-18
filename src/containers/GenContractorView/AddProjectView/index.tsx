import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { compose } from "redux";

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import SecuredRoute from 'routers/SecuredRoute';
import AddProjectOverview, { ProjectBriefInfo } from './Overview';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import CustomTabs from "components/shared/CustomTabs";
import ProjectLevels from 'components/ProjectDetailView/ProjectLevels';
import ProjectSelect from 'components/ProjectDetailView/ProjectSelect';
import {
    addFilesToProject,
    addProject,
    createLevel,
    createRoom,
    updateLevel,
    updateRoom,
    deleteLevel,
    deleteRoom,
    getLevels,
    clearLevels
} from 'store/actions/gen-actions';
import { loadRoots } from 'store/actions/tem-actions';

import { UserProfile } from 'types/global';
import { ProjectLevel, ProjectPostInfo, ProjectLevelCategory } from 'types/project';

// mocking data/api
// import { initLevels } from './mock';

const styles = theme => createStyles({
    root: {
        position: 'relative',
        minHeight: '100%',
    },
    contents: {
        width: '100%',
        flex: 1,
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
    fileUpload: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(1)
    },
    fileItem: {
        margin: '6px',
        padding: theme.spacing(1),
        border: '1px solid #CCC',
    },
    textFieldHalf: {
        width: 'calc(50% - 8px)',
        paddingRight: theme.spacing(1)
    },
});

interface IAddProjectViewProps extends RouteComponentProps {
    classes: ClassNameMap<string>;
    userProfile: UserProfile;
    addFilesToProject: (projId: string, files: Array<File>) => void;
    addProject: (contId: string, data: ProjectPostInfo) => Promise<string>;
    createLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
    updateLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
    deleteLevel: (id: string) => Promise<void>;
    createRoom: (id: string, room: {
        number: number,
        name: string,
        type: string,
        description: string,
        w: number,
        h: number,
        l: number
    }) => Promise<any>;
    updateRoom: (id: string, cat: ProjectLevelCategory) => Promise<any>;
    deleteRoom: (id: string) => Promise<void>;
    getLevels: (id: string) => Promise<void>;
    clearLevels: () => void;
    loadRoots: () => Promise<void>;
    levels: ProjectLevel[];
}

interface IAddProjectViewState extends ISnackbarProps, ProjectBriefInfo {
    isBusy: boolean;
    project: any;
}

class AddProjectView extends React.Component<IAddProjectViewProps, IAddProjectViewState> {
    constructor(props: IAddProjectViewProps) {
        super(props);

        this.state = {
            title: '',
            price: 0,
            description: '',
            dueDate: new Date(),
            isBusy: false,
            files: [],
            showMessage: false,
            message: '',
            variant: 'error',
            handleClose: this.closeMessage,
            project: undefined,
        }
    }

    async componentDidMount() {
        await this.props.clearLevels();
        await this.props.loadRoots();
    }


    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleAddProject = async () => {
        const { userProfile, history } = this.props;
        const { files, title, description, price, dueDate } = this.state;
        if (this.state.project) {
            history.push('/gen-contractor/add_project/add-levels');
            return;
        }

        if (title.length === 0 || description.length === 0 || price === 0) {
            this.setState({
                showMessage: true,
                message: 'You must fill in all the items',
            });
            return;
        }

        const projectData = {
            title,
            description,
            budget: price,
            updatedBy: userProfile.email,
            due: dueDate
        };

        this.setState({ isBusy: true });

        let project = undefined;
        try {
            project = await this.props.addProject(userProfile.user_metadata.contractor_id, projectData);
            await this.props.addFilesToProject(project.id, files);
            this.setState({
                isBusy: false,
                project,
                showMessage: true,
                variant: 'success',
                message: 'Add project success'
            });
        } catch (error) {
            this.setState({
                isBusy: false,
                showMessage: true,
                variant: 'error',
                message: 'Add project failed.',
                project: undefined
            });
        }
    };

    handleFileChange = e => {
        this.setState({ files: [...this.state.files, ...e.target.files] });
    };

    handleRemove = file => {
        const { files } = this.state;

        for (let i = 0; i < files.length; i++) {
            if (files[i].name === file.name && files[i].size === file.size) {
                files.splice(i, 1);
                break;
            }
        }

        this.setState({ files: [...files] });
    };

    handleDateChange = (date) => {
        this.setState({ dueDate: date });
    };

    handleDescChange = value => {
        this.setState({ description: value });
    };

    handleTitleChange = value => {
        this.setState({ title: value });
    }

    handlePriceChange = value => {
        this.setState({ price: value });
    }

    addLevel = async (number, name, desc) => {
        const { project } = this.state;
        if (!project) {
            this.setState({
                showMessage: true,
                message: 'You should post a project first',
                variant: 'warning'
            });

            return;
        }

        const { createLevel, getLevels } = this.props;
        this.setState({ isBusy: true });
        try {
            await createLevel(project.id, { number, name, description: desc });
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Add Level success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.AddLevel: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Add Level failed',
                variant: 'error'
            });
        }
    }

    updateLevel = async (id: string, no: number, name: string, desc: string) => {
        const { project } = this.state;

        this.setState({ isBusy: true });
        try {
            await this.props.updateLevel(id, { number: no, name, description: desc });
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Update Level success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.UpdateLevel: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Update Level failed',
                variant: 'error'
            });
        }
    }

    deleteLvl = async (id: string) => {
        const { project } = this.state;
        const { deleteLevel, getLevels } = this.props;
        if (!project) return;

        this.setState({ isBusy: true });
        try {
            await deleteLevel(id);
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete Level success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.RemoveLevel: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete Level failed',
                variant: 'error'
            });
        }
    }

    addCategory = async (id: string, cat: ProjectLevelCategory) => {
        const { createRoom, getLevels } = this.props;
        const { project } = this.state;

        this.setState({ isBusy: true });
        try {
            await createRoom(id, {
                number: cat.number,
                name: cat.name,
                type: cat.type,
                description: cat.description,
                w: cat.w,
                l: cat.l,
                h: cat.h
            });
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Create Room success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.AddRoom: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Create Room failed',
                variant: 'error'
            });
        }
    }

    updateCategory = async (id: string, cat: ProjectLevelCategory) => {
        const { updateRoom, getLevels } = this.props;
        const { project } = this.state;

        this.setState({ isBusy: true });
        try {
            await updateRoom(cat.id, cat);
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Update Room success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.UpdateRoom: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Update Room failed',
                variant: 'error'
            });
        }
    }

    deleteCategory = async (id: string, catId: string) => {
        const { deleteRoom, getLevels } = this.props;
        const { project } = this.state;

        this.setState({ isBusy: true });
        try {
            await deleteRoom(catId);
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete Room success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.DeleteRoom: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete Room failed',
                variant: 'error'
            });
        }
    }

    public render() {
        const { classes, match, location, levels } = this.props;
        const { title, price, description, dueDate, files, isBusy, project } = this.state;
        const tabs = [
            { href: `${match.url}/submitted`, label: 'Overview' },
            { href: `${match.url}/add-levels`, label: 'Levels' },
            { href: `${match.url}/select`, label: 'Select' }
        ];

        let tab = tabs.map(tab => tab.href).indexOf(location.pathname);
        if (tab < 0) tab = 0;

        return (
            <Box className={classes.root}>
                <CustomTabs init={tab} tabs={tabs} />
                <Box className={classes.contents}>
                    <Switch>
                        <SecuredRoute
                            path={tabs[0].href}
                            render={props => (
                                <AddProjectOverview {...props}
                                    title={title}
                                    price={price}
                                    description={description}
                                    dueDate={dueDate}
                                    files={files}
                                    isBusy={isBusy}
                                    handleFileChange={this.handleFileChange}
                                    handleRemove={this.handleRemove}
                                    handleDateChange={this.handleDateChange}
                                    handleDescChange={this.handleDescChange}
                                    handleTitleChange={this.handleTitleChange}
                                    handlePriceChange={this.handlePriceChange}
                                    handleAdd={this.handleAddProject}
                                    project={project}
                                />
                            )}
                        />
                        <SecuredRoute
                            path={tabs[1].href}
                            render={props => (
                                <ProjectLevels {...props}
                                    levels={levels}
                                    addLevel={this.addLevel}
                                    deleteLevel={this.deleteLvl}
                                    updateLevel={this.updateLevel}
                                    addCategory={this.addCategory}
                                    updateCategory={this.updateCategory}
                                    deleteCategory={this.deleteCategory}
                                />
                            )}
                        />
                        <SecuredRoute
                            path={tabs[2].href}
                            component={ProjectSelect}
                        />
                        <Redirect path={`${match.url}`} to={tabs[0].href} />
                    </Switch>
                </Box>
                {this.state.isBusy && <CircularProgress className={classes.busy} />}
                <CustomSnackbar
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={this.state.handleClose}
                />
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    levels: state.gen_data.levels,
    roots: state.tem_data.roots,
    // templates: state.tem_data.templates ? state.tem_data.templates.content || [] : [],
});

const mapDispatchToProps = {
    addProject,
    addFilesToProject,
    createLevel,
    createRoom,
    updateLevel,
    updateRoom,
    deleteLevel,
    deleteRoom,
    getLevels,
    clearLevels,
    loadRoots
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(styles),
)(AddProjectView);