import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ArchiveIcon from '@material-ui/icons/Archive';

import CustomTabs from "components/shared/CustomTabs";
import SecuredRoute from 'routers/SecuredRoute';
import ProjectDetailView from 'components/ProjectDetailView';
import ProposalDetailView from 'components/ProposalDetailView';
import ContractorDetailView from 'components/ContractorDetailView';
import AddProjectView from './AddProjectView';
import CurrentProjectView from './CurrentProjectView';
import ArchivedProject from './ArchivedProjectView';
import { UserProfile } from 'types/global';


interface IGenContractorViewProps extends RouteComponentProps {
    userProfile: UserProfile;
}

const GenContractorView: React.SFC<IGenContractorViewProps> = (props) => {

    const { userProfile, match, location } = props;

    if (
        !userProfile.user_metadata.roles.includes('Gen') &&
        !userProfile.user_metadata.roles.includes('GenSub') &&
        !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
        return <Box> Access Forbidden </Box>;

    let tab = 0;
    if (location.pathname.includes('add_project')) tab = 1;
    if (location.pathname.includes('archived')) tab = 2;
    // console.log(location.pathname);
    return (
        <Box style={{ flexGrow: 1, backgroundColor: 'white' }}>
            <CustomTabs
                tabs={[{
                    label: 'Current Projects',
                    href: `${match.url}/current_pros`,
                    icon: ViewComfyIcon
                }, {
                    label: 'Add Project',
                    href: `${match.url}/add_project`,
                    icon: PlaylistAddIcon
                },
                {
                    label: 'Archived',
                    href: `${match.url}/archived`,
                    icon: ArchiveIcon
                }
                ]}
                init={tab}
            />
            <Box style={{ height: 'calc(100vh - 64px - 56px)', paddingTop: '8px', overflow: 'auto' }}>
                <Switch>
                    <SecuredRoute
                        path={`${match.url}/current_pros`}
                        component={CurrentProjectView}
                    />
                    <SecuredRoute
                        path={`${match.url}/add_project`}
                        component={AddProjectView}
                    />
                    <SecuredRoute
                        path={`${match.url}/archived`}
                        component={ArchivedProject}
                    />
                    <SecuredRoute
                        path={`${match.url}/proposal_detail/:id`}
                        component={ProposalDetailView}
                    />
                    <SecuredRoute
                        path={`${match.url}/project_detail/:id`}
                        component={ProjectDetailView}
                    />
                    <SecuredRoute
                        path={`${match.url}/contractor_detail/:id`}
                        component={ContractorDetailView}
                    />
                    <Redirect path={`${match.url}`} to={`${match.url}/current_pros`} />
                </Switch>
            </Box>
        </Box>
    );
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
});

export default connect(mapStateToProps)(GenContractorView);

