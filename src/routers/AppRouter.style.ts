import { createStyles, Theme } from '@material-ui/core/styles';

export default createStyles((theme: Theme) =>
	({
		root: {
			display: 'flex',
		},
		viewarea: {
			width: 'calc(100% - 60px)',
			float: 'left',
			borderRadius: '0',
			height: 'calc(100vh - 64px)',
			[theme.breakpoints.up('md')]: {
				width: '85%',
			},
		},
		waitingSpin: {
			position: 'relative',
			left: 'calc(50vw - 10px)',
			top: 'calc(50vh - 10px)',
		},
		content: {
			flex: 1,
			flexDirection: 'column',
			display: 'flex'
		},
		container: {
			padding: theme.spacing(0, 0),
			flexDirection: 'column',
			display: 'flex',
			flex: 1
		},
		fixedHeight: {
			height: 240,
		},
		appBarSpacer: theme.mixins.toolbar,
		// '@global': {
		// 	'.MuiTab-root': {
		// 		minWidth: '80px',
		// 		[theme.breakpoints.up('md')]: {
		// 			minWidth: '140px'
		// 		}
		// 	},
		// 	'.MuiContainer-root': {
		// 		paddingLeft: 0,
		// 		paddingRight: 0
		// 	}
		// },
	}));
