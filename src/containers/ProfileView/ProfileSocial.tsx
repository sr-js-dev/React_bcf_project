import React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import { SocialIcon } from 'react-social-icons';


const styles = (theme: Theme) => createStyles({
    container: {
        width: '100%',
        borderRadius: '0',
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2)
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    button: {
        margin: '4px'
    },
    link: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'blue',
        cursor: 'pointer'
    },
    error: {
        color: 'red',
        fontSize: '0.75rem',
        margin: theme.spacing(-1.5, 1, 0)
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    }
});

export interface IProfileSocialProps extends StyledComponentProps {
    links: any[];
    handleSubmit: (facebook: string, instagram: string, twitter: string) => Promise<void>;
}

interface IProfileSocialState {
    edit: boolean;
    facebook: string;
    fbError?: string;
    instagram: string;
    insError?: string;
    twitter: string;
    twError?: string;
}

class ProfileSocial extends React.Component<IProfileSocialProps, IProfileSocialState> {

    constructor(props: Readonly<IProfileSocialProps>) {
        super(props);

        this.state = {
            edit: false,
            facebook: '',
            fbError: undefined,
            instagram: '',
            insError: undefined,
            twitter: '',
            twError: undefined
        }
    }

    startEdit = () => {
        const { links } = this.props;
        const facebooks = links.filter(link => link.type === 'FACEBOOK');
        const instagrams = links.filter(link => link.type === 'INSTAGRAM');
        const twitters = links.filter(link => link.type === 'TWITTER');
        const fb = facebooks.length > 0 ? decodeURIComponent(facebooks[0].name) : '';
        const ins = instagrams.length > 0 ? decodeURIComponent(instagrams[0].name) : '';
        const tw = twitters.length > 0 ? decodeURIComponent(twitters[0].name) : '';

        this.setState({
            edit: true,
            facebook: fb,
            instagram: ins,
            twitter: tw,
            fbError: undefined,
            insError: undefined,
            twError: undefined
        });
    }

    endEdit = () => {
        this.setState({ edit: false });
    }

    handleSubmit = () => {
        const { facebook, instagram, twitter } = this.state;
        let fbError = undefined;
        let insError = undefined;
        let twError = undefined;
        if (!!facebook && !facebook.includes('facebook.com/')) fbError = 'Invalid URL';
        if (!!instagram && !instagram.includes('instagram.com/')) insError = 'Invalid URL';
        if (!!twitter && !twitter.includes('twitter.com/')) twError = 'Invalid URL';
        if (fbError || insError || twError) {
            this.setState({ fbError, insError, twError });
            return;
        }

        this.props.handleSubmit(facebook, instagram, twitter);
        this.setState({ edit: false });
    }

    goLink = (url: string) => {
        if (url.length > 0) {
            window.open(url, '_blank');
        }
    }

    public render() {
        const { classes, links } = this.props;
        const { facebook, instagram, twitter, edit, twError, insError, fbError } = this.state;
        const facebooks = links.filter(link => link.type === 'FACEBOOK');
        const instagrams = links.filter(link => link.type === 'INSTAGRAM');
        const twitters = links.filter(link => link.type === 'TWITTER');
        const fb = facebooks.length > 0 ? decodeURIComponent(facebooks[0].name) : '';
        const ins = instagrams.length > 0 ? decodeURIComponent(instagrams[0].name) : '';
        const tw = twitters.length > 0 ? decodeURIComponent(twitters[0].name) : '';

        return (
            <Card className={classes.container}>
                {!edit && (
                    <List>
                        <ListItem>
                            <Box style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                <Typography className={classes.title} style={{ flex: 1 }}>
                                    Social Media
                                </Typography>
                                <Link onClick={this.startEdit} className={classes.link}>
                                    Edit
                                </Link>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <Button color='primary' onClick={() => this.goLink(fb)} disabled={fb.length === 0}>
                                    <SocialIcon style={{ width: 20, height: 20 }} network='facebook' />
                                    &nbsp;&nbsp;&nbsp;Facebook
                                </Button>
                                <Button color='primary' onClick={() => this.goLink(ins)} disabled={ins.length === 0}>
                                    <SocialIcon style={{ width: 20, height: 20 }} network='instagram' />
                                    &nbsp;&nbsp;&nbsp;Instagram
                                </Button>
                                <Button color='primary' onClick={() => this.goLink(tw)} disabled={tw.length === 0} >
                                    <SocialIcon style={{ width: 20, height: 20 }} network='twitter' />
                                    &nbsp;&nbsp;&nbsp;Twitter
                                </Button>
                            </Box>
                        </ListItem>
                    </List >
                )
                }
                {
                    edit && (
                        <List>
                            <ListItem>
                                <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Typography className={classes.title} style={{ flex: 1 }}>
                                        {'Social Media'}
                                    </Typography>
                                    <Link onClick={this.handleSubmit} className={classes.link}>
                                        Save
						            </Link>
                                    <Link
                                        onClick={this.endEdit}
                                        className={classes.link}
                                        style={{ paddingLeft: 12, color: 'red' }}
                                    >
                                        Cancel
						            </Link>
                                </Box>
                            </ListItem>
                            <ListItem>
                                <Box style={{ width: '100%' }}>
                                    <InputLabel style={{ display: 'block' }}>
                                        <SocialIcon style={{ width: 20, height: 20, marginBottom: 4, fontSize: '0.875rem' }} network='facebook' />
                                        &nbsp;&nbsp;&nbsp;Facebook
                                    </InputLabel>
                                    <Input
                                        placeholder={`Enter Facebook URL`}
                                        margin="dense"
                                        fullWidth
                                        value={facebook}
                                        style={{ marginBottom: 16 }}
                                        onChange={e => this.setState({ facebook: e.target.value, fbError: undefined })}
                                    />
                                    {!!fbError && (
                                        <InputLabel className={classes.error}>
                                            {fbError}
                                        </InputLabel>
                                    )}
                                </Box>
                            </ListItem>
                            <ListItem>
                                <Box style={{ width: '100%' }}>
                                    <InputLabel style={{ display: 'block' }}>
                                        <SocialIcon style={{ width: 20, height: 20, marginBottom: 4, fontSize: '0.875rem' }} network='instagram' />
                                        &nbsp;&nbsp;&nbsp;Instagram
                                    </InputLabel>
                                    <Input
                                        placeholder={`Enter Instagram URL`}
                                        margin="dense"
                                        fullWidth
                                        value={instagram}
                                        style={{ marginBottom: 16 }}
                                        onChange={e => this.setState({ instagram: e.target.value, insError: undefined })}
                                    />
                                    {!!insError && (
                                        <InputLabel className={classes.error}>
                                            {insError}
                                        </InputLabel>
                                    )}
                                </Box>
                            </ListItem>
                            <ListItem>
                                <Box style={{ width: '100%' }}>
                                    <InputLabel style={{ display: 'block' }}>
                                        <SocialIcon style={{ width: 20, height: 20, marginBottom: 4, fontSize: '0.875rem' }} network='twitter' />
                                        &nbsp;&nbsp;&nbsp;Twitter
                                    </InputLabel>
                                    <Input
                                        placeholder={`Enter Twitter URL`}
                                        margin="dense"
                                        fullWidth
                                        value={twitter}
                                        style={{ marginBottom: 16 }}
                                        onChange={e => this.setState({ twitter: e.target.value, twError: undefined })}
                                    />
                                    {!!twError && (
                                        <InputLabel className={classes.error}>
                                            {twError}
                                        </InputLabel>
                                    )}
                                </Box>
                            </ListItem>
                        </List>
                    )
                }
            </Card >
        );
    }
}

export default withStyles(styles)(ProfileSocial);