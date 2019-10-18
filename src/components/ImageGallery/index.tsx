import * as React from 'react';

import Box from '@material-ui/core/Box';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import IconButton from '@material-ui/core/IconButton';
// import InfoIcon from '@material-ui/icons/Info';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import { PortfolioItem } from 'types/global';


const styles = createStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
    },
    item: {
        width: '240px',
        height: '180px',
        padding: theme.spacing(1),
        '&:hover': {
            cursor: 'pointer'
        }
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

export interface IImageGalleryProps {
    items: PortfolioItem[];
    classes: ClassNameMap<string>;
    selectImage: (image: string) => void;
}

class ImageGallery extends React.Component<IImageGalleryProps> {

    public render() {
        const { items, classes } = this.props;
        return (
            <Box className={classes.root}>
                {items.map((image, index) => (
                    <img
                        key={index}
                        src={image} alt='item'
                        className={classes.item}
                        onClick={() => this.props.selectImage(image)}
                    />
                ))}
            </Box>
        );
    }
}

export default withStyles(styles)(ImageGallery);