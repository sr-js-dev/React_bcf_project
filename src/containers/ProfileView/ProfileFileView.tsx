import React from 'react';
import { connect } from 'react-redux';
import { withStyles, StyledComponentProps } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { DropzoneDialog } from 'material-ui-dropzone';

import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CustomTableCell from 'components/shared/CustomTableCell';

import * as ContActions from 'store/actions/cont-actions';
import { UserProfile } from 'types/global';
import { compose } from 'redux';
import styles from './ProfileFileView.style'
import Button from 'components/CustomButtons/Button';


interface ProfileFileViewProps extends StyledComponentProps, withSnackbarProps {
	user: UserProfile;
	contractor: any;
	selectContractor: (id: string) => any;
	uploadFiles: (id: string, file: string) => any;
	removeFile: (id: string, name: string) => any;
}

interface ProfileFileViewState {
	isBusy: boolean;
	openUploadForm: boolean;
	showConfirmDlg: boolean;
	nameToDel: string;
}

class ProfileFileView extends React.Component<ProfileFileViewProps, ProfileFileViewState> {
	constructor(props: Readonly<ProfileFileViewProps>) {
		super(props);

		this.state = {
			openUploadForm: false,
			showConfirmDlg: false,
			isBusy: false,
			nameToDel: '',
		};
	}

	handleUploadFiles = async files => {
		const { user, uploadFiles, selectContractor, showMessage } = this.props;
		this.setState({ isBusy: true });
		let id = user.user_metadata.contractor_id;

		try {
			await uploadFiles(id, files);
			await selectContractor(id);
			this.setState({
				openUploadForm: false,
				isBusy: false,
			});
			showMessage(true, 'Files uploaded');
		} catch (error) {
			console.log('ProfileFileView.handleUploadFiles: ', error);
			this.setState({
				openUploadForm: false,
				isBusy: false,
			});
			showMessage(true, 'Files upload failed');
		}
	};

	closeConfirmDialog = () => {
		this.setState({ showConfirmDlg: false });
	};

	handleDelete = name => {
		this.setState({ showConfirmDlg: true, nameToDel: name });
	};

	handleremoveFile = async () => {
		this.setState({ isBusy: true });
		const { user, removeFile, selectContractor, showMessage } = this.props;
		let id = user.user_metadata.contractor_id;

		try {
			await removeFile(id, this.state.nameToDel);
			await selectContractor(id);
			this.setState({
				showConfirmDlg: false,
				isBusy: false,
			});
			showMessage(true, 'Files deleted');
		} catch (error) {
			this.setState({
				showConfirmDlg: false,
				isBusy: false,
			});
			showMessage(true, 'Files delete failed');
		}
	};

	render() {
		const { classes, contractor, user } = this.props;
		const { isBusy } = this.state;
		const files = contractor.contractorFiles;

		return (
			<Box className={classes.root}>
				{isBusy && <CircularProgress size={32} thickness={4} />}
				<Paper className={classes.contents}>
					<Table className={classes.relative} size="small">
						<TableHead>
							<TableRow>
								<CustomTableCell align="center">Name</CustomTableCell>
								<CustomTableCell align="center">
									<IconButton
										className={classes.button}
										aria-label="Add"
										style={{ color: '#FFFFFF' }}
										onClick={() => this.setState({ openUploadForm: true })}
									>
										<NoteAddIcon />
									</IconButton>
								</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{files.map(row => (
								<TableRow className={classes.row} key={row.id} hover>
									<CustomTableCell component="th" scope="row" align="center">
										<a
											download={row.name}
											href={
												process.env.REACT_APP_PROJECT_API +
												'/contractors/' +
												user.user_metadata.contractor_id +
												'/files/' +
												row.name
											}
										>
											{row.name}
										</a>
									</CustomTableCell>
									<CustomTableCell align="center">
										<IconButton
											className={classes.button}
											aria-label="Delete"
											color="primary"
											onClick={() => this.handleDelete(row.name)}
										>
											<DeleteIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>
				<DropzoneDialog
					open={this.state.openUploadForm}
					onSave={this.handleUploadFiles}
					maxFileSize={52428800}
					acceptedFiles={[
						'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
					]}
					filesLimit={100}
					onClose={() => this.setState({ openUploadForm: false })}
				/>
				<Dialog
					open={this.state.showConfirmDlg}
					onClose={this.closeConfirmDialog}
					aria-labelledby="alert-dialog-title"
				>
					<DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
					<DialogContent className={classes.relative}>
						<DialogContentText id="alert-dialog-description">
							Do you really want to delete this file?
            			</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.closeConfirmDialog} autoFocus>
							Cancel
            			</Button>
						<Button onClick={this.handleremoveFile} color="primary">
							Yes
            			</Button>
					</DialogActions>
				</Dialog>
			</Box>
		);
	}
}

const mapStateToProps = state => ({
	contractor: state.cont_data.selectedContractor,
	user: state.global_data.userProfile,
});
const mapDispatchToProps = {
	selectContractor: ContActions.selectContractor,
	uploadFiles: ContActions.uploadFiles,
	removeFile: ContActions.removeFile,
};

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(withSnackbar(ProfileFileView));
