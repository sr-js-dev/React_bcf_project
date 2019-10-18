import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { createStyles, withStyles } from '@material-ui/core/styles';

import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import SplitPane from 'react-split-pane';
import Button from "components/CustomButtons/Button.jsx";
import CustomTableCell from "components/shared/CustomTableCell";
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import * as TemplActions from 'store/actions/tem-actions';
// import {
// 	addCategory,
// 	deleteCategory,
// 	deleteTemplate,
// 	editTemplate,
// 	selectCategory,
// 	selectTemplate,
// 	getTemplates
// } from 'store/actions/tem-actions';
import { MaterialThemeHOC, UserProfile, NodeInfo, BreadcrumbInfo } from 'types/global';

const styles = theme => createStyles({
	root: {
		position: 'relative'
	},
	descTag: {
		padding: theme.spacing(1),
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
		marginRight: "5px"
	},
	cateList: {
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
	successAlert: {
		margin: theme.spacing(1),
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

interface ITempDetailViewProps extends MaterialThemeHOC, RouteComponentProps<{ id: string }> {
	userProfile: UserProfile;
	nodeTree?: BreadcrumbInfo[];
	currentNode?: NodeInfo;
	selectNode: (id: string) => Promise<NodeInfo>;
	addNode: (id: string, name: string, type: string, value: string, desc: string) => Promise<void>;
	updateNode: (id: string, name: string, type: string, value: string, desc: string) => Promise<void>;
	deleteNode: (id: string) => Promise<void>;
	selectTree: (id: string) => void;
	appendTree: (name: string, id: string) => void;
	clearTree: () => void;
}

interface ITempDetailViewState extends ISnackbarProps {
	name: string;
	type: string;
	value: string;
	description: string;
	cname: string;
	ctype: string;
	cvalue: string;
	cdescription: string;
	showDialog: boolean;
	isBusy: boolean;
}

class TemplateDetailView extends Component<ITempDetailViewProps, ITempDetailViewState> {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			type: '',
			value: '',
			description: '',
			cname: '',
			ctype: '',
			cvalue: '',
			cdescription: '',
			showDialog: false,
			isBusy: false,
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: this.closeMessage
		};
	}

	closeMessage = () => {
		this.setState({ showMessage: false });
	}

	async componentDidMount() {
		const { match, selectNode, appendTree } = this.props;
		try {
			const data = await selectNode(match.params.id);
			appendTree(data.name, data.id);
			this.setState({
				name: data.name,
				type: data.type ? data.type : '',
				value: data.value ? data.value : '',
				description: data.description ? data.description : ''
			});
		} catch (error) {
			console.log('TemplateDetailView.CDM: ', error);
		}
	}

	handleCancel = async () => {
		const { history, nodeTree, clearTree, selectTree, selectNode } = this.props;
		if (!nodeTree || nodeTree.length < 2) {
			clearTree();
			history.replace('/m_temp/all_templates');
		} else {
			this.setState({ isBusy: true });
			try {
				const data = await selectNode(nodeTree[nodeTree.length - 2].id);
				selectTree(nodeTree[nodeTree.length - 2].id);
				this.setState({
					name: data.name,
					type: data.type ? data.type : '',
					value: data.value ? data.value : '',
					description: data.description ? data.description : '',
					isBusy: false
				});
				history.replace(`/m_temp/template_detail/${nodeTree[nodeTree.length - 2].id}`);
			} catch (error) {
				console.log('TemplateDetailView.handleCancel: ', error);
				this.setState({ isBusy: false });
			}
		}
	}

	handleSave = async () => {
		const { currentNode, updateNode } = this.props;
		const { name, type, value, description } = this.state;
		if (!currentNode) return;

		this.setState({ isBusy: true });
		try {
			await updateNode(currentNode.id, name, type, value, description);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Save content success',
				variant: 'success'
			});
		} catch (error) {
			console.log('TemplateDetailView.handleSave: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Save content failed',
				variant: 'error'
			});
		}
	}

	handleDelete = async () => {
		const { currentNode, deleteNode, nodeTree, selectTree, history, clearTree, selectNode } = this.props;

		this.setState({ isBusy: true });
		try {
			await deleteNode(currentNode.id);
			if (!nodeTree || nodeTree.length < 2) {
				clearTree();
				history.replace('/m_temp/all_templates');
			} else {
				const data = await selectNode(nodeTree[nodeTree.length - 2].id);
				selectTree(nodeTree[nodeTree.length - 2].id);
				history.replace(`/m_temp/template_detail/${nodeTree[nodeTree.length - 2].id}`);
				this.setState({
					name: data.name,
					type: data.type ? data.type : '',
					value: data.value ? data.value : '',
					description: data.description ? data.description : '',
					isBusy: false
				});
			}
		} catch (error) {
			this.setState({
				showMessage: true,
				message: 'Please delete child categories first',
				variant: 'error',
				isBusy: false
			});
		}
	}

	gotoChild = async (id: string) => {
		const { selectNode, appendTree } = this.props;
		this.setState({ isBusy: true });
		try {
			const data = await selectNode(id);
			appendTree(data.name, data.id);
			this.props.history.push(`/m_temp/template_detail/${id}`);
			this.setState({
				name: data.name,
				type: data.type ? data.type : '',
				value: data.value ? data.value : '',
				description: data.description ? data.description : '',
				isBusy: false
			});
		} catch (error) {
			console.log('TemplateDetailView.gotoChild: ', error);
		}
	}

	deleteChild = async (id) => {
		const { currentNode, selectNode, deleteNode } = this.props;

		this.setState({ isBusy: true });
		try {
			await deleteNode(id);
			await selectNode(currentNode.id);
			this.setState({
				showMessage: true,
				message: 'Delete child success',
				variant: 'success',
				isBusy: false
			});
		} catch (error) {
			this.setState({
				showMessage: true,
				message: 'Please delete childs first',
				variant: 'error',
				isBusy: false
			});
		}
	}

	addChild = async () => {
		const { currentNode, addNode, selectNode } = this.props;
		const { cname, ctype, cvalue, cdescription } = this.state;

		this.setState({ isBusy: true });
		try {
			await addNode(currentNode.id, cname, ctype, cvalue, cdescription);
			await selectNode(currentNode.id);
			this.setState({
				showMessage: true,
				message: 'Add Category success',
				variant: 'success',
				showDialog: false,
				isBusy: false,
			});
		} catch (error) {
			console.error('TemplateDetailView.addChild: ', error);
			this.setState({
				showMessage: true,
				message: 'Add Category failed',
				variant: 'error',
				showDialog: false,
				isBusy: false
			});
		}
	}

	clickCrumb = async (id: string) => {
		const { selectTree, selectNode } = this.props;
		this.setState({ isBusy: true });
		try {
			await selectTree(id);
			const data = await selectNode(id);
			this.setState({
				name: data.name,
				type: data.type ? data.type : '',
				value: data.value ? data.value : '',
				description: data.description ? data.description : '',
				isBusy: false
			});
		} catch (error) {
			console.error('TemplateDetailView.clickCrumb: ', error);
			this.setState({ isBusy: false });
		}
	}

	render() {
		const { classes, currentNode, nodeTree } = this.props;
		const { name, type, value, description } = this.state;

		if (!currentNode)
			return <Box>Node not selected</Box>;

		return (
			<Box className={classes.root}>
				<SplitPane split="vertical" minSize={50} defaultSize={400} style={{ position: 'relative' }}>
					<Paper className={classes.descTag}>
						{nodeTree && (
							<Breadcrumbs>
								{nodeTree.map(node => (
									<Link key={node.id} onClick={() => this.clickCrumb(node.id)} style={{ cursor: 'pointer' }}>
										{node.name}
									</Link>
								))}
							</Breadcrumbs>
						)}
						<TextField
							label="Name"
							margin="normal"
							value={name}
							fullWidth
							onChange={event => this.setState({ name: event.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							label="Type"
							margin="normal"
							value={type}
							fullWidth
							onChange={event => this.setState({ type: event.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							label="Value"
							margin="normal"
							value={value}
							fullWidth
							onChange={event => this.setState({ value: event.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							value={description}
							onChange={val => this.setState({ description: val })}
							options={{ placeholder: 'Description here' }}
						/>
						<Box>
							<Button
								disabled={this.state.isBusy}
								className={classes.marginRight}
								onClick={this.handleCancel}
							>
								Cancel
              				</Button>
							<Button
								disabled={this.state.isBusy}
								className={classes.marginRight}
								onClick={this.handleSave}
								color="success"
							>
								Save
							</Button>
							<Button
								disabled={this.state.isBusy}
								onClick={this.handleDelete}
								color="danger"
							>
								Delete
							</Button>
						</Box>
					</Paper>
					<Paper className={classes.cateList}>
						<Table>
							<TableHead>
								<TableRow>
									<CustomTableCell>Category Name</CustomTableCell>
									<CustomTableCell align="center">Type</CustomTableCell>
									<CustomTableCell align="center">Value</CustomTableCell>
									<CustomTableCell align="center">
										<IconButton
											style={{ color: '#fff' }}
											onClick={() => this.setState({
												showDialog: true,
												cname: '',
												ctype: '',
												cvalue: '',
												cdescription: ''
											})}
										>
											<NoteAddIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{currentNode && currentNode.children && currentNode.children.map(row => (
									<TableRow className={classes.row} key={row.id} hover>
										<CustomTableCell
											component="th"
											scope="row"
											onClick={() => this.gotoChild(row.id)}
										>
											{row.name}
										</CustomTableCell>
										<CustomTableCell
											align="center"
											onClick={() => this.gotoChild(row.id)}
										>
											{row.type}
										</CustomTableCell>
										<CustomTableCell
											align="center"
											onClick={() => this.gotoChild(row.id)}
										>
											{row.value}
										</CustomTableCell>

										<CustomTableCell align="center">
											<IconButton
												className={classes.button}
												aria-label="Delete"
												color="primary"
												onClick={() => this.deleteChild(row.id)}
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
					open={this.state.showDialog}
					onClose={() => this.setState({ showDialog: false })}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Create category</DialogTitle>
					<DialogContent>
						<DialogContentText>
							please input the correct category information
            			</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							label="name"
							type="email"
							fullWidth
							value={this.state.cname}
							onChange={val => this.setState({ cname: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="dense"
							label="type"
							type="text"
							fullWidth
							value={this.state.ctype}
							onChange={val => this.setState({ ctype: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							margin="dense"
							label="value"
							type="text"
							fullWidth
							value={this.state.cvalue}
							onChange={val => this.setState({ cvalue: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<SimpleMDE
							value={this.state.cdescription}
							onChange={val => this.setState({ cdescription: val })}
							options={{ placeholder: 'Description here' }}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							disabled={this.state.isBusy}
							onClick={() => this.setState({ showDialog: false })}
						>
							Cancel
            			</Button>
						<Button
							disabled={this.state.isBusy}
							onClick={this.addChild}
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
	userProfile: state.global_data.userProfile,
	nodeTree: state.tem_data.nodeTree,
	currentNode: state.tem_data.currentNode
});

const mapDispatchToProps = dispatch => ({
	selectNode: id => dispatch(TemplActions.selectNode(id)),
	addNode: (id, name, type, value, desc) => dispatch(TemplActions.addNode(id, name, type, value, desc)),
	updateNode: (id, name, type, value, desc) => dispatch(TemplActions.updateNode(id, name, type, value, desc)),
	deleteNode: id => dispatch(TemplActions.deleteNode(id)),
	selectTree: id => dispatch(TemplActions.selectTree(id)),
	appendTree: (name, id) => dispatch(TemplActions.appendTree(name, id)),
	clearTree: () => dispatch(TemplActions.clearTree()),
});

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(TemplateDetailView)
