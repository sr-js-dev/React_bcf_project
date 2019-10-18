import React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import queryString from 'query-string';
import Youtube from 'react-youtube';
import UploadButton from 'components/CustomUpload/UploadButton';
import { FileInfo } from 'types/global';


const styles = (theme: Theme) => createStyles({
    contents: {
        width: '100%',
        borderRadius: '0',
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2)
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    borderedBox: {
        border: '1px dashed rgba(0, 0, 0, 0.5)',
        padding: theme.spacing(1),
        display: 'flex'
    },
    addBox: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        cursor: 'pointer',
        border: 'dashed 1px rgba(0, 0, 0, 0.5)'
    },
    addBtn: {
        color: theme.palette.primary.dark
    },
    imageBox: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        minHeight: 48
    },
    imageItem: {
        width: 128,
        height: 128,
        border: 'solid 1px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        marginBottom: theme.spacing(1),
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: '4px'
    },
    submit: {
        border: '1px solid #4a148c',
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: '#FFFFFF',
        },
    },
    bold: {
        fontWeight: 600
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    }
});

export interface IProfilePhotosProps extends StyledComponentProps {
    contId: string;
    photos: FileInfo[];
    videos: FileInfo[];
    uploadPhoto: (file: File) => Promise<void>;
    uploadVideo: (file: string) => Promise<void>;
    updateTitle: (id: string, title: string) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

interface IProfilePhotosState {
    title: string;
    editing: string;
    hover: string;
    videoURL: string;
}

class ProfilePhotos extends React.Component<IProfilePhotosProps, IProfilePhotosState> {

    constructor(props: Readonly<IProfilePhotosProps>) {
        super(props);

        this.state = {
            title: '',
            editing: '',
            hover: '',
            videoURL: ''
        }
    }

    handleBlur = async (id: string) => {
        await this.props.updateTitle(id, this.state.title);
        this.setState({ editing: '' });
    }

    handleDelete = (id: string) => {
        this.props.delete(id);
    }

    handleUpdate = (files: File[]) => {
        if (files.length !== 1) return;
        this.props.uploadPhoto(files[0]);
    }

    addVideo = (link: string) => {
        if (link.length > 0) {
            this.props.uploadVideo(link);
        }
    }

    public render() {
        const { classes, photos, videos, contId } = this.props;
        const { title, editing, hover, videoURL } = this.state;

        const vids = videos.filter(link => link.name.startsWith('https') && link.name.includes('youtube'));

        return (
            <>
                <Card className={classes.contents}>
                    <List>
                        <ListItem>
                            <Typography className={classes.title}>
                                Photos and Videos
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Box style={{ display: 'flex', width: '100%' }}>
                                <Box style={{ flex: 1, marginRight: 8 }}>
                                    <Typography style={{ fontWeight: 600 }}>
                                        Upload Photos
                                    </Typography>
                                    <Typography style={{ fontSize: '0.875rem' }}>
                                        Add photos of your work(before and after), team, workspace, or equipment
                                    </Typography>
                                </Box>
                                <Box style={{ display: 'flex', alignItems: 'center' }}>
                                    <UploadButton
                                        filter='image/*'
                                        btnId={'photos-upload-image'}
                                        multiple={false}
                                        className={classes.submit}
                                        handleChange={this.handleUpdate}
                                    >
                                        Upload
                                    </UploadButton>
                                </Box>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box style={{ width: '100%' }}>
                                <Typography style={{ fontWeight: 600 }}>
                                    Embed videos from YouTube or Vimeo
                                    </Typography>
                                <Typography style={{ fontSize: '0.875rem' }}>
                                    Upload your video to one of those sites and paste the link here
                                    </Typography>
                                <Box style={{ display: 'flex', width: '100%' }}>
                                    <Input
                                        style={{ flex: 1, marginTop: 4, marginRight: 8 }}
                                        placeholder={'Enter URL or embed code'}
                                        value={videoURL}
                                        onChange={e => this.setState({ videoURL: e.target.value })}
                                    />
                                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button className={classes.submit} onClick={() => this.addVideo(videoURL)}>
                                            Add
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
                                {photos.map((photo, index) => (
                                    <Card
                                        key={index}
                                        onMouseEnter={() => this.setState({ hover: photo.id })}
                                        onMouseLeave={() => this.setState({ hover: '' })}
                                        style={{ width: 256, height: 256, boxShadow: 'none', display: 'flex' }}
                                    >
                                        <CardContent
                                            style={{ padding: 0, fontSize: '0.875rem', display: 'flex', flex: 1, flexDirection: 'column', marginBottom: 16 }}
                                        >
                                            <Box style={{ flex: 1, position: 'relative' }}>
                                                <img
                                                    alt={photo.name}
                                                    style={{ width: 256, height: 208 }}
                                                    src={`${process.env.REACT_APP_PROJECT_API}/contractors/${contId}/files/${photo.name}`}
                                                />
                                                {(hover === photo.id) && (
                                                    <IconButton
                                                        style={{ position: 'absolute', right: 0, top: 0 }}
                                                        color="primary"
                                                        onClick={() => this.handleDelete(photo.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            <Input
                                                placeholder='Title here'
                                                style={{ marginTop: 8 }}
                                                value={(editing === photo.id) ? title : !!photo.note ? decodeURIComponent(photo.note).replace(/\+/g, ' ') : ''}
                                                onBlur={() => this.handleBlur(photo.id)}
                                                onFocus={() => this.setState({ title: !!photo.note ? decodeURIComponent(photo.note).replace(/\+/g, ' ') : '', editing: photo.id })}
                                                onChange={e => this.setState({ title: e.target.value })}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                                {vids.map((video, index) => (
                                    <Card
                                        key={index}
                                        onMouseEnter={() => this.setState({ hover: video.id })}
                                        onMouseLeave={() => this.setState({ hover: '' })}
                                        style={{ width: 256, height: 256, boxShadow: 'none', display: 'flex' }}
                                    >
                                        <CardContent
                                            style={{ padding: 0, fontSize: '0.875rem', display: 'flex', flex: 1, flexDirection: 'column', marginBottom: 16 }}
                                        >
                                            <Box style={{ flex: 1, position: 'relative' }}>
                                                <Youtube
                                                    videoId={(queryString.parse((new URL(decodeURIComponent(video.name))).search))['v']}
                                                    opts={{
                                                        width: 256,
                                                        height: 208,
                                                        // playerVars: { // https://developers.google.com/youtube/player_parameters
                                                        //     autoplay: 1
                                                        // }
                                                    }}
                                                />
                                                {(hover === video.id) && (
                                                    <IconButton
                                                        style={{ position: 'absolute', right: 0, top: 0 }}
                                                        color="primary"
                                                        onClick={() => this.handleDelete(video.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            <Input
                                                placeholder='Title here'
                                                style={{ marginTop: 8 }}
                                                value={(editing === video.id) ? title : !!video.note ? decodeURIComponent(video.note).replace(/\+/g, ' ') : ''}
                                                onBlur={() => this.handleBlur(video.id)}
                                                onFocus={() => this.setState({ title: !!video.note ? decodeURIComponent(video.note).replace(/\+/g, ' ') : '', editing: video.id })}
                                                onChange={e => this.setState({ title: e.target.value })}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </ListItem>
                    </List>
                </Card>
            </>
        );
    }
}

export default withStyles(styles)(ProfilePhotos);