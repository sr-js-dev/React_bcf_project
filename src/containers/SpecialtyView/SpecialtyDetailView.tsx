import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles, createStyles, StyledComponentProps, Theme } from '@material-ui/core/styles';
import Button from 'components/CustomButtons/Button';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import { updateSpec } from 'store/actions/spec-actions';
import { Specialty, UserProfile } from 'types/global';

const styles = createStyles((theme: Theme) => ({
	root: {
		width: '400px',
		[theme.breakpoints.up('sm')]: {
			width: '540px',
		},
		position: 'relative',
	},
	waitingSpin: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 16px)',
		top: 'calc(50% - 16px)',
	},
	btnWidth: {
		width: 'calc(33% - 20px)',
		margin: theme.spacing(0, 2),
	},
	descTag: {
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		margin: theme.spacing(1),
		borderBottom: '5px solid ' + theme.palette.primary.light,
		height: 'calc(100vh - 64px - 48px - 16px)',
		[theme.breakpoints.up('md')]: {
			height: 'calc(100vh - 64px - 48px - 16px)',
		},
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
	},
}));

interface ISpecialtyDetailViewProps extends RouteComponentProps, StyledComponentProps {
	specialty: Specialty;
	user: UserProfile;
	updateSpec: (spec: any) => Promise<void>;
}

interface ISpecialtyDetailViewState extends ISnackbarProps {
	isBusy: boolean;
	name: string;
	value: string;
	description: string;
}

export class SpecialtyDetailView extends Component<ISpecialtyDetailViewProps, ISpecialtyDetailViewState> {

	constructor(props: Readonly<ISpecialtyDetailViewProps>) {
		super(props);

		this.state = {
			isBusy: false,
			name: props.specialty && props.specialty.name,
			value: props.specialty && props.specialty.value,
			description: props.specialty && props.specialty.description,
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	componentDidMount() {
	}

	handleSave = async () => {
		const spec = {
			id: this.props.specialty.id,
			name: this.state.name,
			value: this.state.value,
			description: this.state.description,
			updatedBy: this.props.user.email,
		};

		this.setState({ isBusy: true });
		try {
			await this.props.updateSpec(spec);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Specialty updated successfully.',
				variant: 'success'
			});
		} catch (error) {
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Specialty Update failed.',
				variant: 'error'
			});
		}
	};

	goBack = () => {
		this.props.history.goBack();
	};

	render() {
		const { classes, specialty } = this.props;
		if (!specialty) {
			return <Box>Specialty not selected</Box>
		}

		return (
			<Container fixed className={classes.root}>
				{this.state.isBusy && <CircularProgress className={classes.busy} />}
				<Paper className={classes.descTag}>
					<TextField
						label="specialty name"
						margin="normal"
						InputLabelProps={{ shrink: true }}
						value={this.state.name}
						onChange={val => this.setState({ name: val.target.value })}
						InputProps={{ classes: { input: classes.editField } }}
					/>
					<TextField
						label="value"
						margin="normal"
						InputLabelProps={{ shrink: true }}
						value={this.state.value}
						onChange={val => this.setState({ value: val.target.value })}
					/>
					<TextField
						label="description"
						multiline
						rows="10"
						margin="normal"
						InputLabelProps={{ shrink: true }}
						value={this.state.description}
						onChange={val => this.setState({ description: val.target.value })}
					/>
					<Box>
						<Button
							disabled={this.state.isBusy}
							onClick={this.goBack}
							className={classes.btnWidth}
						>
							Cancel
           				</Button>
						<Button
							disabled={this.state.isBusy}
							onClick={this.handleSave}
							color="primary"
							className={classes.btnWidth}
						>
							Save
            			</Button>
					</Box>
				</Paper>
				<CustomSnackbar
					open={this.state.showMessage}
					variant={this.state.variant}
					message={this.state.message}
					handleClose={this.state.handleClose}
				/>
				{this.state.isBusy && <CircularProgress className={classes.busy} />}
			</Container>
		);
	}
}

const mapStateToProps = state => ({
	specialty: state.spec_data.specialty,
	user: state.global_data.userProfile,
});

const mapDispatchToProps = {
	updateSpec,
};

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(SpecialtyDetailView)
