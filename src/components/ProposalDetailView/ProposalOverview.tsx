import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { compose } from 'redux';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import 'easymde/dist/easymde.min.css';
import Button from 'components/CustomButtons/Button.jsx';
import ConfirmDialog from 'components/shared/ConfirmDialog';
import ContractorView from 'components/Contractor';
import ProposalView from './ProposalView';
import ProposalEditView from './ProposalEditView';
import { awardProject } from 'store/actions/gen-actions';
import { deleteProposal } from 'store/actions/sub-actions';
import { ProjectInfo } from 'types/project';
import { UserProfile, CmnObject } from 'types/global';
import { ProposalPostInfo, ProposalDetailInfo } from 'types/proposal';


const styles = createStyles(theme => ({
    root: {
        position: 'relative',
        overflow: 'auto',
        flexGrow: 1,
        padding: theme.spacing(1),
        width: '100%',
    },
    container: {
        margin: theme.spacing(1),
        padding: 0,
        textAlign: 'right'
    },
    editField: {
        lineHeight: '1.5rem',
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
    width_300: {
        width: 300,
        marginRight: 10,
    }
}));

interface IProposalOverviewProps extends RouteComponentProps<{ id: string; }> {
    deleteProposal: (id: string) => Promise<void>;
    awardProject: (id: string) => Promise<void>;
    handleOverviewChange: (data: ProposalPostInfo) => void;
    handleSubmit: (info: ProposalPostInfo) => Promise<void>;
    handleAward: (id: string) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    templateSelected: (idx: number) => void;
    classes: ClassNameMap<string>;
    userProfile: UserProfile;
    proposal: ProposalDetailInfo;
    project: ProjectInfo;
    edit: boolean;
}

interface IProposalOverviewState extends CmnObject<string | number> {
    budget: number;
    duration: number;
    description: string;
    isBusy: boolean;
    showConfirm: boolean;
    message: string;
    handleOK: () => void;
}

class ProposalOverview extends Component<IProposalOverviewProps, IProposalOverviewState> {
    constructor(props) {
        super(props);

        this.state = {
            budget: props.brief.budget || 0,
            duration: props.brief.duration || 0,
            description: props.brief.description || '',

            isBusy: false,
            showConfirm: false,
            message: 'Would you like to submit your proposal?',
            handleOK: null,
        };
    }

    componentWillUnmount() {
        this.props.handleOverviewChange({
            budget: this.state.budget,
            duration: this.state.duration,
            description: this.state.description,
        });
    }

    budgetChange = val => {
        this.setState({ budget: val });
    }

    durationChange = val => {
        this.setState({ duration: val });
    }

    descriptionChange = val => {
        this.setState({ description: val });
    }

    submit = () => {
        this.setState({
            showConfirm: true,
            message: 'Would you like to submit your proposal?',
            handleOK: this.handleSubmit,
        });
    };

    handleSubmit = async () => {
        this.setState({ showConfirm: false, isBusy: true });
        await this.props.handleSubmit({
            budget: this.state.budget,
            duration: this.state.duration,
            description: this.state.description,
        });
        this.setState({ isBusy: false });
    };

    delete = () => {
        this.setState({
            showConfirm: true,
            message: 'Would you like to delete your proposal?',
            handleOK: this.handleDelete,
        });
    };

    handleDelete = async () => {
        this.setState({ showConfirm: false, isBusy: true });
        await this.props.handleDelete(this.props.proposal.proposal.id);
        this.setState({ isBusy: false });
    };

    award = () => {
        this.setState({
            showConfirm: true,
            message: 'Would you like to award this proposal?',
            handleOK: this.handleAward,
        });
    };

    handleAward = async () => {
        this.setState({ showConfirm: false, isBusy: true });
        await this.props.handleAward(this.props.proposal.proposal.id);
        this.setState({ isBusy: false });
    };

    closeConfirm = () => {
        this.setState({ showConfirm: false });
    };

    gotoContractor = (id) => {
        const { match } = this.props;
        if (match.url.includes('gen-contractor')) {
            this.props.history.push(`/gen-contractor/contractor_detail/${id}`);
        }
        if (match.url.includes('s_cont')) {
            this.props.history.push(`/s_cont/contractor_detail/${id}`);
        }
    }

    render() {
        const { classes, match, proposal, edit } = this.props;

        // let edit = match.params.id === '-1';
        if (!edit && !proposal) return <div className={classes.root} />;

        let project = this.props.project;
        if (proposal && proposal.proposal && proposal.proposal.project) {
            project = proposal.proposal.project;
        }

        if (!project) return <div className={classes.root} />;

        // let c_project = edit ? project : proposal.proposal.project;
        const btnTitle =
            match.url.includes('/s_cont') ||
                (match.params.id === '-1' && this.props.proposal)
                ? 'Update Proposal'
                : 'Submit Proposal';
        // const isGen = match.url.includes('/gen-contractor');

        const templates = project ? project.projectTemplates || [] : [];
        const Buttons = (
            <Box className={classes.container}>
                {match.url.includes('/s_cont') && (
                    <Button
                        disabled={this.state.isBusy}
                        onClick={this.delete}
                        color="warning"
                    >
                        Delete Proposal
                    </Button>
                )}
                {match.url.includes('/gen-contractor') && (
                    <Button
                        disabled={this.state.isBusy || proposal.proposal.status === 'AWARDED'}
                        onClick={this.award}
                        color="success"
                    >
                        Award Project
                    </Button>
                )}
                {edit && (
                    <Button
                        disabled={this.state.isBusy}
                        onClick={this.submit}
                        color="primary"
                    >
                        {btnTitle}
                    </Button>
                )}
            </Box>
        )

        return (
            <Paper className={classes.root}>
                {/* {(!isGen || edit) && <ProjectView project={c_project} />} */}
                {!edit && (
                    <Grid container>
                        <Grid item xs={12} md={9}>
                            <ProposalView
                                proposal={proposal.proposal}
                                selectTemplate={this.props.templateSelected}
                            />
                            {Buttons}
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <ContractorView
                                contractor={proposal.proposal.subContractor}
                                onClick={() => this.gotoContractor(proposal.proposal.subContractor.id)}
                            />
                        </Grid>
                    </Grid>
                )}

                {edit && (
                    <>
                        <ProposalEditView
                            budget={this.state.budget}
                            duration={this.state.duration}
                            description={this.state.description}
                            templates={templates}
                            selectTemplate={this.props.templateSelected}
                            budgetChange={this.budgetChange}
                            durationChange={this.durationChange}
                            descriptionChange={this.descriptionChange} />
                        {Buttons}
                    </>
                )}

                <ConfirmDialog
                    open={this.state.showConfirm}
                    message={this.state.message}
                    onYes={this.state.handleOK}
                    onCancel={this.closeConfirm}
                />
            </Paper >
        );
    }
}

const mapDispatchToProps = {
    deleteProposal,
    awardProject,
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    proposal: state.global_data.proposalDetail,
    project: state.global_data.project,
});

export default compose(
    withStyles(styles),
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProposalOverview);
