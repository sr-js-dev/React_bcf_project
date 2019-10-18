import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar from 'components/shared/CustomSnackbar';
import {
    addSpecialty,
    deleteSpecialty,
    getSpecialties,
} from 'store/actions/cont-actions';
import { ContractorInfo } from 'types/contractor';
import { ISnackbarProps } from 'types/components';
import { Specialties } from 'types/global';


const styles = createStyles(theme => ({
    root: {
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    select: {
        width: '180px',
    },
    marginRight: {
        marginRight: theme.spacing(1),
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 10px)',
        top: 'calc(50% - 10px)'
    },
    editField: {
        lineHeight: '1.5rem',
    },
    specialty: {
        margin: theme.spacing(1),
    },
    titleBtn: {
        color: '#FFFFFF',
        padding: '6px',
    },
    button: {
        padding: '6px',
    },
    fab: {
        width: '40px',
        height: '40px',
        marginLeft: '20px',
    },
    tableWrap: {

    }
}));


export interface IContractorSpecialtiesProps {
    getSpecialties: (page: number, size: number) => Promise<void>;
    addSpecialty: (contid: string, specid: string) => Promise<void>;
    deleteSpecialty: (contid: string, specid: string) => Promise<void>;
    contractorUpdated: () => Promise<void>;
    contractor: ContractorInfo;
    classes: ClassNameMap<string>;
    specialties: Specialties;
    edit: boolean;
}

export interface IContractorSpecialtiesState extends ISnackbarProps {
    rowsPerPage: number;
    currentPage: number;
    isBusy: boolean;
    name: string;
    description: string;
    specialty: string;
    order: 'desc' | 'asc';
}

class ContractorSpecialties extends React.Component<IContractorSpecialtiesProps, IContractorSpecialtiesState> {
    constructor(props: Readonly<IContractorSpecialtiesProps>) {
        super(props);

        this.state = {
            rowsPerPage: 20,
            currentPage: 0,
            isBusy: false,
            name: '',
            description: '',
            specialty: '',
            showMessage: false,
            message: '',
            variant: 'success',
            handleClose: this.closeMessage,
            order: 'desc'
        }
    }

    componentDidMount() {
        this.props.getSpecialties(0, 20);
    }

    handleChangePage = (event, page) => {
        this.setState({ currentPage: page });
        this.props.getSpecialties(page, this.state.rowsPerPage);
    };

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleChangeRowsPerPage = event => {
        const { contractor } = this.props;
        const rowsPerPage = event.target.value;
        const currentPage = (rowsPerPage >= contractor.contractorSpecialties.length)
            ? 0 : this.state.currentPage;

        this.setState({
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
        });

        this.props.getSpecialties(currentPage, rowsPerPage);
    }

    toggleSort = () => {
        let order: ('desc' | 'asc') = 'desc';

        if (this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order });
    };

    specialtyChange = event => {
        this.setState({
            specialty: event.target.value,
        });
    };

    handleAddSpec = async () => {
        this.setState({ isBusy: true });
        try {
            await this.props.addSpecialty(this.props.contractor.id, this.state.specialty);
            await this.props.contractorUpdated();
            await this.props.getSpecialties(this.state.currentPage, this.state.rowsPerPage);
            this.setState({
                isBusy: false,
                specialty: '',
                showMessage: true,
                variant: 'success',
                message: 'Specialty Add success'
            });
        } catch (error) {
            console.log('ContractorSpecialties.handleAddSpec: ', error);
            this.setState({
                isBusy: false,
                specialty: '',
                showMessage: true,
                variant: 'error',
                message: 'Specialty Add failed'
            });
        }
    }

    handleRowSelect = async (id: string) => {
        // await this.props.selectContractor(row.id);
        // this.props.history.push('/m_cont/contractor_detail');
    }

    handleDelete = async (id: string) => {
        const { contractor } = this.props;

        this.setState({ isBusy: true });
        try {
            await this.props.deleteSpecialty(contractor.id, id);
            await this.props.contractorUpdated();
            let curPage = this.state.currentPage;
            if (this.state.rowsPerPage * this.state.currentPage >= (contractor.contractorSpecialties.length - 1)) {
                curPage--;
            }
            await this.props.getSpecialties(curPage, this.state.rowsPerPage);

            this.setState({
                currentPage: curPage,
                showMessage: true,
                message: 'Delete Specialty success',
                variant: 'success',
                isBusy: false
            });
        } catch (error) {
            console.log('ContractorSpecialties.handleDelete: ', error);
            this.setState({
                showMessage: true,
                message: 'Delete Specialty failed',
                variant: 'error',
                isBusy: false
            });
        }
    }

    public render() {

        const { classes, specialties, contractor, edit } = this.props;
        const { specialty } = this.state;
        if (!contractor) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        return (
            <Box className={classes.root}>
                {edit && (
                    <Box className={classes.specialty}>
                        <Select
                            className={classes.select}
                            value={specialty}
                            onChange={this.specialtyChange}
                            name="specialties"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {specialties
                                ? specialties.content.map(row => (
                                    <MenuItem value={row.id} key={row.id}>
                                        {row.name}
                                    </MenuItem>
                                )) : null
                            }
                        </Select>
                        <Fab
                            color="primary"
                            aria-label="Add"
                            className={classes.fab}
                            onClick={this.handleAddSpec}
                        >
                            <AddIcon />
                        </Fab>
                        {specialties
                            ? specialties.content.map(row =>
                                row.id === specialty ? (
                                    <ul key={row.id}>
                                        <li>Name: {row.name}</li>
                                        <li>Description: {row.description}</li>
                                    </ul>
                                ) : null
                            ) : null
                        }
                    </Box>
                )}

                <Box className={classes.tableWrap}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Name</CustomTableCell>
                                <CustomTableCell align="center">Desc</CustomTableCell>
                                <CustomTableCell align="center">Value</CustomTableCell>
                                {edit && <CustomTableCell align="center">Action</CustomTableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contractor.contractorSpecialties.map(row => (
                                <TableRow className={classes.row} key={row.id} hover>
                                    <CustomTableCell
                                        component="th"
                                        scope="row"
                                        onClick={() => this.handleRowSelect(row.specialty.id)}
                                    >
                                        {row.specialty.name ? row.specialty.name : 'N/A'}
                                    </CustomTableCell>
                                    <CustomTableCell
                                        align="center"
                                        onClick={() => this.handleRowSelect(row.specialty.id)}
                                    >
                                        {row.specialty.description ? row.specialty.description : 'N/A'}
                                    </CustomTableCell>
                                    <CustomTableCell
                                        align="center"
                                        onClick={() => this.handleRowSelect(row.specialty.id)}
                                    >
                                        {row.specialty.value ? row.specialty.value : 'N/A'}
                                    </CustomTableCell>
                                    {edit && (
                                        <CustomTableCell align="center">
                                            <IconButton
                                                className={classes.button}
                                                aria-label="Delete"
                                                color="primary"
                                                onClick={() => this.handleDelete(row.specialty.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </CustomTableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <TablePagination
                    style={{ overflow: 'auto' }}
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={contractor.contractorSpecialties.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.currentPage}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />

                <CustomSnackbar
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={this.state.handleClose}
                />
                {this.state.isBusy && <CircularProgress className={classes.busy} />}

            </Box>
        );
    }
}

const mapStateToProps = state => ({
    specialties: state.cont_data.specialties,
});

const mapDispatchToProps = {
    getSpecialties,
    addSpecialty,
    deleteSpecialty,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ContractorSpecialties);