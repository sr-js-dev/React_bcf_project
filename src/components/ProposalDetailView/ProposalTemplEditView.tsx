import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import SplitPane from 'react-split-pane';
import CategoryEditView from './CategoryEdit';
import { OptionPostInfo, OptionInfo } from 'types/global';
import { TemplProposal } from './types';


// const menuWidth = 180;
const barHeight = 80;
const styles = createStyles(theme => ({
    root: {
        overflow: 'auto',
        display: 'flex',
        height: 'calc(100vh - 64px - 48px - 16px - 36px)',
    },
    pane: {
        margin: theme.spacing(1),
        height: 'calc(100vh - 64px - 48px - 16px - 36px - 16px)',
        border: '1px solid #CCC',
        overflow: 'auto',
    },
    header: {
        height: `${barHeight}px`,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '700',
        padding: theme.spacing(2),
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 10px)',
        top: 'calc(50%-10px)',
    },
    titleFont: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    otherFont: {
        fontSize: '16px',
        fontWeight: '500',
    },
    active: {
        backgroundColor: theme.palette.primary.light,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '200px',
    },
    select: {
        margin: theme.spacing(1),
    },
    doneBtn: {
        width: '120px',
        marginTop: '10px',
        border: '1px solid #4a148c',
        borderRadius: 0,
        backgroundColor: theme.palette.primary.light,
        color: '#FFFFFF',
        marginLeft: 5,
        marginRight: 5,
        float: 'right',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: '#FFFFFF',
        },
    },
}));

interface IProposalTemplEditViewProps {
    edit: boolean;
    proposal: TemplProposal;
    handleAdd: (catId: string, option: OptionInfo) => Promise<void>;
    handleUpdate: (id: string, data: OptionPostInfo) => Promise<void>;
    handleDelete: (catId: string, optId: string) => Promise<void>;
    classes: ClassNameMap<string>;
}

interface IProposalTemplEditViewState {
    category: string;
}

class ProposalTemplEditView extends React.Component<IProposalTemplEditViewProps, IProposalTemplEditViewState> {
    constructor(props) {
        super(props);

        this.state = {
            category: '',
        };
    }

    componentDidMount() {
        const { proposal } = this.props;
        if (!!proposal) {
            const keys = Object.keys(this.props.proposal);
            // console.log('proposal_edit_view', keys, this.props.proposal);
            keys && keys[2] && this.setState({ category: keys[2] });
        }
    }

    categoryChange = key => {
        this.setState({ category: key });
    };

    render() {
        const { classes, proposal, edit } = this.props;
        if (!proposal) {
            return <Box>No Proposal</Box>;
        }

        const keys = Object.keys(proposal);
        const current = proposal[this.state.category] || {};

        return (
            <Box className={classes.root}>
                <SplitPane
                    split="vertical"
                    minSize={50}
                    defaultSize={180}
                    style={{ position: 'relative' }}
                >
                    <Paper className={classes.pane}>
                        <Typography className={classes.header}>
                            {proposal && proposal.name}
                        </Typography>
                        <List style={{ borderTop: '1px solid #CCC' }}>
                            {keys &&
                                keys.map(
                                    (key, index) =>
                                        key !== 'id' &&
                                        key !== 'name' && (
                                            <React.Fragment key={index}>
                                                <ListItem
                                                    button
                                                    onClick={() => this.categoryChange(key)}
                                                    className={
                                                        key === this.state.category
                                                            ? classes.active
                                                            : undefined
                                                    }
                                                >
                                                    <ListItemText primary={proposal[key].name} />
                                                </ListItem>
                                                <Divider key={index + 1000} />
                                            </React.Fragment>
                                        )
                                )}
                        </List>
                    </Paper>

                    <Paper className={classes.pane}>
                        <Box id="category-info" className={classes.header}>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" align="left" noWrap>
                                        Type: {current.type}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" align="left" noWrap>
                                        Value: {current.value}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" align="left" noWrap>
                                        Description: {current.description}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box id="main-content">
                            {current.id && (
                                <CategoryEditView
                                    edit={edit}
                                    category={current}
                                    handleAdd={this.props.handleAdd}
                                    handleUpdate={this.props.handleUpdate}
                                    handleDelete={this.props.handleDelete}
                                />
                            )}
                        </Box>
                    </Paper>
                </SplitPane>
            </Box>
        );
    }
}

export default withStyles(styles)(ProposalTemplEditView);