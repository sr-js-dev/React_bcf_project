import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';// import 'react-image-gallery/styles/css/image-gallery.css';
import ReactMarkdown from 'react-markdown';
import ImageGallery from 'components/ImageGallery';
import { ContractorInfo } from 'types/contractor';
import { HistoryInfo } from 'types/global';


const styles = theme => createStyles({
	root: {
		position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)'
	},
	titlebar: {
		padding: theme.spacing(3, 2),
		fontSize: '1.5em',
		backgroundColor: 'rgba(0, 0, 0, 0.12)'
	},
	title: {
		display: 'inline-block',
		fontSize: '1.2em',
		textAlign: 'left',
		fontWeight: 600,
		color: '#111',
	},
	subtitle: {
		fontWeight: 600,
		fontSize: '1.2em',
		padding: theme.spacing(1.5, 0.5)
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
	description: {
		paddingTop: theme.spacing(0.5),
		paddingBottom: theme.spacing(2)
	},
	dialog: {
		margin: 0,
		borderRadius: 0,
		padding: 0
	},
	dialogContent: {
		position: 'relative',
		margin: 0,
		padding: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)'
	},
	image: {
		width: '100%',
		height: 'auto',
		display: 'block'
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	}
});

interface IHistoryDetailProps extends RouteComponentProps {
	classes: ClassNameMap<string>;
	edit: boolean;
	contractor: ContractorInfo;
	historyItem?: HistoryInfo;
	contractorUpdated: () => Promise<void>;
}

interface IHistoryDetailState {
	showDialog: boolean;
	selected: string;
}

class HistoryDetail extends React.Component<IHistoryDetailProps, IHistoryDetailState> {

	constructor(props: Readonly<IHistoryDetailProps>) {
		super(props);

		this.state = {
			showDialog: false,
			selected: ''
		}
	}

	selectImage = (image: string) => {
		this.setState({
			showDialog: true,
			selected: image
		});
	}

	render() {
		const { classes, historyItem } = this.props;
		if (!historyItem) {
			return <Box className={classes.root}>History Item not selected</Box>
		}
		return (
			<Paper square className={classes.root}>
				<List aria-label='contractor-history' style={{ padding: 0 }}>
					<ListItem button={false} className={classes.titlebar}>
						<Typography className={classes.title}>
							{historyItem.title}
						</Typography>
					</ListItem>
					<Divider />
					<ListItem button={false} style={{ paddingTop: '16px' }}>
						<Typography className={classes.subtitle}>
							{historyItem.from} - {historyItem.to}
						</Typography>
					</ListItem>
					<ListItem button={false} className={classes.description}>
						<ReactMarkdown source={historyItem.description} />
					</ListItem>
					{
						historyItem.images && historyItem.images.length > 0 && (
							<>
								<Divider />
								<ListItem button={false}>
									<ImageGallery
										items={historyItem.images}
										selectImage={this.selectImage}
									/>
								</ListItem>
							</>
						)
					}
				</List>
				<Dialog
					onClose={() => this.setState({ showDialog: false })}
					aria-labelledby="dialog-title"
					open={this.state.showDialog}
					className={classes.dialog}
				>
					<Box className={classes.dialogContent}>
						<IconButton
							aria-label="Close"
							className={classes.closeButton}
							onClick={() => this.setState({ showDialog: false })}>
							<CloseIcon />
						</IconButton>
						<img src={this.state.selected} className={classes.image} alt='item' />
					</Box>
				</Dialog>

			</Paper>
		);
	}
};

const mapStateToProps = (state) => ({
	historyItem: state.global_data.history
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HistoryDetail));
