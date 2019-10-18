import React from 'react';
import { connect } from 'react-redux';
import { Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// import BallotIcon from '@material-ui/icons/Ballot';
// import CustomTabs from "components/shared/CustomTabs";
import SecuredRoute from 'routers/SecuredRoute';

import { setUserProfile } from 'store/actions/global-actions';
import * as ContActions from 'store/actions/cont-actions';
import { UserProfile, Specialties } from 'types/global';
import { Projects } from 'types/project';

import ProfileView from './ProfileView';
import ProfileReview from './ProfileReview';

const styles = createStyles((theme: Theme) => ({
	root: {
		flex: 1,
		flexDirection: 'column',
		display: 'flex',
		position: 'relative',
		overflow: 'auto'
	},
	contents: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1
	},
	center: {
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
		position: 'absolute'
	}
}));

const PROFILE_OVERVIEW = '/profile';
const PROFILE_ASKREVIEW = '/profile/review';

interface ProfilePageProps extends RouteComponentProps, StyledComponentProps {
	userProfile: UserProfile;
	classes: ClassNameMap<string>;
	contractor: any;
	specialties: Specialties;
	pastProjects: Projects;
	selectContractor: (id: string) => Promise<any>;
	getSpecialties: (page: number, size: number) => Promise<void>;
	getPastProjects: (id: string) => Promise<void>;
	getPhotos: (id: string) => Promise<void>;
	getLinks: (id: string) => Promise<void>;
	getReviews: (id: string) => Promise<void>;
	getLicenses: (id: string) => Promise<void>;
}

class ProfilePage extends React.Component<ProfilePageProps> {

	async componentDidMount() {
		const {
			userProfile,
			selectContractor,
			contractor,
			getSpecialties,
			getPastProjects,
			getLinks,
			getPhotos,
			getReviews,
			getLicenses
		} = this.props;
		const contId = userProfile.user_metadata.contractor_id;
		if (!!contractor) return;
		try {
			const tasks = [];
			tasks.push(getSpecialties(0, 20));
			tasks.push(selectContractor(contId));
			tasks.push(getPastProjects(contId));
			tasks.push(getPhotos(contId));
			tasks.push(getLinks(contId));
			tasks.push(getReviews(contId));
			tasks.push(getLicenses(contId));
			await Promise.all(tasks);
		} catch (error) {
			console.log('ProfileOverview.CDM: ', error);
		}
	}


	render() {
		const {
			classes,
			contractor,
			specialties,
			pastProjects,
		} = this.props;
		if (!contractor || !specialties || !pastProjects) {
			return (
				<Box className={classes.root}>
					<CircularProgress className={classes.center} />
				</Box>
			)
		}

		return (
			<Box className={classes.root}>
				<Switch>
					<SecuredRoute path={PROFILE_ASKREVIEW} component={ProfileReview} />
					<SecuredRoute exact path={PROFILE_OVERVIEW} component={ProfileView} />
				</Switch>
			</Box>
		);
	}
}

const mapDispatchToProps = {
	setUserProfile,
	selectContractor: ContActions.selectContractor,
	getSpecialties: ContActions.getSpecialties,
	getPastProjects: ContActions.getPastProjects,
	getPhotos: ContActions.getProfilePhotos,
	getLinks: ContActions.getProfileLinks,
	getReviews: ContActions.getProfileReview,
	getLicenses: ContActions.getProfileLicenses
};

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
	contractor: state.cont_data.selectedContractor,
	specialties: state.cont_data.specialties,
	pastProjects: state.cont_data.pastProjects,
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProfilePage));
