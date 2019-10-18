import React from 'react';
import clsx from 'clsx';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import auth0Client from 'services/auth0/auth';
import { History } from 'history';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SendIcon from '@material-ui/icons/Send';
import { MaterialThemeHOC, UserProfile } from 'types/global';
import styles from './Header.style';
import MenuList from '../MenuList';
import { Menu, MenuItem } from '@material-ui/core';
import { MenuProps } from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CustomAvatar from 'components/CustomAvatar';

import ContApi from 'services/contractor';

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	},
})((props: MenuProps) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		{...props}
	/>
));

interface HeaderProps extends MaterialThemeHOC {
	profile: UserProfile;
	history: History;
}

interface HeaderState {
	anchorEl: null | HTMLElement;
	mobileMoreAnchorEl: React.ReactNode;
	open: boolean;
}

class Header extends React.Component<HeaderProps, HeaderState> {
	constructor(props: any) {
		super(props);
		this.state = {
			anchorEl: null,
			mobileMoreAnchorEl: null,
			open: true,
		};
	}

	resizedWindow = () => {
		const open: boolean = window.innerWidth > 960;
		if (open !== this.state.open) {
			this.setState({ open });
		}
	}

	componentDidMount() {
		const open: boolean = window.innerWidth > 960;
		this.setState({ open });
		window.addEventListener('resize', this.resizedWindow);
	}

	componentWillMount() {
		window.removeEventListener('resize', this.resizedWindow);
	}

	handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
		this.handleMobileMenuClose();
	};

	handleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({ mobileMoreAnchorEl: event.currentTarget });
	};

	handleMobileMenuClose = () => {
		this.setState({ mobileMoreAnchorEl: null });
	};

	handleUserLogIn = () => {
		auth0Client.signIn();
	};

	handleUserLogOut = () => {
		auth0Client.signOut();
		this.handleMenuClose();
	};

	handleDrawerOpen = () =>
		this.setState({
			open: true,
		});

	handleDrawerClose = () =>
		this.setState({
			open: false,
		});

	handleClose = () =>
		this.setState({
			anchorEl: null,
		});

	render() {
		const { anchorEl, open } = this.state;
		const { classes } = this.props;
		const isMenuOpen = Boolean(anchorEl);

		const rightApp = auth0Client.isAuthenticated() ? (
			<div>
				<div className={classes.sectionDesktop}>
					<IconButton color="inherit">
						<Badge badgeContent={17} color="secondary">
							<NotificationsIcon />
						</Badge>
					</IconButton>
					<StyledMenu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={this.handleClose}
					>
						<MenuItem component={Link} to={"/profile"}>
							<ListItemIcon>
								<SendIcon />
							</ListItemIcon>
							<ListItemText primary="Profile" />
						</MenuItem>
						<MenuItem component={Link} to={"/settings"}>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>
							<ListItemText primary="Settings" />
						</MenuItem>
						<MenuItem onClick={this.handleUserLogOut}>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</MenuItem>
					</StyledMenu>
					<Typography className={classes.title} variant="h6" noWrap>
						{this.props.profile.name}
					</Typography>
					<IconButton
						aria-owns={isMenuOpen ? 'material-appbar' : undefined}
						aria-haspopup="true"
						aria-controls="simple-menu"
						onClick={this.handleProfileMenuOpen}
						color="inherit"
					>
						<CustomAvatar
							src={ContApi.getAvatar(this.props.profile.user_metadata.contractor_id)}
							size={24}
						>
							<AccountCircle />
						</CustomAvatar>
					</IconButton>
				</div>
				<div className={classes.sectionMobile}>
					<IconButton
						aria-haspopup="true"
						onClick={this.handleMobileMenuOpen}
						color="inherit"
					>
						<MoreIcon />
					</IconButton>
				</div>
			</div>
		) : (
				<Button color="inherit" onClick={this.handleUserLogIn}>
					Login
      			</Button>
			);

		return (
			<>
				<AppBar
					position="absolute"
					className={clsx(classes.appBar, open && classes.appBarShift)}
				>
					<Toolbar className={classes.toolbar}>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="Open drawer"
							onClick={this.handleDrawerOpen}
							className={clsx(
								classes.menuButton,
								this.state.open && classes.menuButtonHidden,
							)}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							className={classes.title}
						>
							Dashboard
            			</Typography>
						{rightApp}
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					classes={{
						root: classes.drawerPaperRoot,
						paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
					}}
					open={open}
				>
					<div className={classes.toolbarIcon}>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							className={classes.title}
						>
							LOGO
            			</Typography>
						<IconButton onClick={this.handleDrawerClose}>
							<ChevronLeftIcon color="primary" />
						</IconButton>
					</div>
					<Divider />
					<MenuList />
				</Drawer>
			</>
		);
	}
}

const mapStateToProps = (state: any) => ({
	profile: state.global_data.userProfile,
});

export default compose(
	withStyles(styles),
	withRouter,
	connect(mapStateToProps),
)(Header);
