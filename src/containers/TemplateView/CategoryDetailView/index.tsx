import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { compose } from "redux";

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import SplitPane from 'react-split-pane';

import CustomTableCell from "components/shared/CustomTableCell";
import Button from 'components/CustomButtons/Button';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import { CategoryInfo, UserProfile, CategoryPostInfo, TemplateDetailInfo } from 'types/global';

import {
	deleteCategory,
	editCategory,
	selectCategory,
	selectTemplate,
	addOption,
	deleteOption,
	selectOption,
} from 'store/actions/tem-actions';


const styles = (theme: Theme) => createStyles({
	root: {
		position: 'relative'
	},
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
		overflow: 'scroll',
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
		overflow: 'scroll',
	},
	waitingSpin: {
		position: 'relative',
		left: 'calc(50vw - 10px)',
		top: 'calc(50vh - 10px)',
	},
	editField: {
		lineHeight: '1.5rem',
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	}
});

interface ConnCategoryDetailViewProps extends RouteComponentProps {
	category: CategoryInfo;
	userProfile: UserProfile;
	template: TemplateDetailInfo;
	classes: ClassNameMap<string>;

	selectTemplate: (id: string) => Promise<void>;
	editCategory: (id: string, data: CategoryPostInfo) => Promise<void>;
	selectCategory: (id: string) => Promise<void>;
	deleteCategory: (id: string) => Promise<void>;

	addOption: (id: string, data: any) => Promise<void>;
	selectOption: (id: string) => Promise<void>;
	deleteOption: (id: string) => Promise<void>;
}

interface ConnCategoryDetailViewState extends ISnackbarProps {
	name: string;
	type: string;
	value: string;
	description: string;
	oname: string;
	otype: string;
	ovalue: string;
	oid: string;
	odescription: string;
	openCategoryForm: boolean;
	isBusy: boolean;
	showMessage: boolean;
	message: string;
}

class CategoryDetailView extends Component<ConnCategoryDetailViewProps, ConnCategoryDetailViewState> {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			type: '',
			value: '',
			description: '',
			oname: '',
			otype: '',
			ovalue: '',
			oid: '',
			odescription: '',
			openCategoryForm: false,
			isBusy: false,
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: this.closeMessage
		};
	}

	async componentDidMount() {
		const { category } = this.props;
		if (category) {
			this.setState({
				name: category.name,
				type: category.type,
				value: category.value,
				description: category.description,
			});
		}
	}

	closeMessage = () => {
		this.setState({ showMessage: false });
	}

	handleCancel = async () => {
		const { template } = this.props;
		template && template.id && await this.props.selectTemplate(template.id);
		this.props.history.push('/m_temp/template_detail');
	}

	handleDelete = async () => {
		const { category, template } = this.props;
		this.setState({ isBusy: true });
		try {
			await this.props.deleteCategory(category.id);
			this.setState({ isBusy: false });
			template && template.id && await this.props.selectTemplate(template.id);
			this.props.history.goBack();
		} catch (error) {
			console.log('CategoryDetailView.handleDelete: ', error);
			this.setState({
				showMessage: true,
				message: 'Failed. Please delete options',
				variant: 'error',
				isBusy: false
			});
		}
	}

	handleSave = async (id) => {
		const { userProfile } = this.props;
		const data = {
			name: this.state.name,
			type: this.state.type,
			value: this.state.value,
			description: this.state.description,
			updatedBy: userProfile.email,
		};

		this.setState({ isBusy: true });
		try {
			await this.props.editCategory(id, data);
			await this.props.selectCategory(id);
			this.setState({
				openCategoryForm: false,
				showMessage: true,
				message: 'Edit Category success',
				variant: 'success',
				isBusy: false
			});
		} catch (error) {
			console.log(error);
			this.setState({
				openCategoryForm: false,
				showMessage: true,
				message: 'Edit Category failed',
				variant: 'error',
				isBusy: false
			});
		}
	}

	addOption = async () => {
		const { userProfile, category } = this.props;
		const data = {
			name: this.state.oname,
			type: this.state.otype,
			value: this.state.ovalue,
			description: this.state.odescription,
			updatedBy: userProfile.email,
		};

		this.setState({ isBusy: true, openCategoryForm: false });
		try {
			await this.props.addOption(category.id, data);
			await this.props.selectCategory(category.id);
			this.setState({
				showMessage: true,
				message: 'Add Option Success',
				variant: 'success',
				isBusy: false
			});
		} catch (error) {
			console.log('CategoryDetailView.addOption: ', error);
			this.setState({
				showMessage: true,
				message: 'Add Option failed',
				variant: 'error',
				isBusy: false
			});
		}
	}

	deleteOption = async (id: string) => {
		const { category } = this.props;
		this.setState({ isBusy: true });
		try {
			await this.props.deleteOption(id);
			await this.props.selectCategory(category.id);
			this.setState({
				showMessage: true,
				message: 'Delete Option Success',
				variant: 'success',
				isBusy: false
			});
		} catch (error) {
			console.log('CategoryDetailView.deleteOption: ', error);
			this.setState({
				showMessage: true,
				message: 'Delete Option failed',
				variant: 'error',
				isBusy: false
			});
		}
	}

	selectOption = async (id: string) => {
		await this.props.selectOption(id);
		this.props.history.push('/m_temp/option_detail');
	}

	render() {
		const { classes, category } = this.props;

		if (!category) return <Box>Category not selected</Box>;

		return (
			<Box className={classes.root}>
				<SplitPane
					minSize={50}
					defaultSize={400}
					style={{ position: 'relative' }}
				>
					<Paper className={classes.descTag}>
						<Box>
							<Link
								style={{ float: 'left', cursor: 'pointer' }}
								onClick={this.handleCancel}
							>
								{category.name}
							</Link>
						</Box>
						<TextField
							label="category name"
							margin="normal"
							InputLabelProps={{ shrink: true }}
							value={this.state.name}
							onChange={val => this.setState({ name: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							label="category type"
							margin="normal"
							InputLabelProps={{ shrink: true }}
							value={this.state.type}
							onChange={val => this.setState({ type: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							label="category value"
							margin="normal"
							InputLabelProps={{ shrink: true }}
							value={this.state.value}
							onChange={val => this.setState({ value: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							value={this.state.description}
							onChange={val => this.setState({ description: val })}
							options={{ placeholder: 'Description here' }}
						/>
						<Box>
							<Button
								className={classes.marginRight}
								disabled={this.state.isBusy}
								onClick={this.handleCancel}
							>
								Cancel
              				</Button>
							<Button
								className={classes.marginRight}
								disabled={this.state.isBusy}
								onClick={() => this.handleSave(category.id)}
								color="success"
							>
								Save
							</Button>
							<Button
								disabled={this.state.isBusy}
								className={classes.marginRight}
								onClick={this.handleDelete}
								color="danger"
							>
								Delete
							</Button>
						</Box>
					</Paper>

					<Paper className={classes.optList}>
						<Table>
							<TableHead>
								<TableRow>
									<CustomTableCell> Option Name </CustomTableCell>
									<CustomTableCell align="center">Type</CustomTableCell>
									<CustomTableCell align="center">Value</CustomTableCell>
									<CustomTableCell align="center">
										<IconButton
											style={{ color: '#FFFFFF' }}
											onClick={() =>
												this.setState({
													oname: '',
													ovalue: '',
													otype: '',
													odescription: '',
													oid: '',
													openCategoryForm: true,
												})
											}
										>
											<NoteAddIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{category.optionList && category.optionList.map(row => (
									<TableRow className={classes.row} key={row.id} hover>
										<CustomTableCell
											component="th"
											scope="row"
											onClick={() => this.selectOption(row.id)}
										>
											{row.name}
										</CustomTableCell>
										<CustomTableCell
											align="center"
											onClick={() => this.selectOption(row.id)}
										>
											{row.type}
										</CustomTableCell>
										<CustomTableCell
											align="center"
											onClick={() => this.selectOption(row.id)}
										>
											{row.value}
										</CustomTableCell>
										<CustomTableCell align="center">
											<IconButton
												className={classes.button}
												aria-label="Delete"
												color="primary"
												onClick={() => this.deleteOption(row.id)}
											>
												<DeleteIcon />
											</IconButton>
										</CustomTableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				</SplitPane>
				<Dialog
					open={this.state.openCategoryForm}
					onClose={() => this.setState({ openCategoryForm: false })}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title"> create option</DialogTitle>
					<DialogContent>
						<DialogContentText>
							please input the correct option information
            			</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							label="name"
							type="email"
							fullWidth
							value={this.state.oname}
							onChange={val => this.setState({ oname: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="dense"
							label="type"
							type="email"
							fullWidth
							value={this.state.otype}
							onChange={val => this.setState({ otype: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="dense"
							label="value"
							type="text"
							fullWidth
							value={this.state.ovalue}
							onChange={val => this.setState({ ovalue: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							onChange={val => this.setState({ odescription: val })}
							options={{ placeholder: 'Description here' }}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							disabled={this.state.isBusy}
							onClick={() => this.setState({ openCategoryForm: false })}
						>
							Cancel
            			</Button>
						<Button
							disabled={this.state.isBusy}
							onClick={(e) => this.addOption()}
							color="primary"
						>
							Add
						</Button>
					</DialogActions>
				</Dialog>
				<CustomSnackbar
					open={this.state.showMessage}
					variant={this.state.variant}
					message={this.state.message}
					handleClose={this.state.handleClose}
				/>
				{this.state.isBusy && <CircularProgress className={classes.busy} />}
			</Box>
		);
	}
}

const mapStateToProps = state => ({
	category: state.tem_data.selectedCategory,
	template: state.tem_data.selectedTemplate,
	userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
	selectTemplate,
	deleteOption,
	selectCategory,
	addOption,
	editCategory,
	selectOption,
	deleteCategory,
};

export default compose(
	withRouter,
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(CategoryDetailView)
