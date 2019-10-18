import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, StyledComponentProps } from '@material-ui/core/styles';

import CustomTableCell from "components/shared/CustomTableCell";
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import SpecialtySearchBar from 'components/SearchBar/SpecialtySearchBar';

import { getContractors, getSpecialties, selectContractor } from 'store/actions/cont-actions';
import { searchContractors } from 'store/actions/cont-actions';
import { UserProfile, Specialties } from 'types/global';
import { Contractors } from 'types/contractor';
import style from './SearchBidderList.style';

interface ISearchBidderListProps extends RouteComponentProps, StyledComponentProps {
	getContractors: (page: number, size: number) => Promise<void>;
	selectContractor: (id: string) => Promise<void>;
	getSpecialties: (page?: number, size?: number) => Promise<void>;
	searchContractors: (name: string, city: string, specs: string[]) => Promise<void>;
    userProfile: UserProfile;
    contractors: Contractors;
    specialties: Specialties
}

interface ISearchBidderListState extends ISnackbarProps {
    rowsPerPage: number;
    currentPage: number;
    rowsPerPage1: number;
    currentPage1: number;
    isBusy: boolean;
    name: string;
    description: string;
    order: 'desc' | 'asc';
}

class SearchBidderList extends React.Component<ISearchBidderListProps, ISearchBidderListState> {
    selectRef: React.RefObject<unknown>;
	constructor(props) {
		super(props);
		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isBusy: false,
			name: '',
			description: '',
			order: 'desc',
			rowsPerPage1: null,
			currentPage1: null,
			showMessage: false,
            message: '',
            variant: 'success',
            handleClose: () => this.setState({showMessage: false})
		};
		this.selectRef = React.createRef();
	}

	async componentDidMount() {
		await this.props.getContractors(0, 20);
		this.props.getSpecialties();
	}

	handleChangePage = (event, page) => {
		this.setState({ currentPage1: page });
		this.props.getContractors(page, this.state.rowsPerPage1);
	};

	handleChangeRowsPerPage = event => {
		const { contractors } = this.props;
		const rowsPerPage = event.target.value;
		const currentPage =
			rowsPerPage >= contractors.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage,
		});

		this.props.getContractors(currentPage, rowsPerPage);
	};

	handleSearch = (name, city, specs) => {
		if (specs && specs.length > 0) {
			this.props.searchContractors(name, city, specs);
		} else {
			this.props.getContractors(0, 20);
		}
	};

	rowSelected = (id) => {
		this.props.history.push('/b_list/contractor_detail/' + id);
	}

	render() {
		const { classes, specialties, userProfile, contractors } = this.props;
		const suggestions = specialties
			? specialties.content.map(specialty => ({
				id: specialty.id,
				name: specialty.name,
			}))
			: [];

		if (!contractors) {
			return <CircularProgress className={classes.waitingSpin} />;
		}

		if (
			!userProfile.user_metadata.roles.includes('Gen') &&
			!userProfile.user_metadata.roles.includes('GenSub') &&
			!userProfile.user_metadata.roles.includes('SuperAdmin')
		)
			return <Box> Access Forbidden </Box>;

		return (
			<Box className={classes.root}>
                <SpecialtySearchBar
                    search={this.handleSearch}
                    suggestions={suggestions || []}
                />
				<Table>
					<TableHead>
						<TableRow>
							<CustomTableCell> Logo </CustomTableCell>
							<CustomTableCell align="center">Name</CustomTableCell>
							<CustomTableCell align="center">Email</CustomTableCell>
							<CustomTableCell align="center">Rating</CustomTableCell>
							<CustomTableCell align="center">Other</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{contractors.content && contractors.content.map(row => (
							<TableRow
								className={classes.row}
								key={row.id}
								hover
								onClick={() => this.rowSelected(row.id)}
							>
								<CustomTableCell component="th" scope="row" />
								<CustomTableCell align="center">
									{row.address ? row.address.name : 'N/A'}
								</CustomTableCell>
								<CustomTableCell align="center">
									{row.email ? row.email : 'N/A'}
								</CustomTableCell>
								<CustomTableCell
									align="center"
								/>
								<CustomTableCell align="center" />
							</TableRow>
						))}
					</TableBody>
				</Table>
				{contractors.content && (
					<TablePagination
						style={{ overflow: 'auto' }}
						rowsPerPageOptions={[5, 10, 20]}
						component="div"
						count={contractors.content.length}
						rowsPerPage={this.state.rowsPerPage}
						page={this.state.currentPage}
						backIconButtonProps={{ 'aria-label': 'Previous Page' }}
						nextIconButtonProps={{ 'aria-label': 'Next Page' }}
						onChangePage={this.handleChangePage}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
                )}
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

const mapDispatchToProps = {
	getContractors,
	selectContractor,
	getSpecialties,
	searchContractors,
};

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
	contractors: state.cont_data.contractors,
	specialties: state.cont_data.specialties,
});

export default compose(
	withStyles(style),
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
)(SearchBidderList);
