import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import GenContractorView from '../containers/GenContractorView';
import SubContractorView from '../containers/SubContractorView';
import BidderListingView from '../containers/BidderListingView';
import TemplatesView from '../containers/TemplateView';
import SpecialtyView from '../containers/SpecialtyView';
import ContractorView from '../containers/ContractorView';
import ProjectsView from '../containers/ProjectsView';
import HomeView from '../containers/HomeView';
import ProfileView from '../containers/ProfileView';
import SearchContractorView from '../containers/SearchContractorView';
import SearchCityView from '../containers/SearchCityView';
import SearchServiceView from '../containers/SearchServiceView';
import SearchThankYouView from '../containers/SearchThankYouView';
import SettingsView from '../components/SettingsView';
import Header from '../components/Header';
import Callback from '../services/auth0/callback';
import auth0Client from '../services/auth0/auth';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { CircularProgress } from '@material-ui/core/es';

import SecuredRoute from './SecuredRoute';
import { MaterialThemeHOC, UserProfile } from 'types/global';
import { setUserProfile } from 'store/actions/global-actions';

import rootStyles from './AppRouter.style';
import Container from '@material-ui/core/Container';

interface AppRouterProps extends MaterialThemeHOC {
	location: Location;
	userProfile: UserProfile;
	setUserProfile: (data: any) => void;
	dispatch: Dispatch;
}

interface AppRouterState {
	checkingSession: boolean;
}

class AppRouterConnect extends React.Component<AppRouterProps, AppRouterState> {
	constructor(props) {
		super(props);

		this.state = {
			checkingSession: true,
		};
	}

	async componentDidMount() {
		const { location, setUserProfile } = this.props;
		if (location.pathname === '/callback' || auth0Client.isAuthenticated()) {
			this.setState({ checkingSession: false });
			return;
		}

		try {
			await auth0Client.silentAuth();
			const data = await auth0Client.getUserInfo();
			setUserProfile(data);
			this.setState({ checkingSession: false });
		} catch (err) {
			if (err.error !== 'login_required') console.log(err.error);
			this.setState({ checkingSession: false });
		}
	}

	render() {
		const { userProfile, classes } = this.props;
		if (
			this.state.checkingSession ||
			(auth0Client.isAuthenticated() && !userProfile)
		) {
			return <CircularProgress className={classes.waitingSpin} />;
		}

		return (
			<div className={classes.root}>
				<Header />
				<main className={classes.content}>
					<div className={classes.appBarSpacer} />
					<Container className={classes.container} maxWidth={false}>
						<Switch>
							<Route exact path="/" component={HomeView} />
							<SecuredRoute
								path="/gen-contractor"
								component={GenContractorView}
							/>
							<SecuredRoute path="/s_cont" component={SubContractorView} />
							<SecuredRoute path="/b_list" component={BidderListingView} />
							<SecuredRoute path="/projects" component={ProjectsView} />
							<SecuredRoute path="/m_temp" component={TemplatesView} />
							<SecuredRoute path="/m_spec" component={SpecialtyView} />
							<SecuredRoute path="/m_cont" component={ContractorView} />
							<SecuredRoute path="/profile" component={ProfileView} />
							<SecuredRoute path="/settings" component={SettingsView} />
							<Route exact path="/search-city" component={SearchCityView} />
							<Route exact path="/search-service" component={SearchServiceView} />
							<Route exact path="/search-complete" component={SearchThankYouView} />
							<Route exact path="/search-contractor" component={SearchContractorView} />
							<Route exact path="/callback" component={Callback} />
							<Redirect to="/" />
						</Switch>
					</Container>
				</main>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
});

export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ setUserProfile },
	),
	withStyles(rootStyles),
)(AppRouterConnect);
