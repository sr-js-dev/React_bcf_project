import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import { Theme, makeStyles } from '@material-ui/core/styles';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';
// import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

import CustomNavTabs from 'components/shared/CustomNavTabs';
import SecuredRoute from 'routers/SecuredRoute';
import { UserProfile } from 'types/global';
import AllTemplatesView from './AllTemplatesView';
// import CategoryDetailView from './CategoryDetailView';
// import OptionDetailView from './OptionDetailView';
import TempDetailView from './TempDetailView';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		minHeight: 'calc(100vh - 64px - 56px)'
	},
	contentWrapper: {
		paddingTop: theme.spacing(1),
	},
}));

interface TemplatesViewProps extends RouteComponentProps {
	userProfile: UserProfile;
}

const TemplatesView: React.SFC<TemplatesViewProps> = (props) => {

	const { userProfile, location, match } = props;
	const classes = useStyles({});
	if (!userProfile.user_metadata.roles.includes('SuperAdmin')) {
		return <Box> Access Forbidden </Box>;
	}

	const tabPaths = [
		match.url + '/all_templates',
		match.url + '/template_detail/:id',
		// match.url + '/category_detail',
		// match.url + '/option_detail'
	];
	let tab = 1;
	if (location.pathname.includes('/all_templates')) tab = 0
	// if (location.pathname.includes('template_detail')) tab = 1;
	// if (location.pathname.includes('category_detail')) tab = 2;
	// if (location.pathname.includes('option_detail')) tab = 3;
	return (
		<Box className={classes.root}>
			<CustomNavTabs
				tabs={[
					{
						href: `${tabPaths[0]}`,
						label: 'All Templates',
						icon: AppsIcon,
					},
					{
						href: `${match.url}/template_detail/`,
						label: 'Template Detail',
						icon: BallotIcon,
					},
					// {
					// 	href: `${tabPaths[2]}`,
					// 	label: 'Category Detail',
					// 	icon: ViewHeadlineIcon,
					// },
					// {
					// 	href: `/m_temp/option_detail`,
					// 	label: 'Option Detail',
					// 	icon: ViewHeadlineIcon,
					// },
				]}
				value={tab}
			/>
			<main className={classes.contentWrapper}>
				<Switch>
					<SecuredRoute
						path={`${match.url}/all_templates`}
						component={AllTemplatesView}
					/>
					<SecuredRoute
						path={`${match.url}/template_detail/:id`}
						component={TempDetailView}
					/>
					{/* <SecuredRoute
						path="/m_temp/category_detail"
						component={CategoryDetailView}
					/>
					<SecuredRoute
						path="/m_temp/option_detail"
						component={OptionDetailView}
					/> */}
					<Redirect path="/m_temp" to={`${match.url}/all_templates`} />
				</Switch>
			</main>
		</Box>
	);
}

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
});

export default connect(mapStateToProps)(TemplatesView);
