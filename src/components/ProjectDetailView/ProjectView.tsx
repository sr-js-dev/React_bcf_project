import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';

import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import Button from "components/CustomButtons/Button.jsx";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { ProjectInfo } from 'types/project';


const useStyles = makeStyles(theme => ({
	root: {
		height: 'calc(100% - 16px)',
		border: '1px solid #EEE',
		margin: theme.spacing(1)
	},
	title: {
		fontSize: '1.8em',
		fontWeight: 600,
		textAlign: 'left',
		color: '#111',
		padding: theme.spacing(1.5, 0)
	},
	subtitle: {
		fontSize: '1.2em',
		textAlign: 'left',
		color: '#333',
		marginTop: 0,
		marginBottom: '4px',
		fontWeight: 'bold',
	},
	bottomLine: {
		borderBottom: '1px solid #dedede',
	},
	template: {
		display: 'inline',
		fontSize: '1em',
		textAlign: 'left',
		color: '#444',
		marginTop: 0,
	},
	brief: {
		width: '100%',
		display: 'block'
	},
	desc: {
		color: '#222',
		marginTop: 0,
		'& > p': {
			margin: theme.spacing(1, 0),
		},
	},
	budget: {
		display: 'inline-block',
		fontSize: '1em',
		textAlign: 'left',
		fontWeight: 500,
		color: '#222',
		float: 'left'
	},
	posttime: {
		display: 'inline-block',
		fontSize: '1em',
		textAlign: 'left',
		fontWeight: 'normal',
		color: '#666',
		float: 'right'
	},
	status: {
		display: 'inline-block',
		fontSize: '1em',
		textAlign: 'left',
		float: 'right',
		fontWeight: 500,
		color: theme.palette.primary.dark,
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 10px)',
		top: 'calc(50%-10px)',
	},
	editBtn: {
		float: 'right',
		border: '1px solid #4a148c',
		color: theme.palette.primary.light,
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		backgroundColor: '#FFF',
		fontSize: '14px',
		'&:hover': {
			backgroundColor: theme.palette.primary.light,
		},
		'&:disabled': {
			backgroundColor: '#CCC',
		},
	},
}));

interface ProjectViewProps {
	project: ProjectInfo;
	setEdit?: (edit: boolean) => void;
	showFiles?: boolean;
}

const ProjectView: React.SFC<ProjectViewProps> = ({ project, setEdit = undefined, showFiles = true }) => {

	// const { project, setEdit } = props;
	const classes = useStyles({});
	const posttime = project.updatedAt;
	const postdate = new Date(posttime);
	const desc = project.description.replace(/\n/g, '\n\n');
	const remoteRoot = process.env.REACT_APP_PROJECT_API + '/projects/' + project.id + '/files/';

	return (
		<Card className={classes.root}>
			<List aria-label="project-view" style={{ padding: 0 }}>
				<ListItem button={false}>
					<Typography variant='h1' className={classes.title}>{project.title}</Typography>
				</ListItem>
				<Divider />
				<ListItem button={false} style={{ paddingTop: 12, paddingBottom: 2 }}>
					<Box className={classes.brief}>
						<Typography className={classes.budget}>
							Budget: {project.budget}
						</Typography>
						<Typography className={classes.posttime}>
							Posted: {postdate.toDateString()}
						</Typography>
					</Box>
				</ListItem>
				{project.status && project.due && (
					<ListItem button={false} style={{ paddingTop: 2, paddingBottom: 12 }}>
						<Box className={classes.brief}>
							{project.status && (
								<Typography className={classes.budget}>
									Due Date: {project.due.slice(0, 10)}
								</Typography>
							)}
							{project.due && (
								<Typography className={classes.status}>
									Status: {project.status.toUpperCase()}
								</Typography>
							)}
						</Box>
					</ListItem>
				)}
				<Divider />
				<ListItem button={false}>
					<ReactMarkdown
						source={desc}
						className={classes.desc}
					/>
				</ListItem>
				{showFiles && project.projectFiles && project.projectFiles.length > 0 && (
					<>
						<Divider />
						<ListItem button={false}>
							<Box className={classes.brief}>
								<Typography style={{ fontWeight: 700 }}> Files </Typography>
								<ul>
									{project.projectFiles.map(file => (
										<li key={file.id} style={{ listStyleType: 'disc', padding: '4px 0' }}>
											<a download={file.name} href={remoteRoot + file.name}>
												{file.name}
											</a>
										</li>
									))}
								</ul>
							</Box>
						</ListItem>
					</>
				)}
				{setEdit && (
					<>
						<Divider />
						<ListItem button={false} style={{ textAlign: 'right' }}>
							<Box className={classes.brief}>
								<Button
									color="primary"
									className={classes.editBtn}
									onClick={() => setEdit(true)}
								>
									Edit
                				</Button>
							</Box>
						</ListItem>
					</>
				)}
			</List>
		</Card>
	);
};

export default ProjectView;
