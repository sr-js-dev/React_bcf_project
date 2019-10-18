import React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';

import UploadButton from 'components/CustomUpload/UploadButton';


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
    borderedBox: {
        border: '1px dashed rgba(0, 0, 0, 0.5)',
        padding: theme.spacing(1),
        display: 'flex'
    },
    button: {
        margin: '4px'
    },
    submit: {
        width: 120,
        border: '1px solid #4a148c',
        color: 'white',
        marginRight: 16,
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
    error: {
        color: 'red',
        fontSize: '0.75rem',
        margin: theme.spacing(0.5, 0)
    },
    addBox: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    card: {
        padding: 0,
        fontSize: '0.875rem',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        marginBottom: 16
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    }
});

export interface IProfileLicenseProps extends StyledComponentProps {
    contId: string;
    licenses: any[];
    handleSubmit: (city: string, type: string, number: string, file: File) => Promise<void>;
    delete: (name: string) => Promise<void>;
}

interface IProfileLicenseState {
    dialog: boolean;
    city: string;
    type: string;
    number: string;
    fileError?: string;
    file?: File;
    url?: string;
    licInFocus: string;
}

class ProfileLicense extends React.Component<IProfileLicenseProps, IProfileLicenseState> {

    constructor(props: Readonly<IProfileLicenseProps>) {
        super(props);

        this.state = {
            dialog: false,
            city: '',
            type: '',
            number: '',
            licInFocus: ''
        }
    }

    handleAdd = () => {
        this.setState({
            dialog: true,
            city: '',
            type: '',
            number: '',
            file: undefined,
            url: undefined,
            fileError: undefined,
            licInFocus: ''
        });
    }

    handleCancel = () => {
        this.setState({ dialog: false });
    }

    handleSubmit = () => {
        const { city, type, number, file } = this.state;
        let fileError;
        if (!file) fileError = 'File not attached';
        if (fileError) {
            this.setState({ fileError });
            return;
        }

        this.props.handleSubmit(city, type, number, file);
        this.setState({ dialog: false });
    }

    handleUpload = (files: File[]): Promise<void> => new Promise(resolve => {
        if (files.length !== 1) return;
        const file = files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            this.setState({ file, url: reader.result as string, fileError: undefined });
            resolve();
        });
        reader.readAsDataURL(file);
    });

    handleDelLicense = (e: React.MouseEvent, name: string) => {
        e.stopPropagation();
        this.props.delete(name);
    }

    public render() {
        const { classes, licenses, contId } = this.props;
        const { dialog, city, type, number, url, fileError, licInFocus } = this.state;
        const rootDir = process.env.REACT_APP_PROJECT_API + `/contractors/${contId}/files/`;
        const lics = licenses.map(lic => {
            if (!lic.note || lic.note.length <= 6) {
                return { id: lic.id, name: lic.name, url: rootDir + lic.name, city: '', type: '', number: '' };
            }

            const items = lic.note.split('__');
            return { id: lic.id, name: lic.name, url: rootDir + lic.name, city: items[0], type: items[1], number: items[2] };
        });

        return (
            <>
                <Card className={classes.container}>
                    <List>
                        <ListItem>
                            <Typography className={classes.title}>
                                Credentials
                            </Typography>
                        </ListItem>
                        <ListItem id='license-description'>
                            <Box style={{ width: '100%' }}>
                                <Box style={{ display: 'flex' }}>
                                    <CheckIcon style={{ marginRight: 16, fontSize: 24, padding: 4 }} />
                                    <Typography className={classes.bold} style={{ marginBottom: 4 }}>
                                        Professional Licenses
                                    </Typography>
                                </Box>
                                <Box className={classes.borderedBox}>
                                    <Typography style={{ fontSize: '0.875rem', flex: 1, marginRight: 16 }}>
                                        Customers prefer to hire professionals who are licensed in their profession.
                                    </Typography>
                                    <Button
                                        onClick={this.handleAdd}
                                        variant='outlined'
                                        className={classes.button}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Box>
                        </ListItem>
                        <ListItem id='exiting-licenses'>
                            <Box style={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
                                {lics.map((item, index) => (
                                    <Card
                                        key={index}
                                        style={{ width: 256, height: 256, boxShadow: 'none', display: 'flex' }}
                                        onMouseEnter={() => this.setState({ licInFocus: item.id })}
                                        onMouseLeave={() => this.setState({ licInFocus: '' })}
                                    >
                                        <CardContent className={classes.card}>
                                            <Box className={classes.addBox} style={{ position: 'relative' }}>
                                                <img
                                                    alt={item.number}
                                                    style={{ width: 256, height: 188 }}
                                                    src={item.url}
                                                />
                                                {licInFocus === item.id && (
                                                    <IconButton
                                                        style={{ position: 'absolute', right: 0, top: 0 }}
                                                        color="primary"
                                                        onClick={(e) => this.handleDelLicense(e, item.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            <Typography style={{ fontWeight: 500, fontSize: '1rem', marginTop: 8 }}>
                                                {`City: ${item.city}`}
                                            </Typography>
                                            <Typography style={{ fontSize: '1rem' }}>
                                                {`Type. ${item.type}`}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </ListItem>
                    </List>
                </Card>
                <Dialog open={dialog} onClose={this.handleCancel}>
                    <DialogTitle id="review-dialog-title">
                        <Typography className={classes.title}>
                            {'Add a professional license'}
                        </Typography>
                        <Typography style={{ fontSize: '0.875rem' }}>
                            {'Please provide your license information below for your profile.\r\n'}
                            {'If we are able to locate the license under your name and business, we will display the license information on your profile. If you need help uploading your license, please contact us at '}
                            <Link target='_blank' href='https://google.com'>here</Link>
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <TextField
                                label={`City`}
                                margin="dense"
                                fullWidth
                                value={city}
                                onChange={e => this.setState({ city: e.target.value })}
                                required
                            />
                            <TextField
                                label={`License type`}
                                margin="dense"
                                fullWidth
                                value={type}
                                onChange={e => this.setState({ type: e.target.value })}
                                required
                            />
                            <TextField
                                label={`License number`}
                                margin="dense"
                                fullWidth
                                value={number}
                                onChange={e => this.setState({ number: e.target.value })}
                                required
                            />
                            <Box style={{ display: 'flex', margin: '8px 0 12px' }}>
                                <Box style={{ flex: 1, height: 120, display: 'flex' }}>
                                    <Box style={{ display: 'inline-block' }}>
                                        <UploadButton
                                            multiple={false}
                                            filter={'image/*'}
                                            handleChange={this.handleUpload}
                                            variant={'outlined'}
                                            style={{ marginRight: 16 }}
                                        >
                                            Upload Picture
    							        </UploadButton>
                                        {fileError && (
                                            <Typography className={classes.error}>
                                                {fileError}
                                            </Typography>
                                        )}
                                    </Box>
                                    {url && (
                                        <img src={url} alt='license' style={{ width: 120, height: 120 }} />
                                    )}
                                </Box>
                                <Box style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <Button onClick={this.handleSubmit} autoFocus className={classes.submit} variant={'outlined'}>
                                        Submit
                                    </Button>
                                    <Button onClick={this.handleCancel} variant={'outlined'}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                    {/* <DialogActions style={{ display: 'flex', padding: 24 }}>
                        <Button onClick={this.handleSubmit} autoFocus className={classes.submit} variant={'outlined'}>
                            Submit
                        </Button>
                        <Button onClick={this.handleCancel} variant={'outlined'}>
                            Cancel
                        </Button>
                    </DialogActions> */}
                    <DialogContent style={{ padding: '8px 24px 24px' }}>
                        <Typography style={{ fontSize: '0.875rem', fontWeight: 600, paddingTop: 8 }}>
                            Why show your license?
                        </Typography>
                        <Typography style={{ fontSize: '0.875rem' }}>
                            For certain services, customers prefer to hire professionals who are licensed in their profession. In other cases, licenses are required for the job.
                        </Typography>
                        <Typography style={{ fontSize: '0.875rem', fontWeight: 600, paddingTop: 8 }}>
                            What kind of license can I upload to display on my profile?
                        </Typography>
                        <Typography style={{ fontSize: '0.875rem' }}>
                            Occupational or professional licenses, as indicated by the options in the above dropdown menu. We do not display business licenses or registrations because those do not showcase occupational credentials.
                        </Typography>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(ProfileLicense);