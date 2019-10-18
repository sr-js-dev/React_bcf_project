import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface IEllipsisProps {
    fontSize?: string;
    maxLines?: number;
}

const useStyles = (props: IEllipsisProps) => makeStyles((theme: Theme) => ({
    ellipsis: {
        display: '-webkit-box',
        maxHeight: `calc(${props.maxLines} * ${1.5} * ${props.fontSize})`,
        lineHeight: '1.5',
        fontSize: props.fontSize,
        '-webkitLineClamp': props.maxLines,
        '-webkitBoxOrient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}));

const Ellipsis: React.SFC<IEllipsisProps> = (props) => {
    const { children, fontSize, maxLines } = props;
    let realSize = fontSize || '1em';
    let realLines = maxLines || 2;

    const classes = useStyles({ fontSize: realSize, maxLines: realLines })({});
    return (
        <span className={classes.ellipsis}>
            {children}
        </span>
    );
};

export default Ellipsis;
