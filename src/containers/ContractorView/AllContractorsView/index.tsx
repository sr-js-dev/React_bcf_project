import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import DeleteIcon from '@material-ui/icons/Delete';

import {
    createContractor,
    deleteContractor,
    getContractors,
} from 'store/actions/cont-actions';
import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import { ContractorPostInfo, Contractors } from 'types/contractor';
import { UserProfile } from 'types/global';


const styles = createStyles(theme => ({
    root: {
        flexGrow: 1,
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 8px)'
    },
    row: {
        cursor: 'pointer',
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
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
    marginRight: {
        marginRight: theme.spacing(1),
    },
    editField: {
        lineHeight: '1.5rem',
    },
}));

interface IAllContractorsViewProps extends RouteComponentProps {
    getContractors: (page: number, size: number) => Promise<void>;
    selectContractor: (id: string) => Promise<void>;
    deleteContractor: (id: string) => Promise<void>;
    createContractor: (data: ContractorPostInfo) => Promise<void>;
    contractors: Contractors;
    userProfile: UserProfile;
    classes: ClassNameMap<string>;
}

interface IAllContractorsViewState extends ISnackbarProps {
    // pagination info
    rowsPerPage: number;
    currentPage: number;
    order: "desc" | "asc";

    isBusy: boolean;
    openCategoryForm: boolean;

    // contractor info
    name: string;
    description: string;

    contractors?: Contractors;   // contractor list
}

class AllContractorsView extends React.Component<IAllContractorsViewProps, IAllContractorsViewState> {

    constructor(props: Readonly<IAllContractorsViewProps>) {
        super(props);

        this.state = {
            rowsPerPage: 20,
            currentPage: 0,
            order: 'desc',

            isBusy: false,
            openCategoryForm: false,

            name: '',
            description: '',

            showMessage: false,
            message: '',
            variant: 'success',
            handleClose: this.closeMessage,

            contractors: undefined
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    componentDidMount() {
        this.props.getContractors(this.state.currentPage, this.state.rowsPerPage);
    }

    componentWillReceiveProps({ contractors }) {
        this.setState({ contractors: contractors });
    }

    changePage = async (page) => {
        this.setState({ currentPage: page, isBusy: true });
        try {
            await this.props.getContractors(page, this.state.rowsPerPage);
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('AllContractorsView.changePage: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Some errors occured',
                variant: 'error'
            });
        }
    }

    changeRowsPerPage = async event => {
        const { contractors } = this.props;
        const rowsPerPage = event.target.value;
        const currentPage = (rowsPerPage >= contractors.totalElements)
            ? 0 : this.state.currentPage;

        this.setState({
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
            isBusy: true
        });

        try {
            await this.props.getContractors(currentPage, rowsPerPage);
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('AllContractorsView.changePage: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Some errors occured',
                variant: 'error'
            });
        }
    }

    toggleSort = () => {
        let order: ('desc' | 'asc') = 'desc';

        if (this.state.order === 'desc') {
            order = 'asc';
        }

        this.state.contractors.content.sort((a, b) =>
            a.status > b.status ? 1 : -1
        );
        this.setState({ order });
    }

    gotoDetail = (id: string) => {
        // await this.props.selectContractor(id);
        this.props.history.push(`/m_cont/contractor_detail/${id}`);
    }

    delete = async (id: string) => {
        const { currentPage, rowsPerPage, contractors } = this.state;
        let curPage = currentPage;

        this.setState({ isBusy: true });
        try {
            await this.props.deleteContractor(id);
            if (curPage * rowsPerPage >= (contractors.totalElements - 1)) {
                curPage--;
            }

            this.setState({
                currentPage: curPage,
                showMessage: true,
                message: 'Contractor Delete success',
                variant: 'success',
                isBusy: false
            });
            await this.props.getContractors(curPage, rowsPerPage);
        } catch (error) {
            console.log('AllContractorsView.delete: ', error);
            this.setState({
                showMessage: true,
                message: 'Some errors occured',
                variant: 'error',
                isBusy: false
            })
        }
    }


    public render() {
        const { classes } = this.props;
        const { contractors } = this.state;
        if (!contractors) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        return (
            <Box className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell> Contractor Email </CustomTableCell>
                            <CustomTableCell align="center">Contractor Name</CustomTableCell>
                            <CustomTableCell align="center">Contractor Street</CustomTableCell>
                            <CustomTableCell align="center">Contractor City</CustomTableCell>
                            <CustomTableCell align="center">Contractor Phone</CustomTableCell>
                            <CustomTableCell align="center">
                                <TableSortLabel
                                    active={true}
                                    direction={this.state.order}
                                    onClick={this.toggleSort}
                                >
                                    Contractor Status
                                </TableSortLabel>
                            </CustomTableCell>
                            <CustomTableCell align="center">Action</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contractors.content.map(row => (
                            <TableRow className={classes.row} key={row.id} hover>
                                <CustomTableCell
                                    component="th"
                                    scope="row"
                                    onClick={() => this.gotoDetail(row.id)}
                                >
                                    {row.email ? row.email : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.gotoDetail(row.id)}
                                >
                                    {row.address ? row.address.name : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.gotoDetail(row.id)}
                                >
                                    {row.address ? row.address.street : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.gotoDetail(row.id)}
                                >
                                    {row.address ? row.address.city : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.gotoDetail(row.id)}
                                >
                                    {row.address ? row.address.phone : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.gotoDetail(row.id)}
                                >
                                    {row.status ? row.status : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell align="center">
                                    <IconButton
                                        className={classes.button}
                                        aria-label="Delete"
                                        color="primary"
                                        onClick={() => this.delete(row.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    style={{ overflow: 'auto' }}
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={contractors.totalElements}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.currentPage}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onChangePage={this.changePage}
                    onChangeRowsPerPage={this.changeRowsPerPage}
                />

                <CustomSnackbar
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={() => this.setState({ showMessage: false })}
                />
                {this.state.isBusy && <CircularProgress className={classes.busy} />}
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    contractors: state.cont_data.contractors,
    userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
    getContractors,
    deleteContractor,
    createContractor,
}

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(AllContractorsView);
