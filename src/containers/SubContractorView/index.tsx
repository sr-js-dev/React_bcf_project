import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import NoSsr from '@material-ui/core/NoSsr';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import TableChartIcon from '@material-ui/icons/TableChart';
import TuneIcon from '@material-ui/icons/Tune';

import SecuredRoute from 'routers/SecuredRoute';
import ProjectDetailView from 'components/ProjectDetailView';
import ProposalDetailView from 'components/ProposalDetailView';
import CustomTabs from "components/shared/CustomTabs";
import ContractorDetailView from 'components/ContractorDetailView';

import SCVAnalyticsView from './SCVAnalyticsView';
import SCVCalendarView from './SCVCalendarView';

import SCVPipelineView from './SCVPipelineView/index';
import SCVReportsView from './SCVReportsView';
import SCVSettingsView from './SCVSettingsView';
import { UserProfile } from 'types/global';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    buttonAdditional: {
        position: 'absolute',
        float: 'right',
        right: '0',
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    mainWrapper: {
        marginTop: theme.spacing(1),
    },
}));

interface ISubContractorViewProps extends RouteComponentProps {
    userProfile: UserProfile;
}

const SubContractorView: React.SFC<ISubContractorViewProps> = (props) => {
    const { match, userProfile, location } = props;
    const classes = useStyles({});

    if (
        !userProfile.user_metadata.roles.includes('Sub') &&
        !userProfile.user_metadata.roles.includes('GenSub') &&
        !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
        return <Box> Access Forbidden </Box>;

    const tabs = [
        {
            href: `${match.url}/pipeline`,
            label: 'Pipeline',
            icon: TableChartIcon,
        },
        {
            href: `${match.url}/calendar`,
            label: 'Calendar',
            icon: CalendarTodayIcon,
        },
        {
            href: `${match.url}/analytics`,
            label: 'Analytics',
            icon: TuneIcon,
        },
        {
            href: `${match.url}/reports`,
            label: 'Reports',
            icon: AssignmentIcon,
        },
        {
            href: `${match.url}/settings`,
            label: 'Setting',
            icon: SettingsIcon,
        },
    ];
    let tab = tabs.map(tab => tab.href).indexOf(location.pathname);
    if (tab < 0) tab = 0
    return (
        <NoSsr>
            <Box className={classes.root}>
                <CustomTabs
                    tabs={tabs}
                    init={tab}
                />
                <main className={classes.mainWrapper}>
                    <Switch>
                        <SecuredRoute
                            path={`${match.url}/pipeline`}
                            component={SCVPipelineView}
                        />
                        <SecuredRoute
                            path={`${match.url}/calendar`}
                            component={SCVCalendarView}
                        />
                        <SecuredRoute
                            path={`${match.url}/analytics`}
                            component={SCVAnalyticsView}
                        />
                        <SecuredRoute
                            path={`${match.url}/reports`}
                            component={SCVReportsView}
                        />
                        <SecuredRoute
                            path={`${match.url}/settings`}
                            component={SCVSettingsView}
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
                        <Redirect path="/s_cont" to={`${match.url}/pipeline`} />
                    </Switch>
                </main>
            </Box>
        </NoSsr>
    );
}

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
});

export default connect(mapStateToProps)(SubContractorView);
