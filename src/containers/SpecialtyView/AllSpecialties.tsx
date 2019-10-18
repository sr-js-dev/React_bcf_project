import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { withStyles, createStyles, StyledComponentProps, Theme } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import Button from 'components/CustomButtons/Button';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import SpecTableView from './SpecTableView';
import { createSpec, deleteSpec, loadSpecs, loadSpec } from 'store/actions/spec-actions';
import { SpecialtyPostInfo, UserProfile, Specialties } from 'types/global';

const styles = createStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		position: 'relative',
		minHeight: 'calc(100vh - 64px - 56px - 8px)',
		overflow: 'auto'
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 16px)',
		top: 'calc(50% - 16px)',
	},
}));

interface IAllSpecialtiesProps extends RouteComponentProps, StyledComponentProps {
	dirty: boolean;
	loadSpecs: (page: number, size: number) => Promise<void>;
	deleteSpec: (id: string) => Promise<void>;
	createSpec: (info: SpecialtyPostInfo) => Promise<void>;
	loadSpec: (id: string) => Promise<void>;
	userProfile: UserProfile;
	specialties: Specialties;
}

interface IAllSpecialtiesState extends ISnackbarProps {
	isBusy: boolean;
	showConfirmDlg: boolean;
	showNewDlg: boolean;
	newSpec: SpecialtyPostInfo;
	currentPage: number;
	pageSize: number;
}

class AllSpecialties extends Component<IAllSpecialtiesProps, IAllSpecialtiesState> {

	specId: string;
	constructor(props: Readonly<IAllSpecialtiesProps>) {
		super(props);

		this.state = {
			currentPage: 0,
			pageSize: 20,
			isBusy: false,
			showNewDlg: false,
			showConfirmDlg: false,
			newSpec: {
				name: '',
				value: '',
				description: '',
			},
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	async componentDidMount() {
		if (this.props.dirty) {
			this.setState({ isBusy: true });
			await this.props.loadSpecs(this.state.currentPage, this.state.pageSize);
			this.setState({ isBusy: false });
		}
	}

	showAddDialog = () => {
		this.setState({
			showNewDlg: true,
			isBusy: false,
			newSpec: { name: '', value: '', description: '' },
		});
	};

	showConfirmDialog = () => {
		this.setState({ showConfirmDlg: true, isBusy: false });
	};

	closeConfirmDialog = () => {
		this.setState({ showConfirmDlg: false });
	};

	handleAdd = async spec => {
		const data = { ...spec, updatedBy: this.props.userProfile.email };
		const { currentPage, pageSize } = this.state;
		this.setState({ isBusy: true });

		try {
			await this.props.createSpec(data);
			await this.props.loadSpecs(currentPage, pageSize);
			this.setState({
				isBusy: false,
				showNewDlg: false,
				showMessage: true,
				variant: 'success',
				message: 'Specialty Add success'
			});
		} catch (error) {
			this.setState({
				isBusy: false,
				showNewDlg: false,
				showMessage: true,
				variant: 'error',
				message: 'Specialty Add failed'
			});
		}
	};

	handleDelete = async specid => {
		this.specId = specid;
		this.showConfirmDialog();
	};

	delete = async () => {
		if (!this.specId) return;
		const { currentPage, pageSize } = this.state;

		this.setState({ isBusy: true });
		try {
			await this.props.deleteSpec(this.specId);
			await this.props.loadSpecs(currentPage, pageSize);
			this.setState({
				isBusy: false,
				showConfirmDlg: false,
				showMessage: true,
				variant: 'success',
				message: 'Specialty Delete success'
			});
		} catch (error) {
			this.setState({
				showConfirmDlg: false,
				isBusy: false,
				showMessage: true,
				variant: 'error',
				message: 'specialty Delete failed',
			});
		}
	};

	handleSelect = async specid => {
		await this.props.loadSpec(specid);
		this.props.history.push('/m_spec/specialty_detail');
	};

	handleChangePage = async (event, page) => {
		const { specialties } = this.props;
		const { pageSize } = this.state;
		if (specialties) {
			this.setState({ isBusy: true });
			try {
				if (page >= specialties.totalPages) page = specialties.totalPages - 1;
				await this.props.loadSpecs(page, pageSize);
				this.setState({
					isBusy: false,
					currentPage: page
				});
			} catch (error) {
				console.log('AllSpecialties.handleChangePage: ', error);
				this.setState({ isBusy: false });
			}
		}
	};

	handleChangeRowsPerPage = async event => {
		const { currentPage, pageSize } = this.state;
		const curIndex = currentPage * pageSize;
		const newPageSize = event.target.value;
		const newPage = Math.floor(curIndex / newPageSize);

		try {
			this.setState({ isBusy: true });
			await this.props.loadSpecs(newPage, newPageSize);
			this.setState({
				isBusy: false,
				currentPage: newPage,
				pageSize: newPageSize
			});
		} catch (error) {
			console.log('AllSpecialties.handleChangeRowsPerPage: ', error);
			this.setState({ isBusy: false });
		};
	}

	render() {
		const { classes, specialties } = this.props;
		const { currentPage, pageSize } = this.state;
		if (!specialties) {
			return <CircularProgress className={classes.busy} />;
		}

		return (
			<Paper className={classes.root}>
				<SpecTableView
					specialties={specialties.content}
					handleDelete={this.handleDelete}
					handleAdd={this.showAddDialog}
					handleSelect={this.handleSelect}
				/>
				<TablePagination
					style={{ overflow: 'auto' }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={specialties.totalElements}
					rowsPerPage={pageSize}
					page={currentPage}
					backIconButtonProps={{ 'aria-label': 'Previous Page' }}
					nextIconButtonProps={{ 'aria-label': 'Next Page' }}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
				<Dialog
					open={this.state.showNewDlg}
					onClose={() => this.setState({ showNewDlg: false })}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Create Specialty</DialogTitle>
					<DialogContent className={classes.relative}>
						<DialogContentText>
							please input the correct specialty information
            			</DialogContentText>
						<TextField
							autoFocus
							margin="normal"
							label="name"
							fullWidth
							value={this.state.newSpec.name}
							onChange={val =>
								this.setState({
									newSpec: { ...this.state.newSpec, name: val.target.value },
								})
							}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="normal"
							label="value"
							fullWidth
							value={this.state.newSpec.value}
							onChange={val =>
								this.setState({
									newSpec: { ...this.state.newSpec, value: val.target.value },
								})
							}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							label="description"
							margin="dense"
							multiline
							rows="6"
							fullWidth
							value={this.state.newSpec.description}
							onChange={val =>
								this.setState({
									newSpec: { ...this.state.newSpec, description: val.target.value },
								})
							}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							disabled={this.state.isBusy}
							onClick={() => this.setState({ showNewDlg: false })}
						>
							Cancel
            			</Button>
						<Button
							disabled={this.state.isBusy}
							onClick={() => this.handleAdd(this.state.newSpec)}
							color="primary"
						>
							Add
            			</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={this.state.showConfirmDlg}
					onClose={this.closeConfirmDialog}
					aria-labelledby="alert-dialog-title"
				>
					<DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
					<DialogContent className={classes.relative}>
						<DialogContentText id="alert-dialog-description">
							Do you really want to delete this specialty?
            			</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.closeConfirmDialog} autoFocus>
							Cancel
            			</Button>
						<Button onClick={this.delete} color="primary">
							Yes
            			</Button>
					</DialogActions>
				</Dialog>
				<CustomSnackbar
					open={this.state.showMessage}
					variant={this.state.variant}
					message={this.state.message}
					handleClose={this.state.handleClose}
				/>
				{this.state.isBusy && <CircularProgress className={classes.busy} />}
			</Paper>
		);
	}
}

const mapStateToProps = state => ({
	specialties: state.spec_data.specialties,
	dirty: state.spec_data.dirty,
	userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
	loadSpecs,
	deleteSpec,
	createSpec,
	loadSpec,
};

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(AllSpecialties);
