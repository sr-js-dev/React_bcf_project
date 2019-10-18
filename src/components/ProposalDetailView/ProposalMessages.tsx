import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withStyles, createStyles } from '@material-ui/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import InfiniteScroll from 'react-infinite-scroller';

import { Button, CircularProgress, IconButton, ListItemSecondaryAction, TextField, Theme } from '@material-ui/core';
import { addFileToPropMessage, addMessageToProposal, getProposalMessages } from 'store/actions/global-actions';
import { DropzoneDialog } from 'material-ui-dropzone';
import { UserProfile } from 'types/global';
import { FlexDirectionProperty, PositionProperty } from 'csstype';

const styles = createStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		height: 'calc(100vh - 64px - 56px - 48px - 8px)',
		display: 'flex',
		flexDirection: 'column' as FlexDirectionProperty,
	},
	listRoot: {
		padding: theme.spacing(1),
		overflow: 'auto',
		flexGrow: 1,
	},
	waitingSpin: {
		position: 'relative' as PositionProperty,
		left: 'calc(50% - 10px)',
		top: 'calc(50% - 10px)',
	},
	inline: {
		display: 'inline',
	},
	inputArea: {
		padding: theme.spacing(1, 1, 0, 1),
		display: 'flex',
		borderTop: '1px solid #AAAAAA',
	},
	bottomSection: {
		backgroundColor: '#FBFBFB',
		padding: theme.spacing(1),
		display: 'flex',
		flexDirection: 'column' as FlexDirectionProperty,
	},
	inputField: {
		flexGrow: 1,
		border: '1px solid #AAAAAA',
	},
	editField: {
		lineHeight: '1.5rem',
		underline: 'none',
		padding: theme.spacing(0, 1),
	},
	backBtn: {
		width: 39,
		height: 39,
	},
	fileCard: {
		borderRadius: 0,
		marginBottom: theme.spacing(1),
	},
	sendBtn: {
		border: '1px solid #4a148c',
		borderRadius: 0,
		backgroundColor: theme.palette.primary.light,
		color: '#FFFFFF',
		height: 39,
		width: 100,
		margin: 12,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
		'&:disabled': {
			backgroundColor: '#FAFAFA',
			border: '1px solid #AAAAAA',
		},
	},
}));

interface ProposalDetailMessagesProps extends RouteComponentProps {
	proposal: any;
	getProposalMessages: (id: number, something: number, pageSize: number) => Promise<any>;
	addMessageToProposal: (prop_id: number, message: any, cont_type: any) => Promise<any>;
	addFileToPropMessage: (msg_id: number, files: File[]) => Promise<void>;
	userProfile: UserProfile;
	classes: ClassNameMap<string>;
}

interface ProposalDetailMessagesState {
	messageInput: any;
	isSending: boolean;
	messageList: any;
	openUploadForm: boolean;
	canLoadMore: boolean;
	toBottom: boolean;
	pageSize: number;
	files: File[];
	isLoadingMore: boolean;
}

class ConnectedProposalDetailMessages extends React.Component<ProposalDetailMessagesProps, ProposalDetailMessagesState> {
	private messageEndRef: React.RefObject<HTMLInputElement> = React.createRef();

	constructor(props) {
		super(props);
		this.state = {
			messageInput: '',
			isSending: false,
			messageList: [],
			openUploadForm: false,
			canLoadMore: true,
			toBottom: false,
			pageSize: 20,
			files: [],
			isLoadingMore: false,
		};
	}

	async componentWillMount() {
		const { proposal } = this.props;

		try {
			const res = await this.props.getProposalMessages(proposal.proposal.id, 0, this.state.pageSize);
			let { messageList } = this.state;
			messageList = messageList.concat(res.content.reverse());
			this.setState({
				messageList: messageList,
				canLoadMore: !res.last,
				toBottom: true,
			});
		} catch (error) {
			console.log('ProposalMessages.CWM: ', error);
		}
	}

	componentDidUpdate() {
		if (this.state.toBottom) {
			this.scrollToBottom();
		}
	}

	scrollToBottom = () => {
		this.messageEndRef.current.scrollIntoView();
	};

	handleSendMessage = async () => {
		const { proposal, match, userProfile } = this.props;
		let { messageList } = this.state;

		if (
			this.state.messageInput.length -
			this.state.messageInput.split('\n') -
			1 ===
			0 &&
			this.state.files.length === 0
		) return;

		this.setState({ isSending: true });
		try {
			const res = await this.props.addMessageToProposal(
				proposal.proposal.id,
				{
					content: this.state.messageInput,
					updatedBy: userProfile.email,
				},
				match.url.substring(1, 7)
			);

			await this.props.addFileToPropMessage(res.id, this.state.files);
			let message = res;

			message.proposalMessageFiles = [];
			for (let k = 0; k < this.state.files.length; k++) {
				message.proposalMessageFiles.push({
					name: this.state.files[k].name,
				});
			}

			messageList.push(res);
			this.setState({
				messageList: messageList,
				toBottom: true,
				isSending: false,
				messageInput: '',
				files: [],
			});
		} catch (error) {
			console.log('ProposalMessages.handleSendMessage: ', error);
		}
	};

	handleMessageKey = ev => {
		if (ev.key === 'Enter' && ev.shiftKey) {
			ev.preventDefault();
			this.handleSendMessage();
		}
	};

	handleLoadMore = async () => {
		const { proposal } = this.props;
		let { messageList } = this.state;
		let pagen = Math.floor(messageList.length / this.state.pageSize);

		if (this.state.isLoadingMore) return;

		this.setState({ isLoadingMore: true, toBottom: false });
		try {
			const res = await this.props.getProposalMessages(
				proposal.proposal.id,
				pagen,
				this.state.pageSize);

			let contents = res.content.reverse();

			let i = 0;

			for (i = 0; i < contents.length; i++) {
				if (contents[i].id === messageList[0].id) {
					break;
				}
			}

			contents.splice(i, contents.length - i);
			messageList = contents.concat(messageList);

			this.setState({
				messageList: messageList,
				isLoadingMore: false,
				canLoadMore: !res.last,
				toBottom: false,
			});
		} catch (error) {
			console.log('ProposalMessages.handleLoadMore: ', error);
		}
	};

	handleUploadFiles = extraFiles => {
		const { files } = this.state;

		extraFiles.forEach(file => {
			let i = 0;
			for (i = 0; i < files.length; i++) {
				if (files[i].name === file.name) break;
			}

			if (i === files.length) files.push(file);
		});

		this.setState({ files: files, openUploadForm: false });
	};

	handleRemoveFile = fileName => {
		const { files } = this.state;

		for (let i = 0; i < files.length; i++) {
			if (files[i].name === fileName) {
				files.splice(i, 1);
				break;
			}
		}

		this.setState({ files: files });
	};

	render() {
		const { classes } = this.props;
		const { messageList, files } = this.state;
		let lineCount = this.state.messageInput.split('\n').length;
		if (lineCount === 1) lineCount++;

		let renderMessages = [];

		for (let i = 0; i < messageList.length; i++) {
			const message = messageList[i];

			let msgFiles = [];

			for (let j = 0; j < message.proposalMessageFiles.length; j++) {
				const row = message.proposalMessageFiles[j];

				msgFiles.push(
					<h5 key={j}>
						<a
							download={row.name}
							href={
								process.env.REACT_APP_PROJECT_API +
								'/messages/' +
								message.id +
								'/files/' +
								row.name
							}
						>
							{row.name}
						</a>
					</h5>
				);
			}

			renderMessages.push(
				<div key={message.id}>
					<ListItem alignItems="flex-start">
						<ListItemAvatar>
							<Avatar> {message.from.email[0]}</Avatar>
						</ListItemAvatar>
						<div>
							<strong>
								<h5>{message.from.email}</h5>
							</strong>
							<pre>{message.content}</pre>
							{msgFiles}
						</div>
						<ListItemSecondaryAction>
							{message.updatedAt.slice(0, 19)}
						</ListItemSecondaryAction>
					</ListItem>
					<Divider variant="inset" component="li" />
				</div>
			);
		}

		return (
			<div className={classes.root}>
				<div className={classes.listRoot}>
					{
						<InfiniteScroll
							pageStart={0}
							loadMore={this.handleLoadMore}
							hasMore={this.state.canLoadMore && !this.state.isLoadingMore}
							isReverse={true}
							initialLoad={false}
							useWindow={false}
						>
							{this.state.isLoadingMore && (
								<CircularProgress
									key={'loader'}
									className={classes.waitingSpin}
									size={24}
									thickness={4}
								/>
							)}
							{renderMessages}
							<div ref={this.messageEndRef}></div>
						</InfiniteScroll>
					}
				</div>
				<div className={classes.bottomSection}>
					<div className={classes.inputArea}>
						<IconButton
							className={classes.backBtn}
							onClick={() => this.setState({ openUploadForm: true })}
						>
							<LinkIcon />
						</IconButton>
						<TextField
							value={this.state.messageInput}
							multiline
							rows={lineCount > 5 ? 5 : lineCount}
							className={classes.inputField}
							onChange={event =>
								this.setState({ messageInput: event.target.value })
							}
							InputProps={{
								disableUnderline: true,
								classes: { input: classes.editField },
							}}
							onKeyPress={this.handleMessageKey}
						/>
						<Button
							className={classes.sendBtn}
							onClick={this.handleSendMessage}
							disabled={
								this.state.isSending ||
								(this.state.files.length === 0 &&
									this.state.messageInput.length -
									this.state.messageInput.split('\n').length +
									1 ===
									0)
							}
						>
							Send
              				{this.state.isSending && (
								<CircularProgress size={24} thickness={4} />
							)}
						</Button>
					</div>
					{files.map(file => (
						<Card key={file.name} className={classes.fileCard}>
							<ListItem alignItems="flex-start">
								<ListItemText
									primary={file.name}
									secondary={
										file.size > 1024 * 1024
											? Math.round(file.size / 1024 / 1024) + 'MB'
											: Math.round(file.size / 1024) + 'KB'
									}
								/>
								<ListItemSecondaryAction>
									<IconButton
										className={classes.backBtn}
										onClick={() => this.handleRemoveFile(file.name)}
									>
										<LinkOffIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						</Card>
					))}
				</div>
				<DropzoneDialog
					open={this.state.openUploadForm}
					onSave={this.handleUploadFiles}
					maxFileSize={52428800}
					showPreviewsInDropzone={true}
					acceptedFiles={[
						'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
					]}
					filesLimit={100}
					// dropzoneText='select files to upload(< 50mb)'
					onClose={() => this.setState({ openUploadForm: false })}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = {
	getProposalMessages,
	addMessageToProposal,
	addFileToPropMessage
};

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
	proposal: state.global_data.proposalDetail,
});

const ProposalDetailMessages = connect(
	mapStateToProps,
	mapDispatchToProps
)(ConnectedProposalDetailMessages);
export default withRouter(withStyles(styles)(ProposalDetailMessages));
