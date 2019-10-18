import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import UploadButton from 'components/CustomUpload/UploadButton';
import { Profile } from './types';

const styles = (theme: Theme) => createStyles({
	container: {
		width: '100%',
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
		borderRadius: '0',
	},
	marginRight: {
		marginRight: theme.spacing(1)
	},
	row: {
		display: 'flex'
	},
	avatar: {
		margin: 'auto',
		width: 60,
		height: 60,
		[theme.breakpoints.up('sm')]: {
			width: 80,
			height: 80,
		}
	},
	company: {
		marginLeft: theme.spacing(2),
		flex: 1,
		justifyContent: 'center',
		display: 'flex',
		flexDirection: 'column'
	},
	companyName: {
		fontSize: '1.2rem',
		fontWeight: 600
	},
	rating: {
		marginTop: theme.spacing(2),
	},
	link: {
		fontSize: '0.875rem',
		fontWeight: 600,
		color: 'blue',
		cursor: 'pointer'
	},
	status: {
		position: 'absolute',
		left: '20px',
		top: '10px',
		color: 'blue',
		fontSize: '12px',
	},
	btnBox: {
		margin: theme.spacing(1),
	},
	submitButton: {
		width: 120,
		[theme.breakpoints.up('xs')]: {
			width: 160,
		},
		border: '1px solid #4a148c',
		color: 'white',
		margin: 'auto',
		backgroundColor: theme.palette.primary.light,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
		'&:disabled': {
			backgroundColor: '#FFFFFF',
		},
	},
	cancelButton: {
		border: '1px solid #c7a4ff',
		width: 120,
		[theme.breakpoints.up('xs')]: {
			width: 170,
		},
	},
	waitingSpin: {
		position: 'relative',
		left: 'calc(50% - 10px)',
		top: 'calc(40vh)',
	},
	successAlert: {
		width: '400px',
		marginBottom: '10px',
	},
});

interface ProfileEditViewProps extends StyledComponentProps {
	profile: Profile;
	gotoOverview: () => void;
	handleSave: () => Promise<void>;
	handleChange: (field: string) => (value: any) => void;
	uploadPicture: (file: File) => Promise<string>;
}

const ProfileEditView: React.FC<ProfileEditViewProps> = props => {

	const { classes, profile, handleChange } = props;
	const address = profile.address;
	const [rand, setRand] = React.useState(0);

	const handleSave = () => {
		props.handleSave();
	}

	const handleCancel = () => {
		props.gotoOverview();
	}

	const updatePicture = async (files: File[]) => {
		if (files.length !== 1) return;
		const path = await props.uploadPicture(files[0]);
		if (!!path) {
			setRand(Date.now());
		}
	}

	const nameChange = e => {
		handleChange('address')({
			...address,
			company: e.target.value
		});
	};

	const phoneChange = e => {
		handleChange('address')({
			...address,
			phone: e.target.value
		});
	};

	const cityChange = e => {
		handleChange('address')({
			...address,
			city: e.target.value
		});
	};

	const streetChange = e => {
		handleChange('address')({
			...address,
			street: e.target.value
		});
	};

	const websiteChange = e => {
		handleChange('address')({
			...address,
			website: e.target.value
		});
	}

	const foundedChange = e => {
		handleChange('address')({
			...address,
			founded: e.target.value
		});
	}

	const employeesChange = e => {
		handleChange('address')({
			...address,
			employees: e.target.value
		});
	}


	return (
		<>
			<form noValidate autoComplete="off" style={{ overflow: 'auto' }}>
				<Card className={classes.container}>
					<Box className={classes.row} style={{ justifyContent: 'flex-end' }}>
						<Link onClick={handleSave} className={classes.link}>
							Save
						</Link>
						<Link
							onClick={handleCancel}
							className={classes.link}
							style={{ paddingLeft: 12, color: 'red' }}
						>
							Cancel
						</Link>
					</Box>
					<Box className={classes.row} style={{ flexDirection: 'column', justifyContent: 'center' }}>
						<Avatar
							alt="Avatar"
							src={`${profile.picture}?${rand}`}
							className={classes.avatar}
						/>
						<Box style={{ textAlign: 'center' }}>
							<UploadButton
								className={classes.submitButton}
								style={{ marginTop: 12 }}
								multiple={false}
								filter={'image/*'}
								handleChange={updatePicture}
							>
								Update Picture
							</UploadButton>
						</Box>
					</Box>
					<Grid container className={classes.row} style={{ marginBottom: 8 }}>
						<Grid item xs={12}>
							<TextField
								label="company"
								fullWidth
								className={classes.textFieldFull}
								value={address.company || ''}
								onChange={nameChange}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingRight: 8 }}>
							<TextField
								label="first name"
								fullWidth
								value={profile.firstname}
								onChange={e => handleChange('firstname')(e.target.value)}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingLeft: 8 }}>
							<TextField
								label="last name"
								fullWidth
								value={profile.lastname}
								onChange={e => handleChange('lastname')(e.target.value)}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Phone number"
								type='phone'
								fullWidth
								value={address.phone || ''}
								onChange={phoneChange}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Website"
								fullWidth
								value={address.website || ''}
								onChange={websiteChange}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingRight: 8 }}>
							<TextField
								label="Year founded"
								type='number'
								fullWidth
								value={address.founded || ''}
								onChange={foundedChange}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingLeft: 8 }}>
							<TextField
								label="Number of employees"
								type='number'
								fullWidth
								value={address.employees || ''}
								onChange={employeesChange}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingRight: 8 }}>
							<TextField
								label="Street"
								fullWidth
								value={address.street || ''}
								onChange={streetChange}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingLeft: 8 }}>
							<TextField
								label="City"
								fullWidth
								value={address.city || ''}
								onChange={cityChange}
								margin="normal"
							/>
						</Grid>
					</Grid>
				</Card>
			</form>
		</>
	);
}

export default withStyles(styles)(ProfileEditView);
