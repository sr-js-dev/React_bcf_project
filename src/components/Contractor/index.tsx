import React from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import { ContractorInfo } from 'types/contractor';

const useStyles = makeStyles(theme => ({
    root: {
        height: 'calc(100% - 16px)',
        border: '1px solid #EEE',
        margin: theme.spacing(1)
    },
    title: {
        fontSize: '18px',
        fontWeight: 600,
        textAlign: 'left',
        marginTop: 0,
        marginBottom: 0,
        lineHeight: 2,
        color: '#111'
    },
    bottomLine: {
        borderBottom: '1px solid #dedede',
    },
    desc: {
        color: '#222',
        marginTop: 0,
        textDecoration: 'none',
    },
    info: {
        display: 'inline-block',
        fontWeight: 500,
        color: '#222',
        fontSize: '16px'
    },
    status: {
        display: 'inline-block',
        fontWeight: 500,
        color: theme.palette.primary.dark,
        fontSize: '16px'
    }
}));


interface IContractorViewProps {
    contractor: ContractorInfo;
    onClick: () => void;
}

const TITLE = 'Contractor Information';
const ContractorView: React.SFC<IContractorViewProps> = (props) => {

    const classes = useStyles({});
    const { contractor, onClick } = props;

    let address = 'N/A';
    if (contractor.address) {
        if (contractor.address.street) {
            address = contractor.address.street;
        }
        if (contractor.address.city) {
            if (contractor.address.street) {
                address += ', ';
            }

            address += contractor.address.city;
        }
    }

    return (
        <Card
            className={classes.root}
            style={{ cursor: 'pointer' }}
            onClick={onClick}
        >
            <List>
                <ListItem button={false}>
                    <Typography variant="subtitle1" className={classes.title}>
                        {TITLE}
                    </Typography>
                </ListItem>
                <Divider />
                <ListItem button={false} style={{ paddingTop: 12, paddingBottom: 2 }}>
                    <Typography className={classes.info}>
                        Name: {contractor.address ? contractor.address.name || 'N/A' : 'N/A'}
                    </Typography>
                </ListItem>
                <ListItem button={false} style={{ paddingTop: 2, paddingBottom: 2 }}>
                    <Typography className={classes.info}>Email: {contractor.email}</Typography>
                </ListItem>
                <ListItem button={false} style={{ paddingTop: 2, paddingBottom: 2 }}>
                    <Typography className={classes.info}>
                        Address: {address}
                    </Typography>
                </ListItem>
                <ListItem button={false} style={{ paddingTop: 2, paddingBottom: 12 }}>
                    <Typography className={classes.status}>Status: {contractor.status}</Typography>
                </ListItem>
            </List>
        </Card>

    )
}

export default ContractorView;