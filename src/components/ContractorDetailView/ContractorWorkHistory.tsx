import * as React from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'


import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import { Add as AddIcon } from '@material-ui/icons';

import { ISnackbarProps } from 'components/shared/CustomSnackbar';
import HistoryItem from './HistoryItem';
import HistoryEditItem from './HistoryEditItem';

import { ContractorInfo } from 'types/contractor';
import { HistoryInfo } from 'types/global';
import { setHistoryItem } from 'store/actions/global-actions';
import mockHistory from './history';


const styles = createStyles(theme => ({
    root: {
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)'
    },
    waitingSpin: {
        position: 'absolute',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    action: {
        display: 'flex',
        flexDirection: 'column'
    },
    left: {
        float: 'left'
    },
    right: {
        float: 'right'
    },
    fullWidth: {
        width: '100%'
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)'
    }
}));

export interface IContractorWorkHistoryProps extends RouteComponentProps {
    classes: ClassNameMap<string>;
    edit: boolean;
    contractor: ContractorInfo;
    contractorUpdated: () => Promise<void>;
    setHistoryItem: (info: HistoryInfo) => void;
}

interface IContractorWorkHistoryState extends ISnackbarProps {
    isBusy: boolean;
    history: Array<HistoryInfo>;
    editing: boolean;
    editId?: string;
    files: Array<File>;
}

class ContractorWorkHistory extends React.Component<IContractorWorkHistoryProps, IContractorWorkHistoryState> {

    constructor(props: Readonly<IContractorWorkHistoryProps>) {
        super(props);

        this.state = {
            isBusy: false,
            showMessage: false,
            variant: 'success',
            message: '',
            handleClose: this.closeMessage,
            editing: false,
            editId: undefined,
            files: [],
            history: mockHistory.getHistory()
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleAdd = () => {
        this.setState({ editing: true, editId: undefined });
    }

    handleEdit = (id: string) => {
        this.setState({ editing: true, editId: id });
    }

    handleDelete = (id: string) => {
        this.setState({ history: mockHistory.deleteHistory(id) });
    }

    handleDetail = (info: HistoryInfo) => {
        const { history, match } = this.props;
        this.props.setHistoryItem(info);
        history.push(match.url.slice(0, match.url.lastIndexOf('/') + 1) + 'history_detail');
    }

    handleAddFiles = files => {
        // console.log(this.state.files, e.target.files);
        this.setState({ files: [...this.state.files, ...files] });
    };

    handleRemoveFile = file => {
        const { files } = this.state;

        for (let i = 0; i < files.length; i++) {
            if (files[i].name === file.name && files[i].size === file.size) {
                files.splice(i, 1);
                break;
            }
        }

        this.setState({ files: [...files] });
    };

    handleSave = async (item: HistoryInfo) => {
        let history = [];
        if (this.state.editId) {
            history = mockHistory.updateHistory(this.state.editId, item);
        } else {
            history = mockHistory.addHistory(item);
        }

        this.setState({
            history,
            editId: undefined,
            editing: false
        });
    };

    cancelEdit = () => {
        this.setState({ editing: false, editId: undefined });
    }

    public render() {

        const { classes } = this.props;
        const { history, editId, editing } = this.state;

        return (
            <Box className={classes.root}>
                <Paper square>
                    <List aria-label='contractor-history'>
                        <ListItem>
                            <Box className={classes.fullWidth}>
                                <IconButton
                                    className={classes.right}
                                    onClick={this.handleAdd}
                                >
                                    <AddIcon fontSize='large' color='primary' />
                                </IconButton>
                            </Box>
                        </ListItem>
                        {
                            editing && !editId && (
                                <HistoryEditItem
                                    handleSave={this.handleSave}
                                    handleCancel={this.cancelEdit}
                                />
                            )
                        }
                        {
                            history.map(item => {
                                if (editing && item.id === editId) {
                                    return (
                                        <React.Fragment key={item.id}>
                                            <HistoryEditItem
                                                item={item}
                                                handleSave={this.handleSave}
                                                handleCancel={this.cancelEdit}
                                            />
                                            <Divider />
                                        </React.Fragment>
                                    )
                                } else {
                                    return (
                                        <React.Fragment key={item.id}>
                                            <HistoryItem
                                                item={item}
                                                handleDetail={this.handleDetail}
                                                handleDelete={this.handleDelete}
                                                handleEdit={this.handleEdit}
                                            />
                                            <Divider />
                                        </React.Fragment>
                                    )
                                }
                            })
                        }
                    </List>
                </Paper>
            </Box>
        );
    }
}

const mapDispatchToProps = {
    setHistoryItem
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(ContractorWorkHistory));