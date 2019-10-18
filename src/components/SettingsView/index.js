import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { setUserProfile } from 'store/actions/global-actions';
import auth0Client from 'services/auth0/auth';
import Button from '../CustomButtons/Button';
import CustomTableCell from '../shared/CustomTableCell';
import TSnackbarContent from '../SnackBarContent';

const styles = theme => ({
	root: {
		flexGrow: 1,
		margin: theme.spacing(1),
		height: 'calc(100vh - 64px - 20px)',
		overflow: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	settingView: {
		width: 500,
		padding: '5px',
	},
	marginRight: {
		marginRight: theme.spacing(1),
	},
	buttonWrap: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	formControl: {
		color: theme.palette.primary.light,
		margin: theme.spacing(1),
		minWidth: 120,
		[theme.breakpoints.up('md')]: {
			minWidth: 240,
		},
	},
});

class SettingsView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			setting1: 10,
			setting2: 'a',
			checkedA: false,
			checkedB: false,
			checkedC: false,
			isSaving: false,
			isSuccess: false,
		};
	}
	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	componentWillMount() {
		const { userProfile } = this.props;

		this.setState({
			setting1: userProfile.user_metadata.settings.setting1,
			setting2: userProfile.user_metadata.settings.setting2,
			checkedA: userProfile.user_metadata.settings.checkedA,
			checkedB: userProfile.user_metadata.settings.checkedB,
			checkedC: userProfile.user_metadata.settings.checkedC,
		});
	}

	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ isSuccess: false });
	};

	handleSave = async () => {
		this.setState({
			isSaving: true,
		});

		const newSet = {
			user_metadata: {
				settings: {
					setting1: this.state.setting1,
					setting2: this.state.setting2,
					checkedA: this.state.checkedA,
					checkedB: this.state.checkedB,
					checkedC: this.state.checkedC,
				},
			},
		};

		try {
			await auth0Client.updateSet(newSet);
			const data = await auth0Client.getUserInfo();
			this.props.setUserProfile(data);
			this.setState({
				isSuccess: true,
				isSaving: false,
			});
		} catch (error) {
			console.log('UpdateSet: ', error);
			this.setState({
				isSuccess: false,
				isSaving: false,
			});
		}
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<Card className={classes.settingView}>
					{this.state.isSuccess ? (
						<div>
							<TSnackbarContent
								onClose={this.handleClose}
								variant="success"
								message="Your settings has been saved!"
							/>
							<Divider />
						</div>
					) : (
							<div />
						)}
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<CustomTableCell align="center">Setting</CustomTableCell>
								<CustomTableCell align="center">Value</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow className={classes.row} hover>
								<CustomTableCell align="center">Setting1</CustomTableCell>
								<CustomTableCell align="center">
									<FormControl className={classes.formControl}>
										<Select
											value={this.state.setting1}
											onChange={event => {
												this.setState({ setting1: event.target.value });
											}}
											inputProps={{
												name: 'age',
												id: 'age-simple',
											}}
										>
											<MenuItem value={10}>s1v1</MenuItem>
											<MenuItem value={20}>s1v2</MenuItem>
											<MenuItem value={30}>s1v3</MenuItem>
										</Select>
									</FormControl>
								</CustomTableCell>
							</TableRow>
							<TableRow className={classes.row} hover>
								<CustomTableCell align="center">Setting2</CustomTableCell>
								<CustomTableCell align="center">
									<Radio
										checked={this.state.setting2 === 'a'}
										onChange={event => {
											this.setState({
												setting2: event.target.value,
											});
										}}
										value="a"
										name="radio-button-demo"
										aria-label="A"
									/>
									<Radio
										checked={this.state.setting2 === 'b'}
										onChange={event => {
											this.setState({
												setting2: event.target.value,
											});
										}}
										value="b"
										name="radio-button-demo"
										aria-label="B"
									/>
									<Radio
										checked={this.state.setting2 === 'c'}
										onChange={event => {
											this.setState({
												setting2: event.target.value,
											});
										}}
										value="c"
										name="radio-button-demo"
										aria-label="C"
									/>
								</CustomTableCell>
							</TableRow>
							<TableRow className={classes.row} hover>
								<CustomTableCell align="center">Setting3</CustomTableCell>
								<CustomTableCell align="center">
									<Checkbox
										checked={this.state.checkedA}
										onChange={this.handleChange('checkedA')}
										value="checkedA"
									/>
									<Checkbox
										checked={this.state.checkedB}
										onChange={this.handleChange('checkedB')}
										value="checkedB"
									/>
									<Checkbox
										checked={this.state.checkedC}
										onChange={this.handleChange('checkedC')}
										value="checkedC"
									/>
								</CustomTableCell>
							</TableRow>
						</TableBody>
					</Table>
					<div className={classes.buttonWrap}>
						<Button
							variant="contained"
							className={classes.marginRight}
							onClick={() => this.props.history.replace('/')}
						>
							Cancel
            			</Button>
						<Button
							variant="contained"
							color="primary"
							disabled={this.state.isSaving}
							onClick={this.handleSave}
						>
							Save &nbsp;
              				{this.state.isSaving && (
								<CircularProgress size={24} thickness={4} />
							)}
						</Button>
					</div>
				</Card>
			</div >
		);
	}
}

const mapStateToProps = state => ({ userProfile: state.global_data.userProfile })

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		{
			setUserProfile,
		}
	)
)(SettingsView);
