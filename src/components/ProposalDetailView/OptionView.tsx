import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Table, TableBody, TableHead, TableRow, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons';
import CustomTableCell from '../shared/CustomTableCell';
import OptionEdit from './OptionEdit';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    subtitle: {
        padding: theme.spacing(1),
        fontSize: theme.typography.pxToRem(24),
        fontWeight: 'bold',
    },
    actions: {
        flexWrap: 'wrap',
        alignContent: 'space-around',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        flexBasis: 200,
    },
}));

const OptionView = ({ edit, option, handleEdit, handleDelete }) => {
    const classes = useStyles({});
    return (
        <TableRow>
            <CustomTableCell className={classes.actions} component="th" scope="row">
                <Typography variant="subtitle1">{option.name}</Typography>
            </CustomTableCell>
            <CustomTableCell className={classes.actions}>
                <Typography variant="subtitle1">{option.value}</Typography>
            </CustomTableCell>
            <CustomTableCell className={classes.actions}>
                <Typography variant="subtitle1">{option.description}</Typography>
            </CustomTableCell>
            <CustomTableCell className={classes.actions}>
                <Typography variant="subtitle1">{option.budget}</Typography>
            </CustomTableCell>
            <CustomTableCell className={classes.actions}>
                <Typography variant="subtitle1">{option.duration}</Typography>
            </CustomTableCell>
            {edit && (
                <CustomTableCell className={classes.actions}>
                    <IconButton style={{ padding: '0' }} onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton style={{ padding: '0' }} onClick={handleEdit}>
                        <EditIcon />
                    </IconButton>
                </CustomTableCell>
            )}
        </TableRow>
    );
};

const OptionTableView = ({
    options,
    editingId,
    handleAdd,
    handleDelete,
    handleEdit,
    handleSave,
    handleCancel,
    edit,
}) => {
    const classes = useStyles({});
    const colcnt = edit ? 6 : 5;
    return (
        <>
            <Typography className={classes.subtitle}>Options</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <CustomTableCell align="left">Name</CustomTableCell>
                        <CustomTableCell align="left">Value</CustomTableCell>
                        <CustomTableCell align="left">Description</CustomTableCell>
                        <CustomTableCell align="left">Badget</CustomTableCell>
                        <CustomTableCell align="left">Duration</CustomTableCell>
                        {edit && (
                            <CustomTableCell align="left">
                                <IconButton
                                    style={{ color: '#FFFFFF' }}
                                    onClick={handleAdd}
                                    size="small"
                                >
                                    <NoteAddIcon />
                                </IconButton>
                            </CustomTableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {options.map((opt, index) =>
                        editingId !== opt.id ? (
                            <OptionView
                                edit={edit}
                                key={index}
                                option={opt}
                                handleDelete={() => handleDelete(opt.id)}
                                handleEdit={() => handleEdit(opt.id)}
                            />
                        ) : (
                                <TableRow key={index}>
                                    <CustomTableCell colSpan={colcnt}>
                                        <OptionEdit
                                            option={opt}
                                            handleSave={handleSave}
                                            handleCancel={handleCancel}
                                        />
                                    </CustomTableCell>
                                </TableRow>
                            )
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default OptionTableView;
