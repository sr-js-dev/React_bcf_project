import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import removeMd from 'remove-markdown';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import CustomTableCell from "components/shared/CustomTableCell";
import Ellipsis from 'components/Typography/Ellipsis';
import { deleteProposal, getProposals } from 'store/actions/sub-actions';
import { UserProfile } from 'types/global';
import { Proposals } from 'types/proposal';

const styles = createStyles(theme => ({
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
	btnSubmitProposal: {
		marginBottom: 5,
		backgroundColor: theme.palette.primary.light,
		color: '#FFF',
		borderRadius: 0,
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
}));

interface IWonProjectViewProps extends RouteComponentProps {
	classes: ClassNameMap<string>;
	userProfile: UserProfile;
	proposals: Proposals;
	getProposals: (id: string, page: number, size: number, filter: string) => Promise<void>;
	deleteProposal: (id: string) => Promise<void>;
}

interface IWonProjectViewState extends ISnackbarProps {
	rowsPerPage: number;
	currentPage: number;
	isBusy: boolean;
}

class WonProjectView extends React.Component<IWonProjectViewProps, IWonProjectViewState> {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isBusy: false,
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	componentDidMount() {
		const { userProfile } = this.props;
		this.props.getProposals(
			userProfile.user_metadata.contractor_id,
			0, 0, 'AWARDED'
		);
	}

	handleChangePage = (event, page) => {
		const { userProfile } = this.props;
		this.setState({ currentPage: page });

		this.props.getProposals(
			userProfile.user_metadata.contractor_id,
			page,
			this.state.rowsPerPage,
			'AWARDED'
		);
	};

	handleChangeRowsPerPage = event => {
		const { proposals, userProfile } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage =
			rowsPerPage >= proposals.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage,
		});

		this.props.getProposals(
			userProfile.user_metadata.contractor_id,
			currentPage,
			rowsPerPage,
			'AWARDED'
		);
	};

	handleDeleteProposal = async id => {

		const { userProfile, proposals } = this.props;
		this.setState({ isBusy: true });
		try {
			await this.props.deleteProposal(id);
			let curPage = this.state.currentPage;
			if (this.state.rowsPerPage * this.state.currentPage >= proposals.totalElements - 1) {
				curPage--;
			}
			await this.props.getProposals(
				userProfile.user_metadata.contractor_id,
				curPage,
				this.state.rowsPerPage,
				'AWARDED'
			);

			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Delete proposal success',
				variant: 'success',
				currentPage: curPage
			});
		} catch (error) {
			console.log('WonProView.handleDeleteProposal: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Delete proposal failed',
				variant: 'error'
			});
		}
	};

	handleSelectProposal = id => {
		this.props.history.push(`/s_cont/proposal_detail/${id}`);
	};

	render() {
		const { classes, proposals } = this.props;
		const { showMessage, variant, message } = this.state;

		if (!proposals) {
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
							<CustomTableCell align="center">Proposal To</CustomTableCell>
							<CustomTableCell align="center">Price($)</CustomTableCell>
							<CustomTableCell align="center">Duration</CustomTableCell>
							<CustomTableCell align="center">Status</CustomTableCell>
							<CustomTableCell align="center">Description</CustomTableCell>
							<CustomTableCell align="center">Actions</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{proposals.content.map(row => (
							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									component="th"
									scope="row"
									align="center"
								>
									<Ellipsis maxLines={2}>{row.project.title}</Ellipsis>
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									component="th"
									scope="row"
									align="center"
								>
									{row.budget}
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									component="th"
									scope="row"
									align="center"
								>
									{row.duration}
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									component="th"
									scope="row"
									align="center"
								>
									{row.status}
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									align="center"
								>
									<Ellipsis maxLines={2}>{removeMd(row.description)}</Ellipsis>
								</CustomTableCell>
								<CustomTableCell align="center">
									<IconButton
										className={classes.button}
										aria-label="Delete"
										color="primary"
										onClick={() => this.handleDeleteProposal(row.id)}
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
					count={proposals.totalElements}
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
				{this.state.isBusy && <CircularProgress className={classes.busy} />}
			</Box>
		);
	}
}

const mapDispatchToProps = {
	getProposals,
	deleteProposal,
};

const mapStateToProps = state => ({
	proposals: state.sub_data.proposals,
	userProfile: state.global_data.userProfile,
});

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(WonProjectView);
