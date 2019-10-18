import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import auth0Client from './auth';

import { connect } from 'react-redux';
import { setUserProfile } from 'store/actions/global-actions';
import { CircularProgress } from '@material-ui/core/es';

class connectedCallback extends Component {
	async componentDidMount() {
		await auth0Client.handleAuthentication();
		const data = await auth0Client.getUserInfo();
		this.props.setUserProfileAction(data);
		this.props.history.replace('/');
	}

	render() {
		return <CircularProgress />;
	}
}

const mapDispatchToProps = dispatch => ({
	setUserProfileAction: profile => dispatch(setUserProfile(profile)),
});

const Callback = connect(
	undefined,
	mapDispatchToProps
)(connectedCallback);

export default withRouter(Callback);
