import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import ProjectLevels from './ProjectLevels';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import { ProjectLevel, ProjectLevelCategory, ProjectInfo } from 'types/project';
import { UserProfile } from 'types/global';
import * as GenActions from 'store/actions/gen-actions';


const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative'
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)'
	}
}))

interface IProjectLevelsWrapperProps extends RouteComponentProps {
	createLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
	changeLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
	deleteLvl: (id: string) => Promise<any>;
	createRoom: (id: string, room: {
		number: number,
		name: string,
		type: string,
		description: string,
		w: number,
		h: number,
		l: number
	}) => Promise<any>;
	updateRoom: (id: string, cat: ProjectLevelCategory) => Promise<any>;
	deleteRoom: (id: string) => Promise<void>;
	getLevels: (id: string) => Promise<void>;
	levels: ProjectLevel[];
	project: ProjectInfo;
	userProfile: UserProfile;
}

const ProjectLevelsWrapper: React.SFC<IProjectLevelsWrapperProps & withSnackbarProps> = (props) => {

	const { levels, project, showMessage, changeLevel, getLevels, createLevel } = props;
	const classes = useStyles({});
	const [busy, setBusy] = React.useState(false);

	const addLevel = async (number, name, desc) => {
		if (!project) return;

		setBusy(true);
		try {
			await createLevel(project.id, { number, name, description: desc });
			await getLevels(project.id);
			setBusy(false);
			showMessage(true, 'Add Level success');
		} catch (error) {
			console.log('ProjectLevelWrapper.AddLevel: ', error);
			setBusy(false);
			showMessage(false, 'Add Level failed');
		}
	}

	const updateLvl = async (id: string, no: number, name: string, desc: string) => {
		if (!project) return;

		setBusy(true);
		try {
			await changeLevel(id, {
				number: no, name, description: desc
			});
			await getLevels(project.id);
			setBusy(false);
			showMessage(true, 'Update Level success');
		} catch (error) {
			console.log('ProjectLevelWrapper.UpdateLevel: ', error);
			setBusy(false);
			showMessage(false, 'Update Level failed');
		}
	}

	const removeLevel = async (id: string) => {
		const { deleteLvl, getLevels } = props;
		if (!project) return;

		setBusy(true);
		try {
			await deleteLvl(id);
			await getLevels(project.id);

			setBusy(false);
			showMessage(true, 'Delete Level success');
		} catch (error) {
			console.log('ProjectLevelWrapper.RemoveLevel: ', error);
			setBusy(false);
			showMessage(false, 'Delete Level failed');
		}
	}

	const addCategory = async (id: string, cat: ProjectLevelCategory) => {
		const { createRoom, getLevels } = props;
		if (!project) return;

		setBusy(true);
		try {
			await createRoom(id, {
				number: cat.number,
				name: cat.name,
				type: cat.type,
				description: cat.description,
				w: cat.w,
				l: cat.l,
				h: cat.h
			});
			await getLevels(project.id);

			setBusy(false);
			showMessage(true, 'Create Room success');
		} catch (error) {
			console.log('ProjectLevelWrapper.AddRoom: ', error);
			setBusy(false);
			showMessage(false, 'Create Room failed');
		}
	}

	const updateCategory = async (id: string, cat: ProjectLevelCategory) => {
		const { updateRoom, getLevels } = props;
		if (!project) return;

		setBusy(true);
		try {
			await updateRoom(cat.id, cat);
			await getLevels(project.id);

			setBusy(false);
			showMessage(true, 'Update Room success');
		} catch (error) {
			console.log('ProjectLevelWrapper.UpdateRoom: ', error);
			setBusy(false);
			showMessage(true, 'Update Room failed');
		}
	}

	const deleteCategory = async (id: string) => {
		const { deleteRoom, getLevels } = props;
		if (!project) return;

		setBusy(true);
		try {
			await deleteRoom(id);
			await getLevels(project.id);

			setBusy(false);
			showMessage(true, 'Delete Room success');
		} catch (error) {
			console.log('ProjectLevelWrapper.DeleteRoom: ', error);
			setBusy(false);
			showMessage(false, 'Delete Room failed');
		}
	}

	return (
		<Box className={classes.root}>
			<ProjectLevels
				levels={levels}
				addLevel={addLevel}
				updateLevel={updateLvl}
				deleteLevel={removeLevel}
				addCategory={addCategory}
				updateCategory={updateCategory}
				deleteCategory={deleteCategory}
				{...props}
			/>
			{busy && <CircularProgress className={classes.busy} />}
		</Box>
	);
};

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
	levels: state.gen_data.levels,
	project: state.global_data.project,
});

const mapDispatchToProps = dispatch => ({
	createLevel: (id, level) => dispatch(GenActions.createLevel(id, level)),
	createRoom: (id, room) => dispatch(GenActions.createRoom(id, room)),
	changeLevel: (id, data) => dispatch(GenActions.updateLevel(id, data)),
	updateRoom: (id, cat) => dispatch(GenActions.updateRoom(id, cat)),
	deleteLvl: id => dispatch(GenActions.deleteLevel(id)),
	deleteRoom: id => dispatch(GenActions.deleteRoom(id)),
	getLevels: id => dispatch(GenActions.getLevels(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar<IProjectLevelsWrapperProps>(ProjectLevelsWrapper));
