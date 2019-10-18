import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';

interface ICustomAvatarProps {
    size: number;
    src: string;
}

const CustomAvatar: React.FunctionComponent<ICustomAvatarProps> = (props) => {

    const [error, setError] = React.useState(false);

    return (
        <Avatar
            src={error ? undefined : props.src}
            imgProps={{ onError: () => setError(true) }}
            style={{ width: props.size, height: props.size, backgroundColor: '#4a148c' }}
        >
            {error && props.children}
        </Avatar>
    );
};

export default CustomAvatar;
