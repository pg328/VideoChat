import {Box, Button, Text} from 'grommet';
import React, {useState} from 'react';
import {theme} from './theme';

export const PIPButton = ({remoteVideoRef, ...props}) => {
    const [isPIP, setIsPIP] = useState(false);

    const togglePIP = () => {
        setIsPIP(!isPIP);
        if (!isPIP) {
            remoteVideoRef.current.requestPictureInPicture();
        } else {
            document.exitPictureInPicture();
        }
    };

    return (
        <Box
            elevation="medium"
            pad="small"
            margin="medium"
            background={!isPIP ? theme.primary : theme.darkBackground}
            round="medium"
        >
            <Button
                label={<Text weight={500}>{!isPIP ? `PiP` : `UnPiP`}</Text>}
                plain
                focusIndicator={false}
                onClick={togglePIP}
            ></Button>
        </Box>
    );
};
