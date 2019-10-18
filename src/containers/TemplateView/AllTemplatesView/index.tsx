import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from "redux";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { createStyles, withStyles, StyledComponentProps } from '@material-ui/core/styles';

import { History } from 'history';
import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import removeMd from 'remove-markdown';

import CustomTableCell from "components/shared/CustomTableCell";
import Button from 'components/CustomButtons/Button';
import * as TemplActions from 'store/actions/tem-actions';
import { UserProfile, NodeInfo } from 'types/global';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';


const styles = theme => createStyles({
	root: {
		position: 'relative'
	},
	marginRight: {
		marginRight: '5px',
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	waitingSpin: {
		position: 'relative',
		left: 'calc(50% - 10px)',
		top: 'calc(40vh)',
	},
	successAlert: {
		marginBottom: '10px',
	},
	editField: {
		lineHeight: '1.5rem',
	},
	busy: {
		position: 'fixed',
		left: 'calc(50vw - 20px)',
		top: 'calc(50vh - 20px)',
	}
});

interface ConnAllTemplateViewProps extends StyledComponentProps {
	selectTemplate: (id: string) => Promise<void>;
	loadRoots: () => Promise<void>;
	addRoot: (name: string, type: string, value: string, desc: string) => Promise<void>;
	deleteNode: (id: string) => Promise<void>;
	roots: NodeInfo[];
	history: History;
	userProfile: UserProfile;
}

interface ConnAllTemplateViewState extends ISnackbarProps {
	rowsPerPage: number;
	currentPage: number;
	isBusy: boolean;
	showDialog: boolean;
	name: string;
	description: string;
	value: string;
	type: string;
}

class AllTemplateView extends Component<ConnAllTemplateViewProps, ConnAllTemplateViewState> {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isBusy: false,
			showDialog: false,
			name: '',
			description: '',
			value: '',
			type: '',
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: this.closeMessage
		};
	}

	closeMessage = () => {
		this.setState({ showMessage: false });
	}

	componentDidMount() {
		this.props.loadRoots();
	}

	handleChangePage = (event, page) => {
		this.setState({ currentPage: page });
	};

	handleChangeRowsPerPage = event => {
		const rowsPerPage = event.target.value;
		const curPos = this.state.currentPage * this.state.rowsPerPage;
		const currentPage = curPos / rowsPerPage;

		this.setState({ rowsPerPage, currentPage });
	};

	createRoot = async () => {
		const { name, value, type, description } = this.state;
		const { addRoot, loadRoots } = this.props;
		this.setState({ isBusy: true, showDialog: false });
		try {
			await addRoot(name, type, value, description);
			await loadRoots();

			this.setState({
				showMessage: true,
				message: 'Create Template success',
				variant: 'success',
				isBusy: false,
				name: '',
				description: ''
			})
		} catch (error) {
			console.log('AllTemplatesView.createRoot: ', error);
			this.setState({
				showMessage: true,
				message: 'Create Template failed',
				variant: 'error',
				isBusy: false
			});
		}
	}

	deleteRoot = async (id: string) => {
		const { loadRoots, deleteNode, roots } = this.props;
		const { rowsPerPage, currentPage } = this.state;
		const count = roots.length;
		this.setState({ isBusy: true });
		try {
			await deleteNode(id);
			await loadRoots();

			let curPage = currentPage;
			if (rowsPerPage * currentPage >= (count - 1)) {
				curPage--;
			}

			this.setState({
				isBusy: false,
				showMessage: true,
				variant: 'success',
				message: 'Delete Template success',
				currentPage: curPage
			});
		} catch (error) {
			console.log('AllTemplatesView.deleteRoot: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				variant: 'error',
				message: 'Please delete child nodes'
			});
		}
	}

	selectTemplate = async (id: string) => {
		// this.setState({ isBusy: true });
		// await this.props.selectTemplate(id);
		// this.setState({ isBusy: false });
		// this.props.history.push(`/m_temp/template_detail`);
		this.props.history.push(`/m_temp/template_detail/${id}`);
	}

	render() {
		const { classes, roots } = this.props;
		const { type, name, value, description } = this.state;

		if (!roots) {
			return <CircularProgress className={classes.waitingSpin} />;
		}

		return (
			<Paper className={classes.root}>
				<Table>
					<TableHead>
						<TableRow>
							<CustomTableCell>Name</CustomTableCell>
							<CustomTableCell>Type</CustomTableCell>
							<CustomTableCell>Value</CustomTableCell>
							<CustomTableCell align="center">Description</CustomTableCell>
							<CustomTableCell align="center">
								<IconButton
									style={{ color: '#FFFFFF' }}
									onClick={() => this.setState({
										showDialog: true,
										name: '',
										type: '',
										value: '',
										description: ''
									})}
								>
									<NoteAddIcon />
								</IconButton>
							</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{roots.map(row => (
							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell
									component="th"
									scope="row"
									onClick={() => this.selectTemplate(row.id)}
								>
									{row.name}
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.selectTemplate(row.id)}
								>
									{row.type}
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.selectTemplate(row.id)}
								>
									{row.value}
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.selectTemplate(row.id)}
								>
									{removeMd(row.description)}
								</CustomTableCell>
								<CustomTableCell align="center">
									<IconButton
										className={classes.button}
										aria-label="Delete"
										color="primary"
										onClick={() => this.deleteRoot(row.id)}
									>
										<DeleteIcon />
									</IconButton>
								</CustomTableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					style={{ overflow: 'auto' }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={roots ? roots.length : 0}
					rowsPerPage={this.state.rowsPerPage}
					page={this.state.currentPage}
					backIconButtonProps={{ 'aria-label': 'Previous Page' }}
					nextIconButtonProps={{ 'aria-label': 'Next Page' }}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>

				<Dialog
					open={this.state.showDialog}
					onClose={() => this.setState({ showDialog: false })}
					aria-labelledby="create-template"
				>
					<DialogTitle id="create-template">Create template</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Please input the template information
            			</DialogContentText>
						<TextField
							autoFocus
							margin="normal"
							label="Name"
							fullWidth
							required
							value={name}
							onChange={e => this.setState({ name: e.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="normal"
							label="Type"
							fullWidth
							value={type}
							onChange={e => this.setState({ type: e.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="normal"
							label="Value"
							fullWidth
							value={value}
							onChange={e => this.setState({ value: e.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							value={description}
							onChange={val => this.setState({ description: val })}
							options={{
								placeholder: 'Description here',
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							disabled={this.state.isBusy}
							onClick={() => this.setState({ showDialog: false })}
							className={classes.marginRight}
						>
							Cancel
            			</Button>
						<Button
							disabled={this.state.isBusy}
							onClick={this.createRoot}
							color="primary"
						>
							Add
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
	roots: state.tem_data.roots,
	userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = dispatch => ({
	selectTemplate: id => dispatch(TemplActions.selectTemplate(id)),
	loadRoots: () => dispatch(TemplActions.loadRoots()),
	addRoot: (name, type, value, desc) => dispatch(TemplActions.addRoot(name, type, value, desc)),
	deleteNode: id => dispatch(TemplActions.deleteNode(id))
});

export default compose(
	withRouter,
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(AllTemplateView)
