import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles, createStyles, StyledComponentProps } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import removeMd from 'remove-markdown';

import CustomSnackbar from 'components/shared/CustomSnackbar';
import CustomTableCell from 'components/shared/CustomTableCell';

import { addTemplate, deleteTemplate } from 'store/actions/gen-actions';
import { getProjectData } from 'store/actions/global-actions';
import { getTemplates } from 'store/actions/tem-actions';

import { ISnackbarProps } from 'types/components';
import { Templates } from 'types/global';
import { ProjectInfo } from 'types/project';
import { UserProfile } from 'types/global';

const styles = createStyles(theme => ({
    root: {
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    select: {
        width: '180px',
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 20px)',
        top: 'calc(40vh)',
    },
    successAlert: {
        marginBottom: theme.spacing(1),
    },
    editField: {
        lineHeight: '1.5rem',
    },
    template: {
        padding: theme.spacing(1),
    },
    fab: {
        width: '40px',
        height: '40px',
        marginLeft: '20px',
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
}));

export interface IProjectTemplatesProps extends RouteComponentProps, StyledComponentProps {
    templates: Templates;
    project: ProjectInfo;
    userProfile: UserProfile;
    getTemplates: (page: number, size: number) => Promise<void>;
    addTemplate: (projid: string, templid: string) => Promise<void>;
    deleteTemplate: (projid: string, templid: string) => Promise<void>;
    getProjectData: (id: string) => Promise<void>;
}

export interface IProjectTemplatesState extends ISnackbarProps {
    rowsPerPage: number;
    currentPage: number;
    isBusy: boolean;
    template: string;
}

class ProjectTemplates extends React.Component<IProjectTemplatesProps, IProjectTemplatesState> {
    constructor(props: IProjectTemplatesProps) {
        super(props);

        this.state = {
            rowsPerPage: 20,
            currentPage: 0,
            isBusy: false,
            showMessage: false,
            message: '',
            variant: 'success',
            handleClose: this.closeMessage,
            template: '',
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    componentDidMount() {
        this.props.getTemplates(0, 20);
    }

    handleChangePage = (event, page) => {
        this.setState({ currentPage: page });

        this.props.getTemplates(page, this.state.rowsPerPage);
    };

    handleChangeRowsPerPage = event => {
        const { project } = this.props;
        const rowsPerPage = event.target.value;
        const currentPage =
            rowsPerPage >= project.projectTemplates.length
                ? 0 : this.state.currentPage;

        this.setState({
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
        });

        this.props.getTemplates(currentPage, rowsPerPage);
    };

    addTemplateToProject = async () => {
        const { project } = this.props;
        const { template } = this.state;

        this.setState({ isBusy: true });
        try {
            await this.props.addTemplate(project.id, template);
            await this.props.getProjectData(project.id);
            this.setState({
                template: '',
                showMessage: true,
                message: 'Add Template success',
                variant: 'success',
                isBusy: false
            });
        } catch (error) {
            console.log('ProjectTemplates.addTemplateToProject: ', error);
            this.setState({
                template: '',
                showMessage: true,
                message: 'Add Template failed',
                variant: 'error',
                isBusy: false
            });
        }
    };

    handleChange = event => {
        this.setState({
            template: event.target.value,
        });
    };

    handleDelete = async (templ_id: string) => {
        const { project } = this.props;

        this.setState({ isBusy: true });
        try {
            await this.props.deleteTemplate(project.id, templ_id);
            await this.props.getProjectData(project.id);

            let curPage = this.state.currentPage;
            if (
                this.state.rowsPerPage * this.state.currentPage >=
                project.projectTemplates.length - 1
            ) {
                curPage--;
            }
            await this.props.getTemplates(curPage, this.state.rowsPerPage);
            this.setState({
                showMessage: true,
                message: 'Delete Template success',
                variant: 'success',
                currentPage: curPage,
                isBusy: false
            });
        } catch (error) {
            console.log(error);
            this.setState({
                showMessage: true,
                variant: 'error',
                message: 'Delete Template failed',
                isBusy: false
            });
        }
    }

    render() {
        const { classes, templates, project, match } = this.props;
        const { template } = this.state;
        const editable = match.url.includes('/gen-contractor');

        if (!project) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        return (
            <Box className={classes.root}>
                {editable && (
                    <Box className={classes.template}>
                        <Select
                            className={classes.select}
                            value={template}
                            onChange={this.handleChange}
                            name="templates"
                        >
                            <MenuItem disabled value="">
                                <em>Select a template</em>
                            </MenuItem>
                            {templates &&
                                templates.content.map(row => (
                                    <MenuItem value={row.id} key={row.id}>
                                        {row.name}
                                    </MenuItem>
                                ))}
                        </Select>
                        <Fab
                            color="primary"
                            aria-label="Add"
                            className={classes.fab}
                            onClick={this.addTemplateToProject}
                        >
                            <AddIcon />
                        </Fab>
                        {templates
                            ? templates.content.map(row =>
                                row.id === template ? (
                                    <ul key={row.id}>
                                        <li>Name: {row.name}</li>
                                        <li>Description: {row.description}</li>
                                    </ul>
                                ) : null
                            )
                            : null}
                    </Box>
                )}
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell> Template Name </CustomTableCell>
                            <CustomTableCell align="center">Template Desc</CustomTableCell>
                            <CustomTableCell align="center">Template Value</CustomTableCell>
                            {editable && (
                                <CustomTableCell align="center">
                                    Action
                                </CustomTableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {project.projectTemplates.map(row => (
                            <TableRow className={classes.row} key={row.id} hover>
                                <CustomTableCell component="th" scope="row">
                                    {row.template.name ? row.template.name : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell align="center">
                                    <Typography className="nowrap">
                                        {row.template.description
                                            ? removeMd(row.template.description)
                                            : 'N/A'}
                                    </Typography>
                                </CustomTableCell>
                                <CustomTableCell align="center">
                                    {row.template.value ? row.template.value : 'N/A'}
                                </CustomTableCell>
                                {editable && (
                                    <CustomTableCell align="center">
                                        <IconButton
                                            className={classes.button}
                                            aria-label="Delete"
                                            color="primary"
                                            onClick={() => this.handleDelete(row.template.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CustomTableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    style={{ overflow: 'auto' }}
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={project.projectTemplates.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.currentPage}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                <CustomSnackbar
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={this.state.handleClose}
                />
                {this.state.isBusy && <CircularProgress className={classes.busy} />}
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    templates: state.tem_data.templates,
    project: state.global_data.project,
    userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
    getTemplates,
    addTemplate,
    deleteTemplate,
    getProjectData,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProjectTemplates);  