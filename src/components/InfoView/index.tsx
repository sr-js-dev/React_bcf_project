import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
    iconBox: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1)
    },
    contentBox: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    label: {
        fontWeight: 600,
        color: 'rgba(0,0,0,0.9)'
    },
    content: {
        color: 'rgba(0,0,0,0.7)'
    }
}));

interface InfoViewProps {
    label: string;
    content: string;
    icon: React.ReactNode;
}

const InfoView: React.FC<InfoViewProps> = (props) => {

    const { icon, label, content } = props;
    const classes = useStyles({});

    return (
        <React.Fragment>
            <Box className={classes.iconBox}>
                {icon}
            </Box>
            <Box className={classes.contentBox}>
                <Typography className={classes.label}>
                    {label}
                </Typography>
                <Typography className={classes.content}>
                    {content}
                </Typography>
            </Box>
        </React.Fragment>
    )
}

export default InfoView;