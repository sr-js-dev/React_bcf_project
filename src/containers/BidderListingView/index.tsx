import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import SecuredRoute from 'routers/SecuredRoute';
import ContractorDetailView from 'components/ContractorDetailView';
import SearchBidderListView from './SearchBidderListView';

import { UserProfile } from 'types/global';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	}
}));

interface IBidderListingViewProps extends RouteComponentProps {
	userProfile: UserProfile;
}

const BidderListingView: React.SFC<IBidderListingViewProps> = (props) => {
	const classes = useStyles({});
	const { userProfile, match } = props;

	if (
		!userProfile.user_metadata.roles.includes('Gen') &&
		!userProfile.user_metadata.roles.includes('GenSub') &&
		!userProfile.user_metadata.roles.includes('SuperAdmin')
	)
		return <Box> Access Forbidden </Box>;

	return (
		<Box className={classes.root}>
			<Switch>
				<SecuredRoute
					path={`${match.url}/search_bidder`}
					component={SearchBidderListView}
				/>
				<SecuredRoute
					path={`${match.url}/contractor_detail/:id`}
					component={ContractorDetailView}
				/>
				<Redirect path="*" to={`${match.url}/search_bidder`} />
			</Switch>
		</Box>
	);
}

const mapStateToProps = state => ({ userProfile: state.global_data.userProfile });

export default connect(mapStateToProps)(BidderListingView);
