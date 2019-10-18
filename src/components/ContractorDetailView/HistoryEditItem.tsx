import * as React from 'react';

import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import FileUpload from 'components/FileUpload';
import { HistoryInfo } from 'types/global';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from '@material-ui/pickers';
import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';

import Button from "components/CustomButtons/Button.jsx";


const styles = createStyles(theme => ({
    root: {
        border: '1px solid #EEE',
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    container: {
        display: 'flex',
        justifyContent: 'left'
    },
    textFieldHalf: {
        width: '120px',
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            width: '150px',
        },
        [theme.breakpoints.up('md')]: {
            width: '200px',
        }
    },
    doneContainer: {
        display: 'block',
        textAlign: 'right',
    },
    doneBtn: {
        border: '1px solid #4a148c',
        borderRadius: 0,
        color: theme.palette.primary.light,
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        marginLeft: theme.spacing(2),
        width: '160px',
        fontSize: '14px',
        bottom: 0,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        '&:disabled': {
            backgroundColor: '#CCC',
        },
    }
}));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const toMonthString = (date: Date) => {
    return MONTHS[date.getMonth()] + ' ' + date.getFullYear();
}

export interface IHistoryEditItemProps {
    handleSave: (item: HistoryInfo) => Promise<void>;
    handleCancel: () => void;
    item?: HistoryInfo;
    classes: ClassNameMap<string>;
}

interface IHistoryEditItemState {
    title: string;
    description: string;
    from: Date;
    to: Date;
    files: Array<string>;
    titleError: boolean;
}

class HistoryEditItem extends React.Component<IHistoryEditItemProps, IHistoryEditItemState> {

    constructor(props: Readonly<IHistoryEditItemProps>) {
        super(props);

        this.state = {
            title: props.item ? props.item.title : '',
            description: props.item ? props.item.description : '',
            from: props.item ? new Date(props.item.from) : new Date(),
            to: props.item ? new Date(props.item.to) : new Date(),
            files: props.item ? props.item.images : [],
            titleError: false
        }
    }

    handleAddFiles = (files: FileList) => {
        const len = files.length;
        const newArray = [];
        for (let i = 0; i < len; i++) {
            newArray.push(files.item(i).name);
        }
        this.setState({
            files: [...this.state.files, ...newArray]
        });
    }

    handleDeleteFile = (file: string) => {
        const idx = this.state.files.indexOf(file);
        if (idx >= 0) {
            const { files } = this.state;
            files.splice(idx, 1);
            this.setState({ files: [...files] });
        }
    }

    handleSave = () => {
        if (!this.state.title || this.state.title.length === 0) {
            this.setState({ titleError: true });
            return;
        }

        const data: HistoryInfo = {
            id: '',
            title: this.state.title,
            description: this.state.description,
            from: toMonthString(this.state.from),
            to: toMonthString(this.state.to),
            images: this.state.files,
            createdAt: this.props.item ? this.props.item.createdAt : new Date().toDateString(),
            updatedAt: new Date().toDateString()
        };

        this.props.handleSave(data);
    }


    public render() {
        const { classes } = this.props;
        const { title, description, from, to, files } = this.state;
        return (
            <Card className={classes.root}>
                <TextField
                    required
                    label="Title"
                    margin="normal"
                    fullWidth={true}
                    value={title}
                    FormHelperTextProps={{ error: true }}
                    helperText={this.state.titleError ? "Title can't be empty" : undefined}
                    onChange={e => this.setState({ title: e.target.value })}
                />
                <Box className={classes.container}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            className={classes.textFieldHalf}
                            margin="normal"
                            id="mui-pickers-date"
                            label="From"
                            openTo={'month'}
                            views={['year', 'month']}
                            value={from}
                            onChange={date => this.setState({ from: date })}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            className={classes.textFieldHalf}
                            margin="normal"
                            id="mui-pickers-date"
                            label="To"
                            openTo={'month'}
                            views={['year', 'month']}
                            value={to}
                            onChange={date => this.setState({ to: date })}
                        />
                    </MuiPickersUtilsProvider>
                </Box>
                <SimpleMDE
                    value={description}
                    onChange={value => this.setState({ description: value })}
                    options={{ placeholder: 'Description here' }}
                />

                <TextField
                    label="Description"
                    margin="normal"
                    fullWidth={true}
                    value={description}
                    onChange={e => this.setState({ description: e.target.value })}
                />
                <FileUpload
                    files={files}
                    handleAddFiles={this.handleAddFiles}
                    handleDeleteFile={this.handleDeleteFile}
                />
                <Box className={classes.doneContainer}>
                    <Button
                        color="primary"
                        className={classes.doneBtn}
                        onClick={this.handleSave}
                    >
                        Done
                    </Button>
                    <Button
                        color="primary"
                        className={classes.doneBtn}
                        onClick={this.props.handleCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Card>
        );
    }
}

export default withStyles(styles)(HistoryEditItem);