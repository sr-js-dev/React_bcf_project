import * as React from 'react';
import { Link } from 'react-router-dom';


import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark,
	},
	container: {
		display: 'flex'
	},
	curTabPos: {},
	rootIcon: {
		marginBottom: '0 !important',
	},
	backBtn: {
		color: theme.palette.primary.dark,
	}
}));

type NavTab = {
	href: string;
	label: string;
	icon?: React.ComponentType<SvgIconProps>;
}

interface ICustomNavTabsProps {
	value: number;
	tabs: Array<NavTab>;
	goBack?: () => void;
}

const CustomNavTabs: React.SFC<ICustomNavTabsProps> = (props) => {
	const classes = useStyles({});
	const { value, tabs, goBack } = props;
	return (
		<AppBar position='static' className={classes.root}>
			<Box className={classes.container}>
				{goBack && (
					<IconButton className={classes.backBtn} onClick={goBack}>
						<ArrowBackIcon />
					</IconButton>
				)}
				<Tabs
					value={value}
					variant="scrollable"
					scrollButtons={goBack ? 'auto' : 'on'}
					indicatorColor="primary"
					textColor="primary"
				>
					{tabs.map((tab, index) => (
						<Tab
							key={index}
							component={Link}
							to={tab.href}
							label={tab.label}
							icon={tab.icon && <tab.icon className={classes.rootIcon} />}
						/>
					))}
				</Tabs>
			</Box>
		</AppBar>
	);
};

export default CustomNavTabs;
