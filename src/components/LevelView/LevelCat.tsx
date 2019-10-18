import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { ProjectLevelCategory } from 'types/project';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative'
    },
    container: {
        width: '100%'
    },
    title: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    subtitle: {
        fontWeight: 500,
        fontSize: '1.1em',
        paddingRight: theme.spacing(1.5),
        color: '#222'
    },
    value: {
        fontWeight: 500,
        fontSize: '1.0em',
        padding: theme.spacing(0, 1),
        color: '#222',
        flexGrow: 1,
        textAlign: 'right',
    },
    space: {
        flexGrow: 3
    },
    action: {
        display: 'flex',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
    },
    item: {
        padding: theme.spacing(1)
    }
}));

interface ILevelCatItemProps {
    handleDelete: (id: string) => void;
    handleEdit: (id: string) => void;
    item: ProjectLevelCategory;
    edit: boolean;
}

const LevelCatItem: React.SFC<ILevelCatItemProps> = (props) => {

    const { item, handleDelete, handleEdit } = props;
    const classes = useStyles({});

    const [enter, setEnter] = React.useState(false);

    return (
        <ListItem
            className={classes.root}
            onMouseEnter={e => setEnter(true)}
            onMouseLeave={() => setEnter(false)}
            alignItems='flex-start'
        >
            <Box className={classes.container}>
                <Box>
                    <Typography className={classes.title}>
                        {item.name}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                        <span className={classes.subtitle}>{item.type}</span>
                        <span className={classes.subtitle}>{`(number: ${item.number})`}</span>
                    </Typography>
                </Box>
                <Box style={{ display: 'flex' }}>
                    <Grid container direction='row-reverse'>
                        <Grid item xs={12} md={8} style={{ padding: '8px 16px' }}>
                            <Typography className={classes.subtitle}>Description:</Typography>
                            {
                                item.description && <Typography variant='body2'>{item.description}</Typography>
                            }
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: '8px 16px', display: 'flex' }}>
                            <Box>
                                <Typography style={{ display: 'flex' }}>
                                    {'Width:'}<span className={classes.value}>{item.w}</span>
                                </Typography>
                                <Typography style={{ display: 'flex' }}>
                                    {'Height:'}<span className={classes.value}>{item.h}</span>
                                </Typography>
                                <Typography style={{ display: 'flex' }}>
                                    {'Length:'}<span className={classes.value}>{item.l}</span>
                                </Typography>
                            </Box>
                            <Box style={{ flexGrow: 1 }}>
                                <Typography style={{ flexGrow: 1 }}>m</Typography>
                                <Typography style={{ flexGrow: 1 }}>m</Typography>
                                <Typography style={{ flexGrow: 1 }}>m</Typography>
                            </Box>

                        </Grid>
                    </Grid>
                </Box>
            </Box>
            {enter && props.edit && (
                <Box className={classes.action}>
                    <IconButton className={classes.item} aria-label="Edit" onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item.id);
                    }} >
                        <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton className={classes.item} aria-label="Delete" onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                    }} >
                        <DeleteIcon fontSize='small' />
                    </IconButton>
                </Box>
            )}
        </ListItem>
    );
};

export default LevelCatItem;
