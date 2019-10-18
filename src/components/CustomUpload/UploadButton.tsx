import * as React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

interface IUploadButtonProps extends ButtonProps {
    btnId?: string;
    filter: string;
    multiple: boolean;
    handleChange: (files: File[]) => void | Promise<void>;
}

const UploadButton: React.FC<IUploadButtonProps> = (props) => {

    const { handleChange, filter, multiple, children, btnId, ...others } = props;

    const onChange = e => {
        const fileList = e.target.files;
        const files = [];
        for (let file of fileList) {
            files.push(file);
        }

        handleChange(files);
    }

    return (
        <Box style={{ display: 'inline-block' }}>
            <input
                accept={filter}
                id={btnId || "upload-file"}
                multiple={multiple}
                type="file"
                style={{ display: 'none' }}
                onChange={onChange}
            />
            <label htmlFor={btnId || "upload-file"} style={{ display: 'inline' }}>
                <Button {...others} component='span'>
                    {children}
                </Button>
            </label>
        </Box>
    );
};

export default UploadButton;
