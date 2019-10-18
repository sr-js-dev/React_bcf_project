import React from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { getAllProjects } from 'store/actions/gen-actions';
import CustomTableCell from 'components/shared/CustomTableCell';
import removeMd from 'remove-markdown';
import Ellipsis from 'components/Typography/Ellipsis';
import { Projects } from 'types/project';

const styles = theme => createStyles({
    root: {
        flexGrow: 1,
        height: 'calc(100vh - 64px - 55px - 16px)',
        overflow: 'auto'
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
});


export interface ICurrentProjectViewProps extends RouteComponentProps {
    getAllProjects: (page: number, size: number) => Promise<void>;
    projects: Projects;
    classes: ClassNameMap<string>;
}

export interface ICurrentProjectViewState {
    rowsPerPage: number;
    currentPage: number;
}

class CurrentProjectView extends React.Component<ICurrentProjectViewProps, ICurrentProjectViewState> {
    constructor(props: ICurrentProjectViewProps) {
        super(props);

        this.state = {
            rowsPerPage: 20,
            currentPage: 0,
        }
    }

    async componentDidMount() {
        await this.props.getAllProjects(0, 0);
    }

    handleChangePage = async (event, page) => {
        this.setState({ currentPage: page });

        await this.props.getAllProjects(page, this.state.rowsPerPage);
    }

    handleChangeRowsPerPage = event => {
        const { projects } = this.props;

        const rowsPerPage = event.target.value;
        const currentPage = (rowsPerPage >= projects.totalElements)
            ? 0 : this.state.currentPage;

        this.setState({
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
        });

        this.props.getAllProjects(currentPage, rowsPerPage);
    };


    public render() {

        const { classes, projects } = this.props;

        if (!projects) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        return (
            <Paper square className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell> Project Title </CustomTableCell>
                            <CustomTableCell align="center">Budget</CustomTableCell>
                            <CustomTableCell align="center">Due Date</CustomTableCell>
                            <CustomTableCell align="center">Discription</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.content.map(row => (
                            <TableRow
                                className={classes.row}
                                key={row.id}
                                hover
                                onClick={() => {
                                    this.props.history.push('/projects/project_detail/' + row.id);
                                }}
                            >
                                <CustomTableCell component="th" scope="row">
                                    <Ellipsis>{row.title}</Ellipsis>
                                </CustomTableCell>
                                <CustomTableCell align="center">{row.budget}</CustomTableCell>
                                <CustomTableCell align="center">{row.due && row.due.slice(0, 10)}</CustomTableCell>
                                <CustomTableCell align="center">
                                    <Ellipsis>{removeMd(row.description)}</Ellipsis>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    style={{ overflow: 'auto' }}
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={projects.totalElements}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.currentPage}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

const mapDispatchToProps = {
    getAllProjects,
};

const mapStateToProps = state => ({
    projects: state.gen_data.allprojects,
});

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(CurrentProjectView)
