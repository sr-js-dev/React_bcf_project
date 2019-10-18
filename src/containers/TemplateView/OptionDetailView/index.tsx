import React from 'react';
import { compose } from "redux";
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import SplitPane from 'react-split-pane';
import Button from 'components/CustomButtons/Button';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';

import {
	deleteOption,
	editOption,
	selectCategory,
	selectOption,
	selectTemplate
} from 'store/actions/tem-actions';
import { MaterialThemeHOC, UserProfile } from 'types/global';

const styles = (theme: Theme) => createStyles({
	descTag: {
		padding: theme.spacing(1),
		textAlign: 'left',
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		margin: theme.spacing(1),
		borderBottom: '5px solid ' + theme.palette.primary.light,
		height: 'calc((100vh - 64px - 48px - 16px) / 2)',
		[theme.breakpoints.up('md')]: {
			height: 'calc(100vh - 64px - 48px - 16px)',
		},
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
	},
	marginRight: {
		width: 'calc(33% - 20px)',
	},
	optList: {
		textAlign: 'center',
		color: theme.palette.text.secondary,
		whiteSpace: 'nowrap',
		margin: theme.spacing(1),
		borderBottom: '5px solid ' + theme.palette.primary.light,
		height: 'calc((100vh - 64px - 48px - 16px) / 2)',
		[theme.breakpoints.up('md')]: {
			height: 'calc(100vh - 64px - 48px - 16px)',
		},
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
	},
	waitingSpin: {
		position: 'relative',
		left: 'calc(50vw - 10px)',
		top: 'calc(50vh - 10px)',
	},
	editField: {
		lineHeight: '1.5rem',
	},
});

interface Option {
	name: string;
	type: string;
	value: string;
	description: string;
	tem_name: any;
	cat_name: any;
	id: string;
}
interface ConnOptionDetailViewProps extends MaterialThemeHOC, RouteComponentProps {
	option: Option;
	selectTemplate: typeof selectTemplate;
	editOption: typeof editOption;
	selectCategory: typeof selectCategory;
	deleteOption: typeof deleteOption;
	selectOption: typeof selectOption;
	userProfile: UserProfile;
}

interface ConnOptionDetailViewState extends ISnackbarProps {
	name: string;
	value: string;
	description: string;
	openCategoryForm: boolean;
	isSaving: boolean;
	isDeleting: boolean;
	type: any;
}

class OptionDetailView extends React.Component<ConnOptionDetailViewProps, ConnOptionDetailViewState> {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			value: '',
			type: '',
			description: '',
			openCategoryForm: false,
			isSaving: false,
			isDeleting: false,
			showMessage: false,
			variant: 'success',
			message: '',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	componentDidMount() {
		const { option } = this.props;
		if (!option) return;

		this.setState({
			name: option.name,
			value: option.value,
			type: option.type,
			description: option.description,
		});
	}

	gotoTemplate = async (id: string) => {
		await this.props.selectTemplate(id);
		this.props.history.push('/m_temp/template_detail');
	}

	gotoCategory = async (id: string) => {
		await this.props.selectCategory(id);
		this.props.history.push('/m_temp/category_detail');
	}

	saveOption = async (option: Option) => {
		this.setState({ isSaving: true });
		const { userProfile } = this.props;
		const data = {
			name: this.state.name,
			type: this.state.type,
			value: this.state.value,
			description: this.state.description,
			updatedBy: userProfile.email,
		};

		try {
			await this.props.editOption(option.id, data);
			await this.props.selectCategory(option.cat_name.id);
			await this.props.selectOption(option.id);
			this.setState({
				showMessage: true,
				variant: 'success',
				message: 'edit option success',
				openCategoryForm: false,
				isSaving: false
			});
		} catch (error) {
			this.setState({
				showMessage: true,
				variant: 'error',
				message: 'edit option failed',
				openCategoryForm: false,
				isSaving: false
			});
		}
	}

	deleteOption = async (option: Option) => {
		this.setState({ isDeleting: true });
		try {
			await this.props.deleteOption(option.id);
			await this.props.selectCategory(option.cat_name.id);
			this.props.history.push('/m_temp/category_detail');
			this.setState({
				showMessage: true,
				variant: 'success',
				message: 'delete option success',
				openCategoryForm: false,
				isSaving: false
			});
		} catch (error) {
			this.setState({
				showMessage: true,
				variant: 'error',
				message: 'delete option failed',
				openCategoryForm: false,
				isSaving: false
			});
		}
	}

	render() {
		const { classes, option } = this.props;
		const { name, type, value, description } = this.state;

		if (!option) return <Box> </Box>;

		if (option['isLoading'] === true)
			return <CircularProgress className={classes.waitingSpin} />;

		return (
			<Box>
				<SplitPane
					minSize={50}
					defaultSize={400}
					style={{ position: 'relative' }}
				>
					<Paper className={classes.descTag}>
						<Box>
							<Link
								style={{ float: 'left' }}
								onClick={() => this.gotoTemplate(option.tem_name.id)}
							>
								{option.tem_name.name}{' '}
							</Link>{' '}
							<span style={{ float: 'left' }}> &ensp;->&ensp; </span>{' '}
							<Link
								style={{ float: 'left' }}
								onClick={async () => this.gotoCategory(option.cat_name.id)}
							>
								{option.cat_name.name}
							</Link>
						</Box>
						<TextField
							label="option name"
							margin="normal"
							InputLabelProps={{ shrink: true }}
							value={name}
							onChange={val => this.setState({ name: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							label="option type"
							margin="normal"
							InputLabelProps={{ shrink: true }}
							value={type}
							onChange={val => this.setState({ type: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							label="option Vavlue"
							margin="normal"
							InputLabelProps={{ shrink: true }}
							value={value}
							onChange={val => this.setState({ value: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							value={description}
							onChange={val => this.setState({ description: val })}
							options={{ placeholder: 'Description here' }}
						/>
						<Box>
							<Button
								className={classes.marginRight}
								onClick={() => this.props.history.push('/m_temp/category_detail')}
							>
								Cancel
              				</Button>
							<Button
								className={classes.marginRight}
								disabled={this.state.isSaving}
								onClick={() => this.saveOption(option)}
								color="primary"
							>
								Save
                				{this.state.isSaving && (
									<CircularProgress size={24} thickness={4} />
								)}
							</Button>
							<Button
								className={classes.marginRight}
								disabled={this.state.isDeleting}
								onClick={() => this.deleteOption(option)}
								color="danger"
							>
								Delete
                				{this.state.isDeleting && (
									<CircularProgress size={24} thickness={4} />
								)}
							</Button>
						</Box>
					</Paper>
					<Paper className={classes.optList} />
				</SplitPane>
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

const mapStateToProps = state => ({
	option: state.tem_data.selectedOption,
	userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
	selectOption,
	selectTemplate,
	selectCategory,
	editOption,
	deleteOption,
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps)
)(OptionDetailView)
