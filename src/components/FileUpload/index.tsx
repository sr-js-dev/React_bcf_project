import * as React from 'react';

import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import Button from "components/CustomButtons/Button.jsx";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(1)
    },
    chip: {
        margin: theme.spacing(1)
    }
}));

interface IUploadFileViewProps {
    accept?: string;
    files: Array<string>;
    handleAddFiles: (files: FileList) => void;
    handleDeleteFile: (file: string) => void;
}

const UploadFileView: React.SFC<IUploadFileViewProps> = (props) => {

    const classes = useStyles({});
    const { files, handleAddFiles, handleDeleteFile } = props;
    const accept = props.accept ? props.accept : "image/*";
    return (
        <Box className={classes.root}>
            <input
                accept={accept}
                id="upload-file"
                multiple
                type="file"
                style={{ display: 'none' }}
                onChange={e => handleAddFiles(e.target.files)}
            />
            <label htmlFor="upload-file" style={{ display: 'inline' }}>
                <Button
                    variant="contained"
                    component="span"
                >
                    <CloudUploadIcon />
                    &nbsp;&nbsp;Upload
                </Button>
            </label>
            {files.map((file, index) => (
                <Chip
                    className={classes.chip}
                    key={index}
                    label={file.slice(file.lastIndexOf('/') + 1)}
                    onDelete={() => handleDeleteFile(file)}
                />
            ))}
        </Box>
    );
};

export default UploadFileView;
