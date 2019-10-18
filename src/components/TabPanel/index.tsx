import React from 'react';

import Box from '@material-ui/core/Box';

interface ITabPanelProps {
    hidden: boolean;
    [key: string]: any;
}

const TabPanel: React.SFC<ITabPanelProps> = props => {
    const { children, hidden, ...other } = props;

    return (
        <Box
            style={{ padding: '0 16px' }}
            role='tabpanel'
            hidden={hidden}
            {...other}
        >
            {children}
        </Box>
    );

}

export default TabPanel;