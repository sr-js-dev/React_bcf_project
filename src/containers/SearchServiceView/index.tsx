import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router';

import Box from '@material-ui/core/Box';
import { withStyles, StyledComponentProps } from '@material-ui/core/styles';

import { ISnackbarProps } from 'components/shared/CustomSnackbar';
import SearchServiceBar from 'components/SearchBar/SearchServiceBar';

import { getContractors, getSpecialties, selectContractor } from 'store/actions/cont-actions';
import { searchContractors } from 'store/actions/cont-actions';
import { UserProfile, Specialties } from 'types/global';
import { Contractors } from 'types/contractor';
import style from './SearchContractorView.style';

interface ISearchContractorViewProps extends RouteComponentProps, StyledComponentProps {
	getContractors: (page: number, size: number) => Promise<void>;
	selectContractor: (id: string) => Promise<void>;
	getSpecialties: (page?: number, size?: number) => Promise<void>;
	searchContractors: (name: string, city: string, specs: string[]) => Promise<void>;
    userProfile: UserProfile;
    contractors: Contractors;
    specialties: Specialties
}

interface ISearchContractorViewState extends ISnackbarProps {
    rowsPerPage: number;
    currentPage: number;
    rowsPerPage1: number;
    currentPage1: number;
    isBusy: boolean;
    name: string;
    description: string;
    order: 'desc' | 'asc';
}

class SearchContractorView extends React.Component<ISearchContractorViewProps, ISearchContractorViewState> {
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

	componentDidMount() {
	}

    handleSearch = (name, city, specs) => {
        this.props.history.push('/search-complete')
    };

	render() {
		const { classes, specialties} = this.props;
		const suggestions = specialties
			? specialties.content.map(specialty => ({
				id: specialty.id,
				name: specialty.name,
			}))
			: [];

		return (
			<Box className={classes.root}>
                <SearchServiceBar
                    search={this.handleSearch}
                    suggestions={suggestions || []}
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
)(SearchContractorView);
