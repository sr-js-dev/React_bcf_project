import * as React from 'react';
import { Star, StarBorder, StarHalf } from '@material-ui/icons';
import Box from '@material-ui/core/Box';
import _ from 'lodash';

interface IRateProps {
    rate: number;
    color: string;
}

const Rate: React.FunctionComponent<IRateProps> = (props) => {

    const intMark = Math.floor(props.rate);
    const restMark = props.rate - intMark;
    const restNode = (restMark < 0.3) ?
        <StarBorder fontSize='small' htmlColor={props.color} /> : (restMark < 0.7) ?
            <StarHalf fontSize='small' htmlColor={props.color} /> :
            <Star fontSize='small' htmlColor={props.color} />;
    const marks1 = _.range(intMark);
    const marks2 = _.range(intMark + 1, 5);
    return (
        <Box>
            {
                marks1.map(i => (
                    <span key={i}><Star fontSize='small' htmlColor={props.color} /></span>
                ))
            }
            {intMark < 5 && restNode}
            {
                (intMark < 4) && marks2.map(i => (
                    <span key={i}><StarBorder fontSize='small' htmlColor={props.color} /></span>
                ))
            }
        </Box>
    );
};

export default Rate;
