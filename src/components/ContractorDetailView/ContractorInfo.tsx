import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import Divider from '@material-ui/core/Divider';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import clsx from 'clsx';

// import Rate from 'components/Rate';
import Button from 'components/CustomButtons/Button.jsx';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import { ContractorStatus, ContractorInfo } from 'types/contractor';
import { approveContractor, rejectContractor } from 'store/actions/cont-actions';


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
    textField: {
        boxShadow: '0 0 5px #999999',
        padding: '0 4px',
        width: '100%'
    },
    subtitle: {
        fontWeight: 600,
        fontSize: '1.2em',
        padding: theme.spacing(1.5, 0.5)
    },
    buttons: {
        marginTop: theme.spacing(1),
        textAlign: 'center',
    },
    brief: {
        width: '100%',
        display: 'block'
    },
    listTop: {
        paddingTop: 12,
        paddingBottom: 2
    },
    listMiddle: {
        paddingTop: 2,
        paddingBottom: 2
    },
    listBottom: {
        paddingTop: 2,
        paddingBottom: 12
    },
    title: {
        display: 'inline-block',
        fontSize: '1.2em',
        textAlign: 'left',
        fontWeight: 600,
        color: '#111',
    },
    info: {
        display: 'inline-block',
        fontSize: '1em',
        textAlign: 'left',
        color: '#222',
    },
    weight500: {
        fontWeight: 500
    },
    weight400: {
        fontWeight: 400
    },
    left: {
        float: 'left'
    },
    right: {
        float: 'right'
    },
    dark: {
        color: theme.palette.primary.dark
    },
    titlebar: {
        padding: theme.spacing(3, 2),
        fontSize: '1.5em',
        backgroundColor: 'rgba(0, 0, 0, 0.12)'
    },
    project: {
        color: '#37A000',
        fontSize: '1.2em',
        fontWeight: 500,
        '&:hover': {
            color: '#008329'
        }
    }
}));

export interface IContractorInfoViewProps {
    approveContractor: (id: string, data: ContractorStatus) => Promise<void>;
    rejectContractor: (id: string, data: ContractorStatus) => Promise<void>;
    contractorUpdated: () => Promise<void>;
    contractor: ContractorInfo;
    classes: ClassNameMap<string>;
    isAdmin: boolean;
}

export interface IContractorInfoViewState extends ContractorStatus, ISnackbarProps {
    isBusy: boolean;
}

class ContractorInfoView extends React.Component<IContractorInfoViewProps, IContractorInfoViewState> {
    constructor(props: IContractorInfoViewProps) {
        super(props);

        this.state = {
            isBusy: false,
            status: props.contractor.status,
            statusReason: props.contractor.statusReason,
            showMessage: false,
            variant: 'success',
            message: '',
            handleClose: this.closeMessage
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    reasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ statusReason: event.target.value });
    }

    approve = async () => {
        const {
            contractor,
            approveContractor,
            contractorUpdated
        } = this.props;

        this.setState({ isBusy: true });
        try {
            await approveContractor(
                contractor.id,
                {
                    status: 'ACTIVE',
                    statusReason: this.state.statusReason
                }
            );

            await contractorUpdated();
            this.setState({
                showMessage: true,
                message: 'Approve success',
                variant: 'success',
                isBusy: false
            });
        } catch (error) {
            console.log('Approve: ', error);
            this.setState({
                showMessage: true,
                message: 'Approve failed',
                variant: 'error',
                isBusy: false
            });
        }
    }

    reject = async () => {
        const {
            contractor,
            rejectContractor,
            contractorUpdated
        } = this.props;

        this.setState({ isBusy: true });
        try {
            await rejectContractor(
                contractor.id,
                {
                    status: 'REJECTED',
                    statusReason: this.state.statusReason
                }
            );

            await contractorUpdated();
            this.setState({
                showMessage: true,
                message: 'Reject success',
                variant: 'success',
                isBusy: false
            });
        } catch (error) {
            console.log('Reject: ', error);
            this.setState({
                showMessage: true,
                message: 'Reject failed',
                variant: 'error',
                isBusy: false
            });
        }
    }

    public render() {

        // const past_works = [
        //     {
        //         title: 'Wordpress tigovit Website',
        //         rate: 4.6,
        //         start: 'Apr 2016',
        //         end: 'May 2019',
        //         review: 'I was very happy with him. He has an excellent knowledge about Wordpress'
        //     },
        //     {
        //         title: 'Wordpress installation and speed optimization',
        //         rate: 5.0,
        //         start: 'Nov 2018',
        //         end: 'Feb 2019',
        //         review: ''
        //     },
        //     {
        //         title: 'Wordpress tigovit Website',
        //         rate: 4.1,
        //         start: 'Dec 2017',
        //         end: 'Mar 2018',
        //         review: 'Good work and nice guy'
        //     },
        //     {
        //         title: 'Web design and development',
        //         rate: 3.7,
        //         start: 'Apr 2019',
        //         end: 'June 2019',
        //         review: 'He was a very dilligent web developer whilst working with us. I would hire again!'
        //     }
        // ];
        const { classes, contractor, isAdmin } = this.props;

        const name = contractor.address ? contractor.address.name || 'N/A' : 'N/A';
        const created = new Date(contractor.createdAt);
        let address = 'N/A';
        if (contractor.address) {
            if (contractor.address.street) {
                address = contractor.address.street;
            }
            if (contractor.address.city) {
                if (contractor.address.street) {
                    address += ', ';
                }

                address += contractor.address.city;
            }
        }

        return (
            <Box className={classes.root}>
                <Paper square>
                    <List aria-label='contractor-detail'>
                        <ListItem button={false}>
                            <Box className={classes.brief}>
                                <Typography className={clsx(classes.left, classes.title)}>
                                    Name: {name}
                                </Typography>
                                <Typography className={clsx(classes.info, classes.right, classes.dark, classes.weight500)}>
                                    Status: {contractor.status.toUpperCase()}
                                </Typography>
                            </Box>
                        </ListItem>
                        <ListItem button={false} className={classes.listTop}>
                            <Box className={classes.brief}>
                                <Typography className={clsx(classes.info, classes.weight500, classes.left)}>
                                    Email: {contractor.email}
                                </Typography>
                                <Typography className={clsx(classes.info, classes.weight400, classes.right)}>
                                    Created at {created.toDateString()}
                                </Typography>
                            </Box>
                        </ListItem>
                        <ListItem button={false} className={classes.listBottom}>
                            <Box className={classes.brief}>
                                <Typography className={clsx(classes.info, classes.weight500)}>
                                    Address: {address}
                                </Typography>
                            </Box>
                        </ListItem>
                    </List>
                </Paper>
                <br />
                <br />
                {/* <Paper square>
                    <List aria-label='contractor-history' style={{ padding: 0 }}>
                        <ListItem button={false} className={classes.titlebar}>
                            <Typography className={classes.title}>
                                Work History
                            </Typography>
                        </ListItem>
                        {
                            past_works.map((work, idx) => (
                                <React.Fragment key={idx}>
                                    <Divider />
                                    <ListItem button={false} style={{ paddingTop: '16px' }}>
                                        <Typography className={classes.project}>
                                            {work.title}
                                        </Typography>
                                    </ListItem>
                                    <ListItem button={false} style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                                        <ul style={{ display: 'inline-flex', padding: 0, listStyleType: 'none' }}>
                                            <li style={{ paddingRight: '16px' }}>
                                                <Rate color='green' rate={work.rate} />
                                            </li>
                                            <li className={clsx(classes.info, classes.weight400)}>
                                                {work.start + ' - ' + work.end}
                                            </li>
                                        </ul>
                                    </ListItem>
                                    <ListItem style={{ paddingTop: '4px', paddingBottom: '16px' }}>
                                        <Typography>
                                            {work.review}
                                        </Typography>
                                    </ListItem>
                                </React.Fragment>
                            ))
                        }
                    </List>
                </Paper> */}
                {
                    isAdmin && (
                        <>
                            <Typography variant='subtitle1' className={classes.subtitle}>
                                Approve/Reject Reason
                            </Typography>
                            <TextField
                                placeholder="Put the reason in"
                                multiline={true}
                                rows={4}
                                value={this.state.statusReason}
                                onChange={this.reasonChange}
                                className={classes.textField}
                            />
                            <Box className={classes.buttons}>
                                <Button variant="contained" onClick={this.reject}>
                                    Reject
                                </Button>
                                <Button color="primary" onClick={this.approve}>
                                    Approve
                                </Button>
                            </Box>
                        </>
                    )
                }
                <CustomSnackbar
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={this.state.handleClose}
                />
                {this.state.isBusy && <CircularProgress className={classes.waitingSpin} />}
            </Box>
        );
    }
}

const mapDispatchToProps = {
    approveContractor,
    rejectContractor,
};

export default compose(
    withStyles(styles),
    connect(
        null,
        mapDispatchToProps
    )
)(ContractorInfoView);
