import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import removeMd from 'remove-markdown';

import { HistoryInfo } from 'types/global';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative'
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
        display: 'inline',
        color: '#222'
    },
    action: {
        display: 'flex',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(1)
    },
    item: {
        padding: theme.spacing(1)
    }
}));

interface IHistoryItemProps {
    handleDetail: (info: HistoryInfo) => void;
    handleDelete: (id: string) => void;
    handleEdit: (id: string) => void;
    item: HistoryInfo;
}

const HistoryItem: React.SFC<IHistoryItemProps> = (props) => {

    const { item, handleDelete, handleDetail, handleEdit } = props;
    const classes = useStyles({});

    const [enter, setEnter] = React.useState(false);

    return (
        <ListItem
            className={classes.root}
            onMouseEnter={e => setEnter(true)}
            onMouseLeave={() => setEnter(false)}
            alignItems='flex-start'
            button
            onClick={() => handleDetail(item)}
        >
            <ListItemText
                primary={
                    <Typography className={classes.title}>
                        {item.title}
                    </Typography>
                }
                secondary={
                    <React.Fragment>
                        <Typography
                            component='span'
                            variant='body2'
                            className={classes.subtitle}
                        >
                            {item.from} - {item.to}
                        </Typography>
                        {removeMd(item.description)}
                    </React.Fragment>
                }
            />
            {enter && (
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

export default HistoryItem;
