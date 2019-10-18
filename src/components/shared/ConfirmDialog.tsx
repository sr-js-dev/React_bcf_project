import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import Button from '../CustomButtons/Button';

const useStyles = makeStyles(theme => ({
	relative: {
		position: 'relative',
		left: '0px',
		top: '0px',
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 16px)',
		top: 'calc(50% - 16px)',
	},
}));

export interface IConfirmDialogProps {
	open: boolean;
	busy?: boolean;
	onYes: () => Promise<any> | void;
	onCancel?: () => void;
	title?: string;
	message: string;
}

const ConfirmDialog: React.SFC<IConfirmDialogProps> = props => {

	const classes = useStyles({});
	const {
		open, busy, onYes, onCancel, title, message
	} = props;


	return (
		<Dialog open={open} onClose={onCancel} aria-labelledby="alert-dialog-title">
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent className={classes.relative}>
				{busy && (
					<CircularProgress size={32} thickness={4} className={classes.busy} />
				)}
				<DialogContentText id="alert-dialog-description">
					{message}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				{onCancel && (
					<Button onClick={onCancel} autoFocus>
						Cancel
          			</Button>
				)}
				<Button onClick={onYes} color="primary">
					{onCancel ? 'Yes' : 'OK'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConfirmDialog.defaultProps = {
	busy: false,
	title: 'Confirm',
};

export default ConfirmDialog;
