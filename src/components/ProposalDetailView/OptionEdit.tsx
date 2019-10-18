import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import { Done as DoneIcon, NotInterested } from '@material-ui/icons';
import React from 'react';
import Button from '../CustomButtons/Button';
import { OptionPostInfo } from 'types/global';

const styles = createStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        width: '100%',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        flexBasis: 200,
    },
}));

type OptionEditInfo = OptionPostInfo & { id: string };
interface IOptionEditProps {
    classes: ClassNameMap<string>;
    option: OptionEditInfo;
    handleSave: (data: OptionEditInfo) => Promise<void>;
    handleCancel: () => void;
}

interface IOptionEditState extends OptionEditInfo {
    showAlert: boolean;
    title: string;
    message: string;
}

class OptionEdit extends React.Component<IOptionEditProps, IOptionEditState> {
    constructor(props) {
        super(props);

        this.state = {
            ...props.option,
            showAlert: false,
            title: '',
            message: '',
        };
    }

    handleSave = () => {
        if (
            this.state.name.length === 0 ||
            this.state.description.length === 0 ||
            this.state.value.length === 0
        ) {
            this.setState({
                showAlert: true,
                title: 'Error',
                message: 'Fill in all the items',
            });
            return;
        } else if (this.state.budget === 0 || this.state.duration === 0) {
            this.setState({
                showAlert: true,
                title: 'Error',
                message: 'Fill in valid values',
            });
            return;
        }

        const { showAlert, title, message, ...data } = this.state;
        this.props.handleSave(data);
    };

    handlePop = () => {
        this.setState({ showAlert: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={classes.input}
                            label="Option name"
                            placeholder="Option"
                            margin="none"
                            onChange={e => this.setState({ name: e.target.value })}
                            value={this.state.name}
                            name="name"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={classes.input}
                            label="Option value"
                            placeholder="Value"
                            margin="none"
                            onChange={e => this.setState({ value: e.target.value })}
                            value={this.state.value}
                            name="value"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={classes.input}
                            label="Budget"
                            placeholder="1000"
                            margin="none"
                            onChange={e => this.setState({ budget: parseInt(e.target.value) })}
                            value={this.state.budget}
                            name="budget"
                            type="number"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            className={classes.input}
                            label="Duration"
                            placeholder="10"
                            margin="none"
                            onChange={e => this.setState({ duration: parseInt(e.target.value) })}
                            value={this.state.duration}
                            type="number"
                            name="duration"
                            required
                        />
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={9} sm={10}>
                            <TextField
                                className={classes.input}
                                multiline
                                label="Description"
                                placeholder="description"
                                margin="none"
                                onChange={e => this.setState({ description: e.target.value })}
                                value={this.state.description}
                                name="description"
                                required
                            />
                        </Grid>
                        <Grid
                            item
                            xs={3}
                            sm={2}
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                                alignContent: 'center',
                            }}
                        >
                            <IconButton style={{ padding: '6px' }} onClick={this.handleSave}>
                                <DoneIcon />
                            </IconButton>
                            <IconButton
                                style={{ padding: '6px' }}
                                onClick={this.props.handleCancel}
                            >
                                <NotInterested />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog
                    open={this.state.showAlert}
                    onClose={() => this.setState({ showAlert: false })}
                    aria-labelledby="alert-dialog-title"
                >
                    <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handlePop} color="primary" autoFocus>
                            OK
            			</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(OptionEdit);
