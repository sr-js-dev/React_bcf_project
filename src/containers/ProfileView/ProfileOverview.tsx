import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import NameIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import WebIcon from '@material-ui/icons/Web';
import AddressIcon from '@material-ui/icons/MyLocation';
import EventIcon from '@material-ui/icons/Event';
import GroupIcon from '@material-ui/icons/Group';

import InfoView from 'components/InfoView';
import { Profile } from './types';
import { ProfileReview } from 'types/global';

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderRadius: '0',
    },
    marginRight: {
        marginRight: theme.spacing(1)
    },
    row: {
        display: 'flex',
        fontSize: '0.875rem',
        width: '100%'
    },
    avatar: {
        width: 60,
        height: 60,
        [theme.breakpoints.up('sm')]: {
            width: 80,
            height: 80,
        }
    },
    company: {
        marginLeft: theme.spacing(2),
        paddingTop: theme.spacing(0.5),
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    companyName: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    rating: {
        marginTop: theme.spacing(0.5),
        display: 'flex'
    },
    link: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'blue',
        cursor: 'pointer'
    },
    divider: {
        marginLeft: 16,
        width: 'calc(100% - 32px)'
    },
    status: {
        position: 'absolute',
        left: '20px',
        top: '10px',
        color: 'blue',
        fontSize: '12px',
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
}));

interface ProfileOverviewProps {
    profile: Profile;
    review: ProfileReview;
    gotoEditView: () => void;
    gotoReview: () => void;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = props => {


    const classes = useStyles({});
    const { profile, review, gotoEditView, gotoReview } = props;

    const handleEdit = () => {
        gotoEditView();
    }

    const rates = [
        review.fiveStarRating,
        review.fourStarRating,
        review.threeStarRating,
        review.twoStarRating,
        review.oneStarRating
    ];
    let rating = 0;
    if (review.reviews > 0) {
        rating = (rates.reduce((pre, cur, idx) => pre + cur * (5 - idx), 0)) / review.reviews;
    }
    return (
        <Card className={classes.container}>
            <List>
                <ListItem style={{ width: '100%' }}>
                    <Box className={classes.row}>
                        <Avatar
                            alt="Avatar"
                            src={profile.picture}
                            className={classes.avatar}
                        />
                        <Box className={classes.company}>
                            <Typography className={classes.companyName}>
                                {profile.address.company}
                            </Typography>
                            <Box className={classes.rating}>
                                <Rating precision={0.1} value={rating} readOnly size='small' style={{ marginRight: 16 }} />
                                <Link onClick={gotoReview} className={classes.link}>
                                    Ask Review
    					        </Link>
                            </Box>
                        </Box>
                        <Box>
                            <Link onClick={handleEdit} className={classes.link}>
                                Edit
					        </Link>
                        </Box>
                    </Box>
                </ListItem>
                <Divider className={classes.divider} />
                <ListItem style={{ width: '100%' }}>
                    <Box className={classes.row}>
                        <InfoView
                            label={'Name'}
                            content={`${profile.firstname} ${profile.lastname}`}
                            icon={<NameIcon />}
                        />
                    </Box>
                </ListItem>
                <Divider className={classes.divider} />
                <ListItem style={{ width: '100%' }}>
                    <Box className={classes.row}>
                        <InfoView
                            label={'Email'}
                            content={`${profile.email}`}
                            icon={<EmailIcon />}
                        />
                    </Box>
                </ListItem>
                <Divider className={classes.divider} />
                <ListItem style={{ width: '100%' }}>
                    <Box className={classes.row}>
                        <InfoView
                            label={'Phone'}
                            content={`${profile.address.phone}`}
                            icon={<PhoneIcon />}
                        />
                    </Box>
                </ListItem>
                <Divider className={classes.divider} />
                <ListItem style={{ width: '100%' }}>
                    <Box className={classes.row}>
                        <InfoView
                            label={'Website'}
                            content={profile.address.website}
                            icon={<WebIcon />}
                        />
                    </Box>
                </ListItem>
                <Divider className={classes.divider} />
                <ListItem style={{ width: '100%' }}>
                    <Box className={classes.row}>
                        <InfoView
                            label={'Address'}
                            content={`${profile.address.street} ${profile.address.city}`}
                            icon={<AddressIcon />}
                        />
                    </Box>
                </ListItem>
                <Divider className={classes.divider} />
                <ListItem style={{ width: '100%' }}>
                    <Box className={classes.row}>
                        <InfoView
                            label={'Year founded'}
                            content={profile.address.founded && profile.address.founded}
                            icon={<EventIcon />}
                        />
                    </Box>
                </ListItem>
                <Divider className={classes.divider} />
                <ListItem style={{ width: '100%' }}>
                    <Box className={classes.row}>
                        <InfoView
                            label={'Number of employees'}
                            content={profile.address.employees && profile.address.employees}
                            icon={<GroupIcon />}
                        />
                    </Box>
                </ListItem>
                <Divider className={classes.divider} />
            </List>

        </Card>
    );
}

export default ProfileOverview;
