import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import DeleteIcon from '@material-ui/icons/Delete';

import removeMd from 'remove-markdown';

import Button from "components/CustomButtons/Button.jsx";
import CustomTableCell from "components/shared/CustomTableCell";
import { deleteProject } from 'store/actions/gen-actions';
import { getInvitedProjects } from 'store/actions/sub-actions';
import { Projects } from 'types/project';
import { UserProfile } from 'types/global';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import Ellipsis from 'components/Typography/Ellipsis';

const styles = createStyles((theme: Theme) => ({
	root: {
		position: 'relative',
		marginTop: theme.spacing(1),
		minHeight: 'calc(100vh - 64px - 56px - 16px - 48px)'
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
}));

interface InvitedProViewProps extends RouteComponentProps {
	classes: ClassNameMap<string>;
	getInvitedProjects: (id: string, page: number, size: number) => Promise<void>;
	deleteProject: (id: string) => Promise<void>;
	projects: Projects;
	userProfile: UserProfile;
}

interface InvitedProViewState extends ISnackbarProps {
	rowsPerPage: number;
	currentPage: number;
	isBusy: boolean;
	alertConfirm: boolean;
	proId: string;
}

class InvitedProView extends React.Component<InvitedProViewProps, InvitedProViewState> {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isBusy: false,
			showMessage: false,
			message: '',
			variant: 'success',
			alertConfirm: false,
			proId: '',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	componentDidMount() {
		const { userProfile } = this.props;
		this.props.getInvitedProjects(
			userProfile.user_metadata.contractor_id,
			0, 0
		);
	}

	handleChangePage = (event, page) => {
		const { userProfile } = this.props;
		this.setState({ currentPage: page });

		this.props.getInvitedProjects(
			userProfile.user_metadata.contractor_id,
			page,
			this.state.rowsPerPage
		);
	};

	handleChangeRowsPerPage = event => {
		const { projects, userProfile } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage =
			rowsPerPage >= projects.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage,
		});

		this.props.getInvitedProjects(
			userProfile.user_metadata.contractor_id,
			currentPage,
			rowsPerPage
		);
	};

	handleDeleteProject = async id => {

		const { projects, userProfile } = this.props;
		this.setState({
			isBusy: true,
			alertConfirm: false,
		});

		try {
			await this.props.deleteProject(this.state.proId);

			let curPage = this.state.currentPage;
			if (this.state.rowsPerPage * curPage >= projects.totalElements - 1) {
				curPage--;
			};

			await this.props.getInvitedProjects(
				userProfile.user_metadata.contractor_id,
				curPage, this.state.rowsPerPage
			);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Delete project success',
				variant: 'success',
				currentPage: curPage
			});
		} catch (error) {
			console.log('InvitedProView.handleDeleteProject: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Delete project failed',
				variant: 'error'
			});
		}
	};

	deleteProject = (id: string) => {
		this.setState({
			alertConfirm: true,
			proId: id,
		});
	}

	handleSelectProject = async id => {
		// this.props.setCurrentProject(id);
		this.props.history.push('/projects/project_detail/' + id);
	};

	render() {
		const { classes, projects } = this.props;
		const { showMessage, variant, message } = this.state;

		if (!projects) {
			return (
				<Box className={classes.root}>
					<CircularProgress className={classes.busy} />
				</Box>
			);
		}
		return (
			<Box className={classes.root}>
				<Table>
					<TableHead>
						<TableRow>
							<CustomTableCell> Project Title </CustomTableCell>
							<CustomTableCell align="center">Budget</CustomTableCell>
							<CustomTableCell align="center">Due Date</CustomTableCell>
							<CustomTableCell align="center">Description</CustomTableCell>
							<CustomTableCell align="center">Action</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{projects.content.map(row => (
							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell
									component="th"
									scope="row"
									onClick={() => this.handleSelectProject(row.id)}
								>
									<Ellipsis maxLines={2}>{row.title}</Ellipsis>
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.handleSelectProject(row.id)}
								>
									{row.budget}
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.handleSelectProject(row.id)}
								>
									{row.due && row.due.slice(0, 10)}
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.handleSelectProject(row.id)}
								>
									<Ellipsis maxLines={2}>{removeMd(row.description)}</Ellipsis>
								</CustomTableCell>
								<CustomTableCell align="center">
									<IconButton
										aria-label="Delete"
										color="primary"
										onClick={() => this.deleteProject(row.id)}
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
					count={projects.totalElements}
					rowsPerPage={this.state.rowsPerPage}
					page={this.state.currentPage}
					backIconButtonProps={{ 'aria-label': 'Previous Page' }}
					nextIconButtonProps={{ 'aria-label': 'Next Page' }}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
				<CustomSnackbar
					open={showMessage}
					variant={variant}
					message={message}
					handleClose={this.state.handleClose}
				/>
				<Dialog
					open={this.state.alertConfirm}
					onClose={() => this.setState({ alertConfirm: false })}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{'Delete Project?'}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Do you want to delete this project?
            			</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.setState({ alertConfirm: false })}>
							No
            			</Button>
						<Button
							onClick={() => this.handleDeleteProject(this.state.proId)}
							color="primary"
							autoFocus
						>
							Yes
            			</Button>
					</DialogActions>
				</Dialog>
			</Box>
		);
	}
}

const mapDispatchToProps = {
	getInvitedProjects,
	deleteProject
};

const mapStateToProps = state => ({
	projects: state.sub_data.projects,
	userProfile: state.global_data.userProfile,
})

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(InvitedProView)
