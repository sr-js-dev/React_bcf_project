import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Switch, withRouter, RouteComponentProps } from 'react-router-dom';

import { Theme, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';

import CustomTabs from 'components/shared/CustomTabs';
import SecuredRoute from 'routers/SecuredRoute';
import AllSpecialties from './AllSpecialties';
import SpecialtyDetailView from './SpecialtyDetailView';
import { UserProfile } from 'types/global';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    contents: {
        marginTop: theme.spacing(1),
    },
}));

interface ISpecialtyViewProps extends RouteComponentProps {
    userProfile: UserProfile;
}

const SpecialtyView: React.SFC<ISpecialtyViewProps> = (props) => {
    const { userProfile, location } = props;
    const classes = useStyles({});
    if (!userProfile.user_metadata.roles.includes('SuperAdmin')) {
        return <Box className={classes.root}> Access Forbidden </Box>;
    }

    const tabPaths = [
        `/m_spec/all_specialties`,
        `/m_spec/specialty_detail`
    ]
    let tab = 0;
    if (location.pathname.includes(tabPaths[1])) tab = 1;
    console.log(location.pathname, tab);
    return (
        <Box className={classes.root}>
            <CustomTabs
                init={tab}
                tabs={[
                    {
                        href: tabPaths[0],
                        label: 'All Specialties',
                        icon: AppsIcon,
                    },
                    {
                        href: tabPaths[1],
                        label: 'Specialty Detail',
                        icon: BallotIcon,
                    },
                ]}
            />
            <Box component='main' className={classes.contents}>
                <Switch>
                    <SecuredRoute
                        path={tabPaths[0]}
                        component={AllSpecialties}
                    />
                    <SecuredRoute
                        path={tabPaths[1]}
                        component={SpecialtyDetailView}
                    />
                    <Redirect path="/m_spec" to={tabPaths[0]} />
                </Switch>
            </Box>
        </Box>
    );
}

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
});

export default compose(
    withRouter,
    connect(mapStateToProps)
)(SpecialtyView);
