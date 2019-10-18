import { createStyles, Theme } from '@material-ui/core/styles';

export default (theme: Theme) => createStyles({
	root: {
		position: 'relative',
		height: 'calc(100vh - 119px)',
		padding: theme.spacing(1, 0),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		flex: 1,
		overflow: 'auto',
	},
	contents: {
		width: 640,
		height: '100%',
		overflowY: 'auto',
		overflowX: 'hidden',
		padding: theme.spacing(1)
	},
	center: {
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
		position: 'absolute'
	},
	dropzone: {
		width: '300px',
		[theme.breakpoints.up('sm')]: {
			width: '500px',
		},
	},
	button: {
		padding: '6px',
	}
});
