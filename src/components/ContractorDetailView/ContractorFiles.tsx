import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { DropzoneDialog } from 'material-ui-dropzone';

import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import {
    uploadFiles,
    removeFile,
    getContractorDetailById
} from 'store/actions/cont-actions';
import { ContractorInfo } from 'types/contractor';

const styles = createStyles(theme => ({
    root: {
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)'
    },
    titleBtn: {
        color: '#fff',
        padding: '6px',
    },
    button: {
        padding: '6px',
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)'
    }
}));

export interface IContractorFilesProps {
    contractorUpdated: () => Promise<void>;
    uploadFiles: (id: string, files: File[]) => Promise<void>;
    removeFile: (id: string, name: string) => Promise<void>;
    getContractorDetailById: (id: string) => Promise<void>;
    contractor: ContractorInfo;
    classes: ClassNameMap<string>;
    edit: boolean;
}

export interface IContractorFilesState extends ISnackbarProps {
    openUploadForm: boolean;
    isBusy: boolean;
    files: File[];
}

class ContractorFiles extends React.Component<IContractorFilesProps, IContractorFilesState> {
    constructor(props: IContractorFilesProps) {
        super(props);

        this.state = {
            openUploadForm: false,
            isBusy: false,
            files: [],
            showMessage: false,
            variant: 'success',
            message: '',
            handleClose: this.closeMessage
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleUploadFiles = async files => {
        const { contractor } = this.props;

        this.setState({ isBusy: true });
        try {
            await this.props.uploadFiles(contractor.id, files);
            await this.props.contractorUpdated();
            this.setState({
                openUploadForm: false,
                isBusy: false,
                showMessage: true,
                message: 'File Upload Success',
                variant: 'success'
            });
        } catch (error) {
            console.log('ContractorFiles.handleUploadFiles: ', error);
            this.setState({
                openUploadForm: false,
                isBusy: false,
                showMessage: true,
                message: 'File Upload Failed',
                variant: 'error'
            });
        }
    }

    handleDeleteFile = async name => {
        const { contractor } = this.props;

        this.setState({
            isBusy: true,
        });

        try {
            await this.props.removeFile(contractor.id, name);
            await this.props.contractorUpdated();
            // await this.props.getContractorDetailById(contractor.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'File Delete Success',
                variant: 'success'
            });
        } catch (error) {
            console.log('ContractorFiles.handleDeleteFile: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'File Delete Failed',
                variant: 'error'
            });
        }
    };


    public render() {

        const { classes, contractor, edit } = this.props;
        const contractorFiles = contractor.contractorFiles;
        const remoteRoot = process.env.REACT_APP_PROJECT_API + '/contractors/' + contractor.id + '/files/';

        return (
            <Box className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell align="center">Name</CustomTableCell>
                            {edit && (
                                <CustomTableCell align="center">
                                    <IconButton
                                        className={classes.titleBtn}
                                        onClick={() => this.setState({ openUploadForm: true })}
                                    >
                                        <NoteAddIcon />
                                    </IconButton>
                                </CustomTableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contractorFiles.map(row => (
                            <TableRow className={classes.row} key={row.id} hover>
                                <CustomTableCell component="th" scope="row" align="center">
                                    <a download={row.name} href={remoteRoot + row.name}>
                                        {row.name}
                                    </a>
                                </CustomTableCell>
                                {edit && (
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
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <DropzoneDialog
                    open={this.state.openUploadForm}
                    onSave={this.handleUploadFiles}
                    maxFileSize={52428800}
                    showPreviewsInDropzone={true}
                    showPreviews={false}
                    acceptedFiles={[
                        'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
                    ]}
                    filesLimit={100}
                    onClose={() => this.setState({ openUploadForm: false })}
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

const mapDispatchToProps = {
    uploadFiles,
    removeFile,
    getContractorDetailById
};

export default compose(
    withStyles(styles),
    connect(
        null,
        mapDispatchToProps
    )
)(ContractorFiles);
