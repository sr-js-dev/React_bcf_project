import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { DropzoneDialog } from 'material-ui-dropzone';

import CustomSnackbar from 'components/shared/CustomSnackbar';
import CustomTableCell from 'components/shared/CustomTableCell';
import { ProjectInfo } from 'types/project';
import { ISnackbarProps } from 'types/components';
import { addFilesToProject, deleteFileFromProject } from 'store/actions/gen-actions';
import { getProjectData } from 'store/actions/global-actions';

const styles = createStyles(theme => ({
    root: {
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)'
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
}));

export interface IProjectFilesProps extends RouteComponentProps {
    project: ProjectInfo;
    classes: ClassNameMap<string>;
    addFiles: (id: string, files: File[]) => Promise<void>;
    getProjectData: (id: string) => Promise<void>;
    deleteFile: (id: string, name: string) => Promise<void>;
}

export interface IProjectFilesState extends ISnackbarProps {
    openForm: boolean;
    isBusy: boolean;
}

class ProjectFiles extends React.Component<IProjectFilesProps, IProjectFilesState> {
    constructor(props: IProjectFilesProps) {
        super(props);

        this.state = {
            isBusy: false,
            showMessage: false,
            variant: 'success',
            message: '',
            handleClose: this.closeMessage,
            openForm: false
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleUploadFiles = async files => {
        const { project } = this.props;

        this.setState({ isBusy: true });
        try {
            await this.props.addFiles(project.id, files);
            await this.props.getProjectData(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'File Upload Success',
                variant: 'success',
                openForm: false
            });
        } catch (error) {
            console.log(error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'File Upload Failed',
                variant: 'error',
                openForm: false
            });
        }
    };

    handleDeleteFile = async name => {
        const { project } = this.props;

        this.setState({ isBusy: true });
        try {
            await this.props.deleteFile(project.id, name);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete file succeeded',
                variant: 'success'
            });
            await this.props.getProjectData(project.id);
        } catch (error) {
            console.log(error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete file failed',
                variant: 'error'
            });
        }
    };

    public render() {
        const { classes, project, location } = this.props;
        const projectFiles = project.projectFiles;

        const readonly = location.pathname.includes('/projects');
        const remoteRoot = process.env.REACT_APP_PROJECT_API + '/projects/' + project.id + '/files/';

        return (
            <Box className={classes.root}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <CustomTableCell align="center">Name</CustomTableCell>
                            {
                                !readonly && (
                                    <CustomTableCell align="center">
                                        <IconButton
                                            style={{ color: '#fff' }}
                                            onClick={() => this.setState({ openForm: true })}
                                        >
                                            <NoteAddIcon />
                                        </IconButton>
                                    </CustomTableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectFiles.map(row => (
                            <TableRow className={classes.row} key={row.id} hover>
                                <CustomTableCell component="th" scope="row" align="center">
                                    <a download={row.name} href={remoteRoot + row.name}>
                                        {row.name}
                                    </a>
                                </CustomTableCell>
                                {
                                    !readonly && (
                                        <CustomTableCell align="center">
                                            <IconButton
                                                className={classes.button}
                                                aria-label="Delete"
                                                color="primary"
                                                onClick={() => this.handleDeleteFile(row.name)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </CustomTableCell>
                                    )
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <DropzoneDialog
                    open={this.state.openForm}
                    onSave={this.handleUploadFiles}
                    maxFileSize={52428800}
                    showPreviews={false}
                    showPreviewsInDropzone={true}
                    acceptedFiles={[
                        'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
                    ]}
                    filesLimit={100}
                    onClose={() => this.setState({ openForm: false })}
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
    project: state.global_data.project,
});

const mapDispatchToProps = {
    addFiles: addFilesToProject,
    getProjectData,
    deleteFile: deleteFileFromProject,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProjectFiles);
