import * as React from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SimpleMDE from 'react-simplemde-editor';
import { TemplateInfo } from 'types/global';
import CustomTableCell from 'components/shared/CustomTableCell';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        overflow: 'auto',
        border: '1px solid #EEE',
        margin: theme.spacing(1, 1, 1, 1),
        padding: theme.spacing(1)
    },
    title: {
        marginTop: theme.spacing(1),
        fontWeight: 600,
        fontSize: '20px',
    },
    container: {
        display: 'flex',
        justifyContent: 'left',
        margin: theme.spacing(1, 0)
    },
    textField: {
        width: '120px',
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            width: '150px',
        },
        [theme.breakpoints.up('md')]: {
            width: '200px',
        }
    }
}));


export interface IProposalEditViewProps {
    budget: number;
    duration: number;
    description: string;
    templates: TemplateInfo[];
    selectTemplate: (idx: number) => void;
    budgetChange: (val: number) => void;
    durationChange: (val: number) => void;
    descriptionChange: (val: string) => void;
}

const ProposalEditView: React.SFC<IProposalEditViewProps> = (props) => {

    const classes = useStyles({});
    const {
        budget,
        duration,
        description,
        templates,
        budgetChange,
        durationChange,
        descriptionChange
    } = props;

    return (
        <Card className={classes.root}>
            <Typography variant="subtitle1" noWrap className={classes.title}>
                My Proposal
            </Typography>
            <Box id="brief-desc" className={classes.container}>
                <TextField
                    label="Budget *"
                    id="budget"
                    type="number"
                    value={budget}
                    className={classes.textField}
                    onChange={e => budgetChange(parseInt(e.target.value))}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">USD</InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Duration *"
                    type="number"
                    value={duration}
                    onChange={e => durationChange(parseInt(e.target.value))}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">days</InputAdornment>
                        ),
                    }}
                />
            </Box>
            <SimpleMDE
                value={description}
                onChange={val => descriptionChange(val)}
                options={{ placeholder: 'Description here' }}
            />

            {
                templates.length > 0 && (
                    <>
                        <Typography
                            variant="subtitle1"
                            noWrap
                            style={{ fontWeight: 600, fontSize: '20px', margin: '8px 0' }}
                        >
                            Templates
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>Name</CustomTableCell>
                                    <CustomTableCell align="center">Discription</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {templates.map((templ, index) => (
                                    <TableRow
                                        key={index}
                                        hover
                                        onClick={() => props.selectTemplate(index)}
                                    >
                                        <CustomTableCell component="th" scope="row">
                                            {templ.template.name}
                                        </CustomTableCell>
                                        <CustomTableCell align="center">
                                            {templ.template.description}
                                        </CustomTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </>
                )
            }
        </Card>
    );
}

export default ProposalEditView;