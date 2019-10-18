import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';

import ProfileOverview from './ProfileOverview';
import ProfileEditView from './ProfileEditView';

import { UserProfile, Specialties, ProfileReview } from 'types/global';
import { setUserProfile } from 'store/actions/global-actions';
import * as ContActions from 'store/actions/cont-actions';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import auth0Client from 'services/auth0/auth';
import ContApi from 'services/contractor';
import ProjApi from 'services/project';
import { Profile } from './types';
import { Projects } from 'types/project';

import ProfileLicensesView from './ProfileLicenses';
import ProfileProjectsView from './ProfileProjects';
import ProfilePhotosView from './ProfilePhotos';
import ProfileSocialView from './ProfileSocial';
import ProfileSpecView from './ProfileSpecialty';
import ProfileReviewReview from './ProfileReview';
import AskReview from './AskReview';


const styles = (theme: Theme) => createStyles({
    root: {
        position: 'relative',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        padding: theme.spacing(1, 0),
    },
    contents: {
        width: '400px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        borderRadius: 0,
        [theme.breakpoints.up('xs')]: {
            width: '640px',
        },
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'fixed'
    }
})

interface IProfileViewProps extends RouteComponentProps, withSnackbarProps, StyledComponentProps {
    userProfile: UserProfile;
    contractor: any;
    specialties: Specialties;
    pastProjects: Projects;
    photos: any[];
    links: any[];
    license: any[];
    review: ProfileReview;
    selectContractor: (id: string) => any;
    getPastProjects: (id: string) => Promise<void>;
    setUserProfile: (profile: UserProfile) => void;
    setSelectedContractor: (data: any) => void;
    getPhotos: (id: string) => Promise<void>;
    getLinks: (id: string) => Promise<void>;
    getLicenses: (id: string) => Promise<void>;
}

interface IProfileViewState {
    profile?: Profile;
    editing: number;
    showReview: boolean;
    isBusy: boolean;
}

class ProfileView extends React.Component<IProfileViewProps, IProfileViewState> {

    constructor(props: Readonly<IProfileViewProps>) {
        super(props);

        const contId = props.userProfile.user_metadata.contractor_id;
        this.state = {
            profile: {
                firstname: props.userProfile.user_metadata.firstname,
                lastname: props.userProfile.user_metadata.lastname,
                picture: ContApi.getAvatar(contId),
                email: props.userProfile.email,
                status: props.contractor.status,
                address: props.contractor.address || {
                    name: '',
                    city: '',
                    street: '',
                    phone: '',
                    company: '',
                    website: '',
                    founded: '',
                    employees: ''
                }
            },
            editing: 0,
            isBusy: false,
            showReview: false
        }
    }

    handleSave = async () => {
        const { userProfile, showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            const email = userProfile.email;
            await ContApi.update(id, email, email, this.state.profile.address);

            const new_prof = {
                user_metadata: {
                    firstname: this.state.profile.firstname,
                    lastname: this.state.profile.lastname
                },
            };

            const newProfile = await auth0Client.updateProfile(new_prof);
            this.props.setUserProfile(newProfile);
            showMessage(true, 'Profile saved');
            this.setState({ isBusy: false, editing: 0 });
        } catch (error) {
            console.log('ProfileView.handleSave: ', error);
            showMessage(false, 'Profile save failed');
            this.setState({ isBusy: false });
        }
    }

    handleChange = (field: string) => (value: any) => {
        this.setState({
            profile: {
                ...this.state.profile,
                [field]: value
            }
        });
    }

    uploadPicture = async (file: File) => {

        const { userProfile, showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.uploadAvatar(id, file);
            const path = ContApi.getAvatar(id);
            this.setState({ isBusy: false });
            return path;
        } catch (error) {
            console.log('ProfileView.uploadPicture: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Upload avatar failed');
            return '';
        }
    }

    uploadLicense = async (city: string, type: string, number: string, file: File) => {
        const { userProfile, getLicenses, showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.uploadLicense(id, file, city, type, number);
            await getLicenses(id);
            showMessage(true, 'License uploaded');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileLicensesView.handleSubmit: ', error);
            showMessage(false, 'License upload failed');
            this.setState({ isBusy: false });
        }
    }

    deleteLicense = async (name: string) => {
        const { userProfile, getLicenses, showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.deleteFile(id, name);
            await getLicenses(id);
            showMessage(true, 'License deleted');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileLicensesView.handleSubmit: ', error);
            showMessage(false, 'License delete failed');
            this.setState({ isBusy: false });
        }
    }

    uploadProject = async (title: string, price: number, location: string, service: string, duration: number, unit: string, year: number, desc: string, files: File[]) => {
        let period = 0;
        if (unit.startsWith('day')) period = duration;
        else if (unit.startsWith('week')) period = duration * 7;
        else period = duration * 30;

        const { userProfile, showMessage, getPastProjects } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            const proj = await ContApi.uploadPastProject(id, title, desc, price, year, period, service)
            await ProjApi.addFiles(proj.id, files);
            await getPastProjects(id);
            this.setState({ isBusy: false });
            showMessage(true, 'Project uploaded');
        } catch (error) {
            console.log('ProfileView.uploadProject: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Project upload failed');
        }
    }

    refreshProject = async () => {
        const { userProfile, getPastProjects } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await getPastProjects(id);
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.uploadProject: ', error);
            this.setState({ isBusy: false });
        }
    }

    updateProject = async (projId: string, title: string, price: number, location: string, service: string, duration: number, unit: string, year: number, desc: string) => {
        let period = 0;
        if (unit.startsWith('day')) period = duration;
        else if (unit.startsWith('week')) period = duration * 7;
        else period = duration * 30;

        const { userProfile, showMessage, getPastProjects } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ProjApi.update(projId, {
                title,
                description: desc,
                budget: price,
                year,
                duration: period
            });
            await getPastProjects(id);
            this.setState({ isBusy: false });
            showMessage(true, 'Project updated');
        } catch (error) {
            console.log('ProfileView.updateProject: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Project update failed');
        }
    }

    deleteProject = async (projId: string) => {
        const { userProfile, showMessage, getPastProjects } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ProjApi.delete(projId);
            await getPastProjects(id);
            this.setState({ isBusy: false });
            showMessage(true, 'Project deleted');
        } catch (error) {
            console.log('ProfileView.deleteProject: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Project delete failed');
        }
    }

    addFileToProject = async (projId: string, file: File) => {
        const { showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            await ProjApi.addFiles(projId, [file]);
            this.setState({ isBusy: false });
            showMessage(true, 'File added');
        } catch (error) {
            console.log('ProfileView.addFileToProject: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'File add failed');
        }

        const files = ProjApi.getFiles(projId);
        return files;
    }

    deleteFileFromProject = async (projId: string, name: string) => {
        const { showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            await ProjApi.deleteFile(projId, name);
            this.setState({ isBusy: false });
            showMessage(true, 'File deleted');
        } catch (error) {
            console.log('ProfileView.deleteFileFromProject: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'File delete failed');
        }

        const files = ProjApi.getFiles(projId);
        return files;
    }

    uploadPhoto = async (file: File) => {
        const { userProfile, showMessage, getPhotos } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.uploadPhoto(id, file);
            await getPhotos(id);
            showMessage(true, 'Photo uploaded');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.uploadPhoto: ', error);
            showMessage(false, 'Photo upload failed');
            this.setState({ isBusy: false });
        }
    }

    uploadVideo = async (link: string) => {
        console.log('ProfileView.uploadVideo: ');
        const { userProfile, showMessage, getLinks } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.addLink(id, link);
            await getLinks(id);
            showMessage(true, 'Link added');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.uploadVideo: ', error);
            showMessage(false, 'Add Link failed');
            this.setState({ isBusy: false });
        }
    }

    updateTitle = async (id: string, title: string) => {
        if (!title || title.length === 0) return;
        this.setState({ isBusy: true });
        try {
            await ContApi.updateTitle(id, title);
            await this.props.getPhotos(this.props.userProfile.user_metadata.contractor_id);
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.updateTitle: ', error);
            this.setState({ isBusy: false });
        }
    }

    deletePV = async (name: string) => {
        const { userProfile, showMessage, getPhotos, getLinks } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.deleteFile(id, name);
            await getPhotos(id);
            await getLinks(id);
            showMessage(true, 'Photo deleted');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.deletePV: ', error);
            showMessage(false, 'Photo delete failed');
            this.setState({ isBusy: false });
        }
    }

    saveSocial = async (facebook: string, instagram: string, twitter: string) => {
        const { userProfile, showMessage, getLinks } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            !!facebook && await ContApi.addLink(id, facebook, 'FACEBOOK');
            !!instagram && await ContApi.addLink(id, instagram, 'INSTAGRAM');
            !!twitter && await ContApi.addLink(id, twitter, 'TWITTER');
            await getLinks(id);
            showMessage(true, 'Link added');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.saveSocial: ', error);
            showMessage(false, 'Add Link failed');
            this.setState({ isBusy: false });
        }
    }

    deleteSpecialty = async (specId: string) => {
        const { userProfile, showMessage, selectContractor } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.deleteSpecialty(id, specId);
            const data = await selectContractor(id);
            this.setState({ isBusy: false });
            showMessage(true, 'Specialty deleted');
            return data;
        } catch (error) {
            console.log('ProfileView.deleteSpecialty: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Specialty delete failed');
        }
    }

    saveSpecialty = async (specs: string[]) => {
        const { userProfile, showMessage, contractor, specialties, selectContractor } = this.props;
        const exists = contractor.contractorSpecialties;
        const id = userProfile.user_metadata.contractor_id;

        this.setState({ isBusy: true });
        try {
            const toDel = exists.filter(item => specs.indexOf(item.specialty.name) < 0);
            const toAdd = specialties.content.filter(item => specs.indexOf(item.name) >= 0 && exists.every(exist => item.id !== exist.specialty.id));
            const task = [];
            for (let i = 0; i < toDel.length; i++) {
                task.push(ContApi.deleteSpecialty(id, toDel[i].specialty.id));
            }
            for (let i = 0; i < toAdd.length; i++) {
                task.push(ContApi.addSpecialty(id, toAdd[i].id));
            }

            for (let i = 0; i < task.length; i++) {
                await task[i];
            }

            await selectContractor(id);
            this.setState({ isBusy: false });
            showMessage(true, 'Specialties saved');
        } catch (error) {
            console.log('ProfileView.saveSpecialty: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Specialties save failed');
        }
    }

    openReview = () => {
        this.setState({ showReview: true });
    }

    hideReview = () => {
        this.setState({ showReview: false });
    }

    reqReview = async (mails: string[]) => {
        const { userProfile, showMessage } = this.props;
        const contId = userProfile.user_metadata.contractor_id;

        this.setState({ isBusy: true });
        try {
            await ContApi.requestReview(contId, mails);
            this.setState({ isBusy: false, showReview: false });
            showMessage(true, 'Request sent');
            return true;
        } catch (error) {
            console.log('ProfileView.reqReview: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Request failed');
            return false;
        }
    }

    render() {
        const { profile, editing, isBusy, showReview } = this.state;
        const {
            classes, userProfile,
            specialties, pastProjects,
            photos, links, license,
            contractor, review
        } = this.props;
        const contId = userProfile.user_metadata.contractor_id;
        if (!profile) {
            return (
                <Box className={classes.root}>
                    <CircularProgress className={classes.center} />
                </Box>
            )
        }

        return (
            <Box className={classes.root}>
                <Box className={classes.contents}>
                    {editing === 0 && (
                        <ProfileOverview
                            profile={profile}
                            review={review}
                            gotoEditView={() => this.setState({ editing: 1 })}
                            gotoReview={this.openReview}
                        />
                    )}
                    {editing === 1 && (
                        <ProfileEditView
                            gotoOverview={() => this.setState({ editing: 0 })}
                            profile={profile}
                            handleSave={this.handleSave}
                            handleChange={this.handleChange}
                            uploadPicture={this.uploadPicture}
                        />
                    )}

                    <ProfileReviewReview
                        review={review}
                        askReview={this.openReview}
                    />
                    <ProfileLicensesView
                        contId={contId}
                        licenses={license}
                        handleSubmit={this.uploadLicense}
                        delete={this.deleteLicense}
                    />
                    <ProfileProjectsView
                        addProject={this.uploadProject}
                        deleteProject={this.deleteProject}
                        updateProject={this.updateProject}
                        addFile={this.addFileToProject}
                        deleteFile={this.deleteFileFromProject}
                        refresh={this.refreshProject}
                        specialties={specialties}
                        pastProjects={pastProjects}
                        contId={contId}
                    />
                    <ProfilePhotosView
                        contId={contId}
                        photos={photos}
                        videos={links}
                        uploadPhoto={this.uploadPhoto}
                        uploadVideo={this.uploadVideo}
                        updateTitle={this.updateTitle}
                        delete={this.deletePV}
                    />
                    <ProfileSocialView
                        handleSubmit={this.saveSocial}
                        links={links}
                    />
                    <ProfileSpecView
                        handleDelete={this.deleteSpecialty}
                        handleSave={this.saveSpecialty}
                        contractor={contractor}
                        specialties={specialties}
                    />
                </Box>
                <AskReview
                    contId={contId}
                    company={!!contractor.address ? contractor.address.company : ''}
                    show={showReview}
                    hide={this.hideReview}
                    askReview={this.reqReview}
                />
                {isBusy && <CircularProgress className={classes.center} />}
            </Box >
        );
    }
};

const mapDispatchToProps = {
    setUserProfile,
    selectContractor: ContActions.selectContractor,
    getPastProjects: ContActions.getPastProjects,
    getPhotos: ContActions.getProfilePhotos,
    getLinks: ContActions.getProfileLinks,
    getLicenses: ContActions.getProfileLicenses,
    setSelectedContractor: ContActions.setSelectedContractor,
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    specialties: state.cont_data.specialties,
    pastProjects: state.cont_data.pastProjects,
    contractor: state.cont_data.selectedContractor,
    photos: state.cont_data.photos,
    links: state.cont_data.links,
    review: state.cont_data.review,
    license: state.cont_data.license
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withSnackbar(ProfileView)));
