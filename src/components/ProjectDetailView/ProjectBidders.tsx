import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { emphasize, withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

import Button from 'components/CustomButtons/Button';
import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import SpecialtySearchBar from 'components/SearchBar/SpecialtySearchBar';
import { getContractors, getSpecialties, selectContractor, } from 'store/actions/cont-actions';
import { searchContractors } from 'store/actions/cont-actions';
import { getInvitedBidders, inviteContractor } from 'store/actions/gen-actions';
import { ProjectInfo } from 'types/project';
import { Contractors, ContractorInfo } from 'types/contractor';
import { Specialties } from 'types/global';

const styles = createStyles(theme => ({
	root: {
		padding: theme.spacing(1),
		minHeight: 'calc(100vh - 64px - 56px - 48px - 8px)'
	},
	tableWrap: {
		overflow: 'auto',
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	input: {
		display: 'flex',
		padding: 0,
		height: 'auto',
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
	title: {
		padding: '16px',
		fontSize: '20px',
		color: theme.palette.primary.dark,
	},
	pos: {
		marginBottom: 12,
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		margin: theme.spacing(1),
		alignItems: 'center',
		overflow: 'hidden',
	},
	chip: {
		margin: theme.spacing(2, 1),
	},
	chipFocused: {
		backgroundColor: emphasize(
			theme.palette.type === 'light'
				? theme.palette.grey[300]
				: theme.palette.grey[700],
			0.08
		),
	},
	noOptionsMessage: {
		padding: theme.spacing(1),
	},
	singleValue: {
		fontSize: 16,
	},
	placeholder: {
		position: 'absolute',
		left: 2,
		fontSize: 16,
	},
	paper: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing(1),
		left: 0,
		right: 0,
	},
	button: {
		margin: theme.spacing(1),
	},
	card: {
		width: '100%',
		marginBottom: '20px',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: 'lightgrey',
	},
}));

interface IProjectBiddersProps extends RouteComponentProps {
	getInvitedBidders: (id: string, page: number, size: number) => Promise<void>;
	selectContractor: (id: string) => Promise<void>;
	getSpecialties: (page: number, size: number) => Promise<void>;
	searchContractors: (name: string, city: string, specs: Array<string>) => Promise<void>;
	getContrators0: (page: number, size: number) => Promise<void>;
	inviteContractor: (id: string, sudid: string) => Promise<void>;
	invited: ContractorInfo[];
	project: ProjectInfo;
	searchResult: ContractorInfo[];
	specialties: Specialties;
	contractors: Contractors;
	classes: ClassNameMap<string>;
}

interface IProjectBiddersState extends ISnackbarProps {
	invited?: ContractorInfo[];
	contractors?: Contractors;
	rowsPerPage: number;
	currentPage: number;
	rowsPerPage1: number;
	currentPage1: number;
	openCategoryForm: boolean;
	order: 'desc' | 'asc';
	name: '',
	description: '',
	isBusy: boolean;
}

class ProjectBidders extends React.Component<IProjectBiddersProps, IProjectBiddersState> {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			rowsPerPage1: 20,
			currentPage1: 0,
			isBusy: false,
			openCategoryForm: false,
			name: '',
			description: '',
			order: 'desc',
			invited: undefined,
			contractors: undefined,
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: this.closeMessage
		};
	}

	async componentDidMount() {
		const { project } = this.props;
		this.setState({ isBusy: true });
		await this.props.getContrators0(0, 20);
		await this.props.getInvitedBidders(project.id, 0, 20);
		await this.props.getSpecialties(0, 20);
		this.setState({ isBusy: false });
	}

	closeMessage = () => {
		this.setState({ showMessage: false });
	}

	componentWillReceiveProps({ invited, contractors, searchResult }) {
		this.setState({
			invited: invited,
			contractors: contractors,
		});
		if (searchResult)
			this.setState({ contractors: { ...contractors, content: searchResult } });
	}

	handleSearch = (name, city, specs) => {
		this.props.searchContractors(name, city, specs);
	}

	handleChangePage = (event, page) => {
		const { project } = this.props;
		this.setState({ currentPage: page });
		this.props.getInvitedBidders(project.id, page, this.state.rowsPerPage);
	};

	handleChangePage1 = (event, page) => {
		this.setState({ currentPage1: page });
		this.props.getContrators0(page, this.state.rowsPerPage1);
	};

	handleChangeRowsPerPage = event => {
		// const { invited } = this.state;
		// const { project } = this.props;
		// const rowsPerPage = event.target.value;
		// const currentPage =
		// 	rowsPerPage >= invited.totalElements ? 0 : this.state.currentPage;

		// this.setState({
		// 	rowsPerPage: rowsPerPage,
		// 	currentPage: currentPage,
		// });

		// this.props.getInvitedBidders(project.id, currentPage, rowsPerPage);
	};

	handleChangeRowsPerPage1 = event => {
		const { contractors } = this.state;
		const rowsPerPage1 = event.target.value;
		const currentPage1 =
			rowsPerPage1 >= contractors.totalElements ? 0 : this.state.currentPage1;

		this.setState({
			rowsPerPage1: rowsPerPage1,
			currentPage1: currentPage1,
		});

		this.props.getContrators0(currentPage1, rowsPerPage1);
	};

	isInvited = id => {
		return this.props.invited.some(bidder => bidder.id === id);
		// const value = this.props.invited.map(row => {
		// 	return row.id === id;
		// });

		// return value.includes(true);
	};

	gotoContractor = id => {
		const { match } = this.props;
		if (match.url.includes('gen-contractor')) {
			this.props.history.push(`/gen-contractor/contractor_detail/${id}`);
		} else if (match.url.includes('s_cont')) {
			this.props.history.push(`/s_cont/contractor_detail/${id}`);
		} else if (match.url.includes('/projects')) {
			this.props.history.push(`/projects/contractor_detail/${id}`);
		}
	}

	invite = async (id) => {
		const { project } = this.props;

		this.setState({ isBusy: true });
		try {
			await this.props.inviteContractor(project.id, id);
			await this.props.getContrators0(
				this.state.currentPage1,
				this.state.rowsPerPage1
			);
			await this.props.getInvitedBidders(
				project.id,
				this.state.currentPage,
				this.state.rowsPerPage
			);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Invite success',
				variant: 'success'
			});
		} catch (error) {
			console.log('ProjectBidders.invite: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Invite failed',
				variant: 'error'
			});
		}
	}

	render() {
		const { classes, specialties } = this.props;
		const { contractors, invited } = this.state;
		const suggestions = specialties ? specialties.content || [] : [];

		if (!invited || !contractors) {
			return <CircularProgress className={classes.waitingSpin} />;
		}
		return (
			<div className={classes.root}>
				<Card className={classes.card}>
					<Typography className={classes.title}>Invited Bidders</Typography>
					<div className={classes.tableWrap}>
						<Table>
							<TableHead>
								<TableRow>
									<CustomTableCell align="center">Logo</CustomTableCell>
									<CustomTableCell align="center">Bidder Name</CustomTableCell>
									<CustomTableCell> Bidder Email </CustomTableCell>
									<CustomTableCell align="center">Rating</CustomTableCell>
									<CustomTableCell align="center">Other</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{invited.map(row => (
									<TableRow className={classes.row} key={row.id} hover>
										<CustomTableCell
											onClick={() => this.gotoContractor(row.id)}
										/>
										<CustomTableCell
											align="center"
											onClick={() => this.gotoContractor(row.id)}
										>
											{row.address ? row.address.name : 'N/A'}
										</CustomTableCell>
										<CustomTableCell
											component="th"
											scope="row"
											onClick={() => this.gotoContractor(row.id)}
										>
											{row.email ? row.email : 'N/A'}
										</CustomTableCell>
										<CustomTableCell
											onClick={() => this.gotoContractor(row.id)}
										/>
										<CustomTableCell
											onClick={() => this.gotoContractor(row.id)}
										/>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<TablePagination
						style={{ overflow: 'auto' }}
						rowsPerPageOptions={[5, 10, 20]}
						component="div"
						count={invited.length}
						rowsPerPage={this.state.rowsPerPage}
						page={this.state.currentPage}
						backIconButtonProps={{ 'aria-label': 'Previous Page' }}
						nextIconButtonProps={{ 'aria-label': 'Next Page' }}
						onChangePage={this.handleChangePage}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
				</Card>
				<Card className={classes.card}>
					<Typography className={classes.title} style={{ paddingBottom: 0 }}>
						Search Field
          			</Typography>
					<SpecialtySearchBar
						search={this.handleSearch}
						suggestions={suggestions}
					/>

					<Typography className={classes.title}>Search result</Typography>
					<div className={classes.tableWrap}>
						<Table>
							<TableHead>
								<TableRow>
									<CustomTableCell> Logo </CustomTableCell>
									<CustomTableCell align="center">Name</CustomTableCell>
									<CustomTableCell align="center">Specialty</CustomTableCell>
									<CustomTableCell align="center">Rating</CustomTableCell>
									<CustomTableCell align="center">Action</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{contractors.content.map(row => (
									<TableRow className={classes.row} key={row.id} hover>
										<CustomTableCell
											component="th"
											scope="row"
											onClick={() => this.gotoContractor(row.id)}
										/>
										<CustomTableCell
											align="center"
											onClick={() => this.gotoContractor(row.id)}
										>
											{row.address ? row.address.name : 'N/A'}
										</CustomTableCell>
										<CustomTableCell
											align="center"
											onClick={() => this.gotoContractor(row.id)}
										/>
										<CustomTableCell
											align="center"
											onClick={() => this.gotoContractor(row.id)}
										/>
										<CustomTableCell align="center">
											{this.isInvited(row.id) ? (
												<IconButton
													className={classes.button}
													aria-label="Delete"
													color="primary"
												>
													<AccessAlarmIcon />
												</IconButton>
											) : (
													<Button
														className={classes.button}
														aria-label="Delete"
														color="primary"
														onClick={() => this.invite(row.id)}
													>
														Invite
                        							</Button>
												)}
										</CustomTableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<TablePagination
						style={{ overflow: 'auto' }}
						rowsPerPageOptions={[5, 10, 20]}
						component="div"
						count={contractors.numberOfElements}
						rowsPerPage={this.state.rowsPerPage1}
						page={this.state.currentPage1}
						backIconButtonProps={{ 'aria-label': 'Previous Page' }}
						nextIconButtonProps={{ 'aria-label': 'Next Page' }}
						onChangePage={this.handleChangePage1}
						onChangeRowsPerPage={this.handleChangeRowsPerPage1}
					/>
					<CustomSnackbar
						open={this.state.showMessage}
						variant={this.state.variant}
						message={this.state.message}
						handleClose={this.state.handleClose}
					/>
				</Card>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	invited: state.gen_data.invited,
	project: state.global_data.project,
	searchResult: state.global_data.searchResult,
	specialties: state.cont_data.specialties,
	contractors: state.cont_data.contractors,
});

const mapDispatchToProps = {
	getInvitedBidders,
	selectContractor,
	getSpecialties,
	searchContractors,
	getContrators0: getContractors,
	inviteContractor,
};

export default compose(
	withStyles(styles, { withTheme: true }),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(ProjectBidders);
