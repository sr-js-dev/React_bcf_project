import * as React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';

import RateIcon from '@material-ui/icons/RateReview';
import { ProfileReview } from 'types/global';

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderRadius: 0
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    flex: {
        display: 'flex'
    },
    button: {
        width: 160,
        border: '1px solid #4a148c',
        color: 'white',
        margin: 'auto',
        textDecoration: 'underline',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: '#FFFFFF',
        },
    },
    link: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'blue',
        cursor: 'pointer'
    },
    add: {
        color: theme.palette.primary.dark
    },
    bold: {
        fontWeight: 600
    },
    avatar: {
        margin: 'auto',
        width: 48,
        height: 48,
    },
}));

interface IProfileReviewCardProps {
    askReview: () => void;
    review: ProfileReview;
}

const ProfileReviewCard: React.FunctionComponent<IProfileReviewCardProps> = (props) => {

    const classes = useStyles({});
    const { askReview, review } = props;

    const rateCount = review.reviews;
    const labels = [5, 4, 3, 2, 1];
    const rates = [
        review.fiveStarRating,
        review.fourStarRating,
        review.threeStarRating,
        review.twoStarRating,
        review.oneStarRating
    ];
    let ratePros = [0, 0, 0, 0, 0];
    let rating = 0;
    if (rateCount > 0) {
        ratePros = rates.map(rate => rate * 100 / rateCount);
        rating = (rates.reduce((pre, cur, idx) => pre + cur * (5 - idx), 0)) / rateCount;
    }

    return (
        <Card className={classes.container}>
            <List>
                <ListItem>
                    <Box style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <Typography className={classes.title} style={{ flex: 1 }}>
                            Reviews
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem>
                    <Box className={classes.flex}>
                        <Box style={{ display: 'flex', flexDirection: 'column', marginRight: 32 }}>
                            <Typography style={{ fontSize: '1.125rem', fontWeight: 600, padding: '8px 4px' }}>
                                {rating.toFixed(1)}
                            </Typography>
                            <Rating precision={0.1} value={rating} readOnly style={{ padding: '0 0 8px' }} />
                            <Typography>
                                {`${rateCount} reviews`}
                            </Typography>
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                            {!!labels && labels.map((label, index) => (
                                <Box style={{ display: 'flex' }} key={index}>
                                    <Typography component='span' style={{ marginRight: 8 }}>
                                        {label}
                                    </Typography>
                                    <Rating precision={0.1} value={rates[index]} readOnly size='small' />
                                    <Typography component='span' style={{ marginLeft: 8 }}>
                                        {`${ratePros[index].toFixed(0)} %`}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </ListItem>
                <Divider />
                <ListItem>
                    <Box className={classes.flex}>
                        <RateIcon style={{ padding: '16px 0', fontSize: 64 }} />
                        <Box id='review-description' style={{ flex: 1, padding: 8 }}>
                            <Typography style={{ fontWeight: 600 }}>
                                {"Get reviews from past customers, even if they're not on Thumbtack."}
                            </Typography>
                            <Typography style={{ fontSize: '0.875rem' }}>
                                {"Tell us which customers to ask for a review, and we'll send the request for you."}
                            </Typography>
                        </Box>
                        <Box id='review-button'>
                            <Button
                                className={classes.button}
                                style={{ marginTop: 8 }}
                                onClick={askReview}
                            >
                                Ask for Reviews
                                </Button>
                        </Box>
                    </Box>
                </ListItem>
            </List>
        </Card>
    );
};

export default ProfileReviewCard;
