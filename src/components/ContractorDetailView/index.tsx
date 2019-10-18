import React from 'react';
import { RouteComponentProps, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import CustomNavTabs from 'components/shared/CustomNavTabs';
import SecuredRoute from 'routers/SecuredRoute';
import ContractorInfoView from './ContractorInfo';
import ContractorFiles from './ContractorFiles';
import ContractorSpecialties from './ContractorSpecialties';
import ContractorWorkHistory from './ContractorWorkHistory';
import HistoryDetail from './HistoryDetail';
import { ContractorInfo } from 'types/contractor';
import { selectContractor, updateContractor } from 'store/actions/cont-actions';


const styles = createStyles(theme => ({
    root: {
        flexGrow: 1,
        height: 'calc(100vh - 64px - 56px - 8px)',
        overflow: 'auto'
    },
    content: {
        paddingTop: theme.spacing(1)
    },
    toolbarstyle: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        flexGrow: 1,
    },
}));

interface IContractorDetailViewProps extends RouteComponentProps<{ id: string }> {
    selectedContractor: ContractorInfo;
    selectContractor: (id: string) => Promise<void>;
    updateContractor: (id: string) => Promise<void>;
    classes: ClassNameMap<string>;
}

class ContractorDetailView extends React.Component<IContractorDetailViewProps> {

    constructor(props: Readonly<IContractorDetailViewProps>) {
        super(props);

        this.state = {
            history: undefined
        };
    }

    componentDidMount() {
        this.props.match.params.id && this.props.selectContractor(this.props.match.params.id);
    }

    handleBack = () => {
        this.props.history.goBack();
    }

    contractorUpdated = async () => {
        await this.props.updateContractor(this.props.match.params.id);
    }

    public render() {

        const { classes, selectedContractor, match, location } = this.props;

        if (!selectedContractor) {
            return <CircularProgress style={{ position: 'relative', left: 'calc(50% - 10px)', top: '40vh' }} />;
        }

        const isAdmin = match.url.includes('/m_cont');
        const tabPaths = [
            match.url + '/info',
            match.url + '/files',
            match.url + '/specialties',
            match.url + '/history',
            match.url + '/history_detail',
            match.url
        ];
        const tab = tabPaths.indexOf(location.pathname) % 5;
        return (
            <Box className={classes.root}>
                <Box style={{ display: 'flex' }}>
                    {/* <IconButton className={classes.backBtn} onClick={this.handleBack}>
                        <ArrowBackIcon />
                    </IconButton> */}
                    <CustomNavTabs
                        value={tab}
                        goBack={this.handleBack}
                        tabs={[
                            {
                                href: tabPaths[0],
                                label: 'Info'
                            },
                            {
                                href: tabPaths[1],
                                label: 'Files'
                            },
                            {
                                href: tabPaths[2],
                                label: 'Specialties'
                            },
                            {
                                href: tabPaths[3],
                                label: 'History'
                            },
                            {
                                href: tabPaths[4],
                                label: 'History Detail'
                            }
                        ]}
                    />
                    {/* <Tabs
                        value={curDetailTab}
                        onChange={this.handleTabChange}
                        variant="scrollable"
                        indicatorColor="primary"
                        textColor="primary"
                        scrollButtons="off"
                        className={classes.toolbarstyle}
                    >
                        <Tab label="Info" />
                        <Tab label="Files" />
                        <Tab label="Specialties" />
                        <Tab label="Work History" />
                    </Tabs> */}
                </Box>
                <Box className={classes.content}>
                    <Switch>
                        <SecuredRoute
                            path={tabPaths[0]}
                            render={(props) => (
                                <ContractorInfoView
                                    {...props}
                                    isAdmin={isAdmin}
                                    contractor={selectedContractor}
                                    contractorUpdated={this.contractorUpdated}
                                />
                            )}
                        />
                        <SecuredRoute
                            path={tabPaths[1]}
                            render={(props) => (
                                <ContractorFiles
                                    {...props}
                                    edit={isAdmin}
                                    contractor={selectedContractor}
                                    contractorUpdated={this.contractorUpdated}
                                />
                            )}
                        />
                        <SecuredRoute
                            path={tabPaths[2]}
                            render={(props) => (
                                <ContractorSpecialties
                                    {...props}
                                    edit={isAdmin}
                                    contractor={selectedContractor}
                                    contractorUpdated={this.contractorUpdated}
                                />
                            )}
                        />
                        <SecuredRoute
                            path={tabPaths[3]}
                            render={(props) => (
                                <ContractorWorkHistory
                                    {...props}
                                    edit={isAdmin}
                                    contractor={selectedContractor}
                                    contractorUpdated={this.contractorUpdated}
                                />
                            )}
                        />
                        <SecuredRoute
                            path={tabPaths[4]}
                            render={(props) => (
                                <HistoryDetail
                                    {...props}
                                    edit={isAdmin}
                                    contractor={selectedContractor}
                                    contractorUpdated={this.contractorUpdated}
                                />
                            )}
                        />
                        <Redirect path={`${match.url}`} to={tabPaths[0]} />
                    </Switch>
                    {/* {curDetailTab === 0 && (
                        <ContractorInfoView
                            isAdmin={isAdmin}
                            contractor={selectedContractor}
                            contractorUpdated={this.contractorUpdated}
                        />
                    )}
                    {curDetailTab === 1 && (
                        <ContractorFiles
                            edit={isAdmin}
                            contractor={selectedContractor}
                            contractorUpdated={this.contractorUpdated}
                        />
                    )}
                    {curDetailTab === 2 && (
                        <ContractorSpecialties
                            edit={isAdmin}
                            contractor={selectedContractor}
                            contractorUpdated={this.contractorUpdated}
                        />
                    )}
                    {curDetailTab === 3 && (
                        <ContractorWorkHistory
                            edit={isAdmin}
                            contractor={selectedContractor}
                            contractorUpdated={this.contractorUpdated}
                        />
                    )} */}
                </Box>
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    selectedContractor: state.cont_data.selectedContractor,
});

const mapDispatchToProps = {
    selectContractor,
    updateContractor
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ContractorDetailView));