import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#4a148c',
			dark: '#12005e',
		},
		secondary: {
			light: '#c7a4ff',
			main: '#9575cd',
			contrastText: '#000000',
		},
	},

	typography: {
		useNextVariants: true,
		// fontFamily: ['Niramit', 'Arial'].join(','),
	},
	overrides: {
		MuiAppBar: {
			colorPrimary: {
				// backgroundColor: '#001529',
				// color: '#fff',
			}
		},
		MuiDrawer: {
			paper: {
				// backgroundColor: '#001529',
				// color: '#fff',
				height: '100vh',
			}
		},
		MuiBadge: {
			colorSecondary: {
				backgroundColor: '#f50057',
				color: '#fff'
			}
		},
		MuiTableHead: {
			root: {
				backgroundColor: '#4a148c',
			}
		},
		MuiCircularProgress: {
			root: {
				position: 'relative',
				left: 'calc(50% - 16px)',
				top: 'calc(50% - 16px)',
				zIndex: '2000',
			}
		},
		// Muit: {
		//   root: {
		//     fontSize: '0.8125rem',
		//     minWidth: '120px',
		//     maxWidth: '200px',
		//     lineHeight: '1',
		//     minHeight: '36px',
		//     maxHeight: '48px',
		//   },
		//   labelIcon: {
		//     margin: '6px 0px',
		//     lineHeight: '1',
		//     padding: '0px',
		//     minHeight: '56px',
		//   },
		// },
		MuiTabs: {
			root: {
				minHeight: '36px',
			},
		},
		MuiTab: {
			root: {
				textTransform: 'capitalize',
			},
			labelIcon: {
				minHeight: 0,
				paddingTop: '3px',
			}
		},
		MuiBottomNavigation: {
			root: {
				justifyContent: 'flex-start',
			}
		},
		MuiSvgIcon: {
			colorSecondary: {
				color: '#0000008a'
			}
		},
		MuiIconButton: {
			root: {
				padding: '6px 8px',
			},
		},
		MuiTablePagination: {
			toolbar: {
				minHeight: '48px',
				height: '48px',
			},
		},
		MuiContainer: {
			root: {
				padding: 0
			}
		},
		MuiTreeItem: {
			root: {
				paddingTop: 8
			}
		},
		MuiExpansionPanel: {
			root: {
				'&.Mui-expanded': {
					margin: 0
				}
			}
		},
		MuiExpansionPanelSummary: {
			content: {
				'&.Mui-expanded': {
					margin: '8px 0'
				}
			}
		}
	}
});

export default theme;
