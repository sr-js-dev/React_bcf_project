import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import ProposalDetailFiles from './ProposalFiles';
import ProposalDetailOverview from './ProposalOverview';
import ProposalDetailMessages from './ProposalMessages';
import ProposalTemplEditView from './ProposalTemplEditView';
import ConfirmDialog from 'components/shared/ConfirmDialog';

import { addOption, deleteOption, getProposalDetails, updateOption } from 'store/actions/global-actions';
import { deleteProposal, submitProposal, updateProposal } from 'store/actions/sub-actions';
import { awardProject } from 'store/actions/gen-actions';

import { ProposalPostInfo, ProposalDetailInfo, ProposalInfo } from 'types/proposal';
import { ProjectInfo } from 'types/project';
import { OptionPostInfo, OptionInfo, UserProfile } from 'types/global';
import { TemplProposal } from './types';

const styles = createStyles(theme => ({
    busy: {
        position: 'absolute',
        left: 'calc(50% - 10px)',
        top: 'calc(50% - 10px)',
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
}));

export interface IProposalDetailViewProps extends RouteComponentProps<{ id: string; }> {
    getProposalDetails: (id: string) => Promise<ProposalDetailInfo>;
    addOption: (propid: string, catid: string, data: OptionPostInfo) => Promise<OptionInfo>;
    updateOption: (id: string, data: OptionPostInfo) => Promise<void>;
    deleteOption: (id: string) => Promise<void>;
    awardProject: (id: string) => Promise<void>;
    deleteProposal: (id: string) => Promise<void>;
    submitProposal: (contid: string, projid: string, data: ProposalPostInfo) => Promise<ProposalInfo>;
    updateProposal: (id: string, data: ProposalPostInfo) => Promise<void>;
    project?: ProjectInfo;
    proposal?: ProposalDetailInfo;
    userProfile: UserProfile;
    classes: ClassNameMap<string>;
}

export interface IProposalDetailViewState {
    brief: ProposalPostInfo;
    currentTab: number;
    proposal?: Array<TemplProposal>;
    templateNo: number;
    showConfirm: boolean;
    message: string;
    isBusy: boolean;
    handleOK: () => void;
    handleCancel?: () => void;
}

class ProposalDetailView extends React.Component<IProposalDetailViewProps, IProposalDetailViewState> {
    constructor(props: IProposalDetailViewProps) {
        super(props);

        this.state = {
            currentTab: 0,
            brief: {},
            proposal: undefined,
            templateNo: 0,
            showConfirm: false,
            message: 'Invalid proposal information',
            handleOK: this.closeConfirm,
            handleCancel: undefined,
            isBusy: false
        }
    }

    closeConfirm = () => {
        this.setState({ showConfirm: false });
    };

    async componentDidMount() {
        const { match } = this.props;
        let proposal = [];
        let brief: ProposalPostInfo = {
            budget: 0,
            duration: 0,
            description: '',
        };
        let propId = match.params.id;

        if (propId !== '-1' || match.url.includes('/s_cont')) {
            if (propId && propId.length > 0) {
                try {
                    const data = await this.props.getProposalDetails(propId);
                    // console.log('ProposalDetailView.cdm', data);
                    proposal = this.createDetails(data);
                    brief.budget = data.proposal.budget;
                    brief.duration = data.proposal.duration;
                    brief.description = data.proposal.description;
                } catch (error) {
                    console.log(error);
                    proposal = this.createEmptyDetails();
                }
            }
        } else {
            proposal = this.createEmptyDetails();
        }

        this.setState({ proposal, brief });
    }

    createDetails = data => {
        const { project, proposal, match } = this.props;
        let curProject = project;
        if (match.params.id !== '-1' && !!proposal) {
            curProject = proposal.proposal.project;
        }

        const details = [];
        curProject.projectTemplates.forEach((templ, index) => {
            const cats = templ.template.categoryList;
            details[index] = {};
            details[index].id = templ.template.id;
            details[index].name = templ.template.name;
            cats.forEach(cat => {
                details[index][cat.id] = {};
                details[index][cat.id].id = cat.id;
                details[index][cat.id].type = cat.type;
                details[index][cat.id].name = cat.name;
                details[index][cat.id].value = cat.value;
                details[index][cat.id].description = cat.description;
                details[index][cat.id].options = [];
            });
        });

        data.temCatOptionDetail &&
            data.temCatOptionDetail.forEach(template => {
                for (let tid in template) {
                    for (let det of details) {
                        if (det.id !== tid) continue;

                        const cats = template[tid];
                        cats.forEach(cat => {
                            for (let cid in cat) {
                                det[cid].options = cat[cid] || [];
                            }
                        });

                        break;
                    }
                }
            });

        return details;
    };

    createEmptyDetails = () => {
        const details = [];
        const { project } = this.props;

        project &&
            project.projectTemplates.forEach((templ, index) => {
                details[index] = {};
                details[index].id = templ.template.id;
                details[index].name = templ.template.name;
                const cats = templ.template.categoryList;
                cats &&
                    cats.forEach(cat => {
                        details[index][cat.id] = {
                            id: cat.id,
                            name: cat.name,
                            type: cat.type,
                            value: cat.value,
                            description: cat.description,
                            options: [],
                        };
                    });
            });

        return details;
    };

    handleTabChange = (event, value) => {
        this.setState({ currentTab: value });
    };

    handleBack = () => {
        const { match, proposal, project } = this.props;
        if (match.url.includes('gen-contractor'))
            this.props.history.push(
                '/gen-contractor/project_detail/' +
                proposal.proposal.project.id +
                '/proposals'
            );
        else if (match.url.includes('s_cont'))
            this.props.history.push(
                '/s_cont/pipeline/' + proposal.proposal.status.toLowerCase()
            );
        else if (match.url.includes('projects')) {
            if (match.params.id !== '-1') {
                this.props.history.push(
                    '/projects/project_detail/' +
                    proposal.proposal.project.id +
                    '/proposals'
                );
            } else {
                if (!!project) {
                    this.props.history.push(
                        '/projects/project_detail/' + project.id + '/proposals'
                    );
                } else {
                    this.props.history.push('/projects/project_detail/');
                }
            }
        }
    };

    handleOverviewChange = brief => {
        this.setState({ brief });
    };

    handleTemplateChange = index => {
        this.setState({ templateNo: index, currentTab: 1 });
    };

    AddOption = async (catId: string, option: OptionInfo) => {
        const categories = this.state.proposal[this.state.templateNo];

        const { proposal } = this.props;
        if (proposal) {
            this.setState({ isBusy: true });
            try {
                const data = await this.props.addOption(proposal.proposal.id, catId, {
                    name: option.name,
                    value: option.value,
                    budget: option.budget,
                    duration: option.duration,
                    description: option.description,
                });

                console.log('add-option: ', data);
                option.id = data.id;
                categories[catId] && categories[catId].options.push(option);
            } catch (error) {
                console.log('add-option failed. ', error);
            }
            this.setState({ isBusy: false });
        } else {
            this.setState({
                showConfirm: true,
                message: 'You have to submit your proposal first',
                handleOK: this.closeConfirm,
                handleCancel: undefined
            })
        }
    }

    UpdateOption = async (catId, option) => {
        const categories = this.state.proposal[this.state.templateNo];
        const cat = categories[catId];
        if (!cat) return;

        this.setState({ isBusy: true });
        const { proposal } = this.props;
        if (proposal) {
            try {
                await this.props.updateOption(option.id, {
                    name: option.name,
                    value: option.value,
                    budget: option.budget,
                    duration: option.duration,
                    description: option.description,
                });
                const len = cat.options.length;
                for (let i = 0; i < len; i++) {
                    if (cat.options[i].id === option.id) {
                        cat.options[i] = option;
                        break;
                    }
                }
            } catch (error) {
                console.log('update-option', error);
            }
        }
        this.setState({ isBusy: false });
    };

    DeleteOption = async (catId, optId) => {
        const categories = this.state.proposal[this.state.templateNo];
        const cat = categories[catId];
        if (!cat) return;

        this.setState({ isBusy: true });
        const { proposal } = this.props;
        if (proposal) {
            try {
                await this.props.deleteOption(optId);
                let len = cat.options.length;
                for (let i = 0; i < len; i++) {
                    if (cat.options[i].id === optId) {
                        cat.options.splice(i, 1);
                        cat.options = [...cat.options];
                        break;
                    }
                }
            } catch (error) {
                console.log('delete-option', error);
            }
        }
        this.setState({ isBusy: false });
    };

    checkProposal = brief => {
        if (!brief.budget || !brief.duration || !brief.description) return false;
        if (brief.description.length === 0) return false;

        return true;
    };

    handleAward = async id => {
        this.setState({ isBusy: true });
        try {
            await this.props.awardProject(id);
            this.setState({
                isBusy: false,
                showConfirm: true,
                message: 'Proposal awarded',
                handleOK: this.closeConfirm,
                handleCancel: null,
            });
        } catch (error) {
            console.log(error);
            this.setState({
                isBusy: false,
                showConfirm: true,
                message: 'Proposal awarding failed.',
            });
        }
    };

    handleDelete = async id => {
        // const { match, proposal } = this.props;

        this.setState({ isBusy: true });
        try {
            await this.props.deleteProposal(id);
            this.setState({ isBusy: false });
            this.handleBack();
            // if (match.url.includes("gen-contractor"))
            // 	this.props.history.push("/gen-contractor/project_detail/" + proposal.proposal.project.id + "/proposals");
            // else if (match.url.includes("s_cont"))
            // 	this.props.history.push('/s_cont/pipeline/' + proposal.proposal.status.toLowerCase());
            // else if (match.url.includes("a_pros"))
            // 	this.props.history.push("/a_pros/project_detail/" + proposal.proposal.project.id + "/proposals");
        } catch (error) {
            console.log(error);
            this.setState({
                isBusy: false,
                showConfirm: true,
                message: 'Proposal deletion failed.',
                handleOK: this.closeConfirm,
                handleCancel: null,
            });
        }
    };

    handleSubmit = async brief => {
        if (!this.checkProposal(brief)) {
            this.setState({
                showConfirm: true,
                isBusy: false,
                message: 'Invalid proposal information',
                handleOK: this.closeConfirm,
                handleCancel: null,
            });
            return;
        }

        const { proposal } = this.state;
        const { project, userProfile, match } = this.props;

        this.setState({ isBusy: true });
        try {
            if (
                match.url.includes('/s_cont') ||
                (match.params.id === '-1' && this.props.proposal)
            ) {
                // In case of update
                await this.props.updateProposal(this.props.proposal.proposal.id, brief);
                this.setState({
                    isBusy: false,
                    brief,
                    showConfirm: true,
                    message: 'Update succeed.',
                    handleOK: this.closeConfirm,
                    handleCancel: null,
                });
            } else {
                let data = await this.props.submitProposal(
                    userProfile.user_metadata.contractor_id,
                    project.id,
                    brief
                );
                const propid = data.id;
                let tasks = [];

                // add options
                for (let templ of proposal) {
                    for (let key in templ) {
                        if (key !== 'id' && key !== 'name') {
                            const options = templ[key].options;
                            for (let opt of options) {
                                tasks.push(
                                    this.props.addOption(propid, templ[key].id, {
                                        name: opt.name,
                                        value: opt.value,
                                        budget: opt.budget,
                                        duration: opt.duration,
                                        description: opt.description,
                                    })
                                );
                            }
                        }
                    }
                }

                for (let task of tasks) {
                    await task;
                }

                // re-get details
                let prop = [];
                let brieff = {
                    budget: 0,
                    duration: 0,
                    description: '',
                };

                let detail = await this.props.getProposalDetails(propid);
                prop = this.createDetails(detail);
                brieff.budget = detail.proposal.budget;
                brieff.duration = detail.proposal.duration;
                brieff.description = detail.proposal.description;

                this.setState({
                    isBusy: false,
                    proposal: prop,
                    brief: brieff,
                    showConfirm: true,
                    message: 'Submission succeed.',
                    handleOK: this.closeConfirm,
                    handleCancel: null,
                });
            }
        } catch (error) {
            this.setState({
                isBusy: false,
                showConfirm: true,
                message: 'Some error occured.',
                handleOK: this.closeConfirm,
                handleCancel: null,
            });
            console.log(error);
        }
    };

    public render() {
        const { classes, match, project } = this.props;
        const { proposal, templateNo, currentTab, brief } = this.state;
        let editable = match.params.id === '-1';
        const status = this.props.proposal && this.props.proposal.proposal.status;

        if (!proposal && !editable) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        editable = editable || (match.url.includes('/s_cont') && status !== 'AWARDED');
        return (
            <Paper square>
                <Box style={{ display: 'flex' }}>
                    <IconButton onClick={this.handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Tabs
                        value={currentTab}
                        onChange={this.handleTabChange}
                        variant="scrollable"
                        indicatorColor="primary"
                        textColor="primary"
                        scrollButtons="off"
                    >
                        <Tab label="Detail" />
                        <Tab label="Templates" />
                        <Tab label="Files" />
                        {match.params.id !== '-1' &&
                            (match.url.includes('/gen-contractor') ||
                                (match.url.includes('/s_cont') &&
                                    (status === 'SUBMITTED' || status === 'AWARDED'))) && (
                                <Tab label="Messages" />
                            )}
                    </Tabs>
                </Box>

                {currentTab === 0 && (
                    <ProposalDetailOverview
                        templateSelected={this.handleTemplateChange}
                        edit={editable}
                        project={project}
                        brief={brief}
                        handleSubmit={this.handleSubmit}
                        handleAward={this.handleAward}
                        handleDelete={this.handleDelete}
                        handleOverviewChange={this.handleOverviewChange}
                    />
                )}
                {currentTab === 1 && (
                    <ProposalTemplEditView
                        proposal={proposal[templateNo]}
                        edit={editable}
                        handleAdd={this.AddOption}
                        handleUpdate={this.UpdateOption}
                        handleDelete={this.DeleteOption}
                    />
                )}
                {currentTab === 2 && (
                    <ProposalDetailFiles
                        edit={editable}
                    />
                )}
                {currentTab === 3 && <ProposalDetailMessages />}

                <ConfirmDialog
                    open={this.state.showConfirm}
                    message={this.state.message}
                    onYes={this.state.handleOK || this.closeConfirm}
                    onCancel={this.state.handleCancel}
                />
                {this.state.isBusy && <CircularProgress className={classes.busy} />}
            </Paper>
        );
    }
}

const mapDispatchToProps = {
    getProposalDetails,
    submitProposal,
    deleteProposal,
    updateProposal,
    addOption,
    updateOption,
    deleteOption,
    awardProject,
};

const mapStateToProps = state => ({
    proposal: state.global_data.proposalDetail,
    project: state.global_data.project,
    userProfile: state.global_data.userProfile,
});

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProposalDetailView);
