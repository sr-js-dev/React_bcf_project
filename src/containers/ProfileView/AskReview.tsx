import * as React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Rating from '@material-ui/lab/Rating';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import ContApi from 'services/contractor';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme: Theme) => createStyles({
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

interface IAskReviewProps {
    show: boolean;
    hide: () => void;
    contId: string;
    company: string;
    askReview: (emails: string[]) => Promise<boolean>;
}

const AskReview: React.FunctionComponent<IAskReviewProps> = (props) => {

    const { contId, company, show, hide, askReview } = props;
    const avatar = ContApi.getAvatar(contId);

    const [mails, setMails] = React.useState<string[]>(['']);
    const [mailRate, setMailRate] = React.useState(5.0);
    const [msg, setMsg] = React.useState(`Thanks for being a valued customer. I just signed up on find more excellent customers like you, and reviews are a big part of my profile. Can you take a moment to write a couple of sentences about working with me? I'd love if my future customers could hear about your experience firsthand. \r\nThanks, ${company}`);

    const onSendRequest = async () => {
        const reals = mails.filter(mail => mail.length > 0);
        if (reals.length === 0) return;
        const res = await askReview(reals);
        if (res) setMails(['']);
    }

    const getLink = () => {
        console.log('Get shareable link: ');
    }

    const deleteMail = (index: number) => {
        setMails([
            ...mails.slice(0, index),
            ...mails.slice(index + 1)
        ]);
    }

    const changeMail = (index: number, value: string) => {
        mails[index] = value;
        setMails([...mails]);
    }

    const addMail = () => {
        setMails([
            ...mails,
            ''
        ])
    }

    const close = () => {
        setMails(['']);
        hide();
    }

    const classes = useStyles({});
    return (
        <Dialog open={show} onClose={close}>
            <DialogTitle id="review-dialog-title">
                <Typography className={classes.title}>
                    {'Get reviews from past customers'}
                </Typography>
                <Typography>
                    {'Ask past customers for reviews, or add online reviews you already have.'}
                    <br />
                    {'You can show up to 10 reviews from previous customers.'}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box>
                    <Typography className={classes.bold}>
                        Send past customers an email
                    </Typography>
                    {
                        <TextField
                            label="Email 1"
                            margin="dense"
                            fullWidth
                            value={mails[0]}
                            onChange={e => changeMail(0, e.target.value)}
                            required
                        />
                    }
                    {
                        mails.length > 0 && mails.slice(1).map((mail, idx) => (
                            <Box style={{ display: 'flex' }} key={idx}>
                                <TextField
                                    label={`Email ${idx + 2}`}
                                    margin="dense"
                                    fullWidth
                                    value={mails[idx + 1]}
                                    onChange={e => changeMail(idx + 1, e.target.value)}
                                    required
                                />
                                <IconButton onClick={() => deleteMail(idx + 1)} style={{ height: 37, margin: 10 }}>
                                    <DeleteIcon fontSize='small' color='error' />
                                </IconButton>
                            </Box>
                        ))
                    }
                    <Button onClick={addMail} className={classes.add}>
                        <AddIcon />&nbsp;&nbsp;
                <span>Add customer</span>
                    </Button>
                </Box>
                <Box id='email-preview' style={{ padding: '16px 0' }}>
                    <Typography className={classes.bold}>
                        Email preview
                    </Typography>
                    <Box style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Avatar
                            alt="Avatar"
                            src={avatar}
                            className={classes.avatar}
                            style={{ margin: '8px 0' }}
                        />
                        <Typography className={classes.bold} style={{ fontSize: '0.875rem' }}>
                            {company}
                        </Typography>
                        <Rating
                            precision={0.1}
                            value={mailRate}
                            size='medium'
                            onChange={(e, val) => setMailRate(val)}
                            style={{ margin: 8 }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                            style={{ textAlign: 'left' }}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions style={{ display: 'flex', padding: 24 }}>
                <Box style={{ flex: 1 }}>
                    <Button onClick={onSendRequest} autoFocus className={classes.button}>
                        Send Request
                    </Button>
                </Box>
                <Button onClick={getLink} color="primary">
                    Get shareable link
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AskReview;
