import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TableCell from '@material-ui/core/TableCell';
import { withStyles, Theme, createStyles, StyledComponentProps } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import MultiSelect, { SelectObject } from 'components/Select/MultiSelect';

import { Specialties } from 'types/global';
import Button from 'components/CustomButtons/Button';


const styles = (theme: Theme) => createStyles({
    container: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderRadius: '0',
    },
    subContents: {
        width: '100%',
        overflow: 'auto',
        margin: theme.spacing(1, 0)
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    select: {
        width: '100%'
    },
    chip: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    },
});

interface ProfileSpecViewProps extends StyledComponentProps {
    contractor: any;
    specialties: Specialties;
    handleDelete: (specId: string) => Promise<any>;
    handleSave: (specs: string[]) => Promise<void>;
}

interface ProfileSpecViewState {
    showConfirmDlg: boolean;
    confirmMessage: string;
    onYes: () => Promise<void>;
    idToDel: string;
    specs: string[];
    suggestions: SelectObject[];
}

const WhiteTableHead = withStyles({
    root: {
        backgroundColor: 'white'
    }
})(TableHead);
const TableHeadCell = withStyles({
    root: {
        fontSize: '0.875rem',
        color: 'rgba(0,0,0,0.87)',
        fontWeight: 500
    }
})(TableCell);

class ProfileSpecView extends React.Component<ProfileSpecViewProps, ProfileSpecViewState> {
    constructor(props: Readonly<ProfileSpecViewProps>) {
        super(props);

        this.state = {
            showConfirmDlg: false,
            confirmMessage: '',
            onYes: this.deleteSpecialty,
            idToDel: '',
            specs: props.contractor.contractorSpecialties.map(item => (item.specialty.name)),
            suggestions: props.specialties.content.map(spec => ({ id: spec.id, name: spec.name }))
        };
    }

    closeConfirmDialog = () => {
        this.setState({ showConfirmDlg: false });
    };

    handleDelete = id => {
        this.setState({
            showConfirmDlg: true,
            idToDel: id,
            onYes: this.deleteSpecialty,
            confirmMessage: 'Do you really want to delete specialty?'
        });
    };

    deleteSpecialty = async () => {
        const data = await this.props.handleDelete(this.state.idToDel);
        this.setState({ showConfirmDlg: false, specs: data.contractorSpecialties.map(item => item.specialty.name) });
    }

    selectChange = (val: Array<string>) => {
        this.setState({ specs: val });
    }

    deleteSelect = (name: string) => {
        const { specs } = this.state;

        let idx: number = specs.indexOf(name);
        if (idx >= 0) {
            specs.splice(idx, 1);
            this.setState({ specs: [...specs] });
        }
    }

    saveSpecialty = async () => {
        this.props.handleSave(this.state.specs);
        this.setState({ showConfirmDlg: false });
    }

    trySave = () => {
        this.setState({
            showConfirmDlg: true,
            onYes: this.saveSpecialty,
            confirmMessage: 'Do you really want to change your specialty?'
        });
    }

    render() {
        const { classes, contractor } = this.props;
        const { suggestions, specs, confirmMessage, showConfirmDlg } = this.state;

        return (
            <>
                <Card className={classes.container}>
                    <Table className={classes.relative}>
                        <WhiteTableHead>
                            <TableRow>
                                <TableHeadCell align="center">Name</TableHeadCell>
                                <TableHeadCell align="center">Value</TableHeadCell>
                                <TableHeadCell align="center">Description</TableHeadCell>
                                <TableHeadCell align="center">Action</TableHeadCell>
                            </TableRow>
                        </WhiteTableHead>
                        <TableBody>
                            {contractor.contractorSpecialties.map(row => (
                                <TableRow className={classes.row} key={row.id} hover>
                                    <TableCell component="th" scope="row" align="center">
                                        {row.specialty.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.specialty.value}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.specialty.description}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            className={classes.button}
                                            aria-label="Delete"
                                            color="primary"
                                            onClick={() => this.handleDelete(row.specialty.id)}
                                        >
                                            <DeleteIcon fontSize='small' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <List>
                        <ListItem>
                            <Typography className={classes.title}>
                                Select your specialties
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Box style={{ display: 'flex', width: '100%' }}>
                                <Box style={{ flex: 1, marginRight: 16 }}>
                                    <MultiSelect
                                        className={classes.select}
                                        placeholder="Select multiple specialties"
                                        suggestions={suggestions}
                                        values={specs}
                                        selectChange={this.selectChange}
                                    />
                                </Box>
                                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.saveSpecialty}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box style={{ display: 'flex' }}>
                                {specs.map((spec, index) => (
                                    <Chip
                                        key={index}
                                        label={spec}
                                        className={classes.chip}
                                        onDelete={() => this.deleteSelect(spec)}
                                    />
                                ))}
                            </Box>
                        </ListItem>
                    </List>
                </Card>
                <Dialog
                    open={showConfirmDlg}
                    onClose={this.closeConfirmDialog}
                    aria-labelledby="alert-dialog-title"
                >
                    <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                    <DialogContent className={classes.relative}>
                        <DialogContentText id="alert-dialog-description">
                            {confirmMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeConfirmDialog} autoFocus>
                            Cancel
            			</Button>
                        <Button onClick={this.state.onYes} color="primary">
                            Yes
            			</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(ProfileSpecView);
