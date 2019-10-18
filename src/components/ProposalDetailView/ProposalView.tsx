import * as React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import { ProposalInfo } from 'types/proposal';
import CustomTableCell from 'components/shared/CustomTableCell';
import ReactMarkdown from 'react-markdown';


const useStyles = makeStyles(theme => ({
    root: {
        padding: 0,
        margin: theme.spacing(1)
    },
    title: {
        fontSize: '1.8em',
        fontWeight: 600,
        textAlign: 'left',
        color: '#111',
        marginTop: '0',
    },
    brief: {
        width: '100%',
        display: 'block'
    },
    desc: {
        color: '#222',
        marginTop: '0',
        '& > p': {
            margin: theme.spacing(1, 0),
        },
    },
    budget: {
        display: 'inline-block',
        fontSize: '1em',
        textAlign: 'left',
        fontWeight: 500,
        color: '#222',
        float: 'left'
    },
    subtitle: {
        display: 'inline-block',
        fontSize: '1.2em',
        textAlign: 'left',
        fontWeight: 700,
        color: '#111',
    },
    status: {
        display: 'inline-block',
        fontSize: '1em',
        textAlign: 'left',
        float: 'right',
        fontWeight: 500,
        color: theme.palette.primary.dark,
    }
}));

interface IProposalViewProps {
    proposal: ProposalInfo;
    selectTemplate: (idx: number) => void;
}

const ProposalView: React.SFC<IProposalViewProps> = (props) => {

    const classes = useStyles({});
    const { proposal } = props;
    const desc = proposal.description.replace(/\n/g, '\n\n');
    const remoteRoot = process.env.REACT_APP_PROJECT_API + '/proposals/' + proposal.id + '/files/';
    const templates = proposal.project ? proposal.project.projectTemplates || [] : [];

    return (
        <Card className={classes.root}>
            <List aria-label="project-view" style={{ padding: 0 }}>
                <ListItem button={false}>
                    <Typography
                        variant='subtitle1'
                        className={classes.title}
                    >
                        Proposal
                    </Typography>
                </ListItem>
                <Divider />
                <ListItem button={false} style={{ paddingTop: 12, paddingBottom: 2 }}>
                    <Box className={classes.brief}>
                        <Typography className={classes.budget}>
                            Budget: {proposal.budget} $
                        </Typography>
                        <Typography className={classes.status}>
                            Status: {proposal.status.toUpperCase()}
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem button={false} style={{ paddingTop: 2, paddingBottom: 2 }}>
                    <Typography className={classes.budget}>
                        Duration: {proposal.duration} days
                    </Typography>
                </ListItem>
                <ListItem button={false} style={{ paddingTop: 4, paddingBottom: 2 }}>
                    <Typography className={classes.subtitle}>
                        Description:
                    </Typography>
                </ListItem>
                <ListItem button={false} style={{ paddingLeft: 32, paddingTop: 2, paddingBottom: 12 }}>
                    <ReactMarkdown source={desc} className={classes.desc} />
                </ListItem>
                {
                    proposal.proposalFiles && proposal.proposalFiles.length > 0 && (
                        <>
                            <Divider />
                            <ListItem button={false}>
                                <Box className={classes.brief}>
                                    <Typography style={{ fontWeight: 700 }}> Files </Typography>
                                    <ul>
                                        {proposal.proposalFiles.map(file => (
                                            <li key={file.id} style={{ listStyleType: 'disc', padding: '4px 0' }}>
                                                <a download={file.name} href={remoteRoot + file.name}>
                                                    {file.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
                            </ListItem>
                        </>
                    )
                }

                {
                    templates.length > 0 && (
                        <>
                            <Divider />
                            <ListItem button={false} style={{ paddingTop: 12, paddingBottom: 2 }}>
                                <Typography
                                    variant="subtitle1"
                                    noWrap
                                    style={{ fontWeight: 600, fontSize: '20px', margin: '8px 0' }}
                                >
                                    Templates
                                </Typography>
                            </ListItem>
                            <ListItem button={false} style={{ paddingTop: 2, paddingBottom: 12 }}>
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

                            </ListItem>
                        </>
                    )
                }
            </List>
        </Card>
    )
}

export default ProposalView;