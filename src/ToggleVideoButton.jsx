import {Box, Button, Text} from 'grommet';
import React, {useState} from 'react';
import {theme} from './theme';

export const ToggleVideoButton = ({remoteVideoRef, ...props}) => {
    const [isHidden, setIsHidden] = useState(false);

    const toggleVideo = () => {
        setIsHidden(!isHidden);
    };

    if (remoteVideoRef?.current?.srcObject) {
        remoteVideoRef.current.srcObject.getVideoTracks()[0].enabled = !isHidden;
        //console.log('Video Off: ', remoteVideoRef.current.srcObject.getVideoTracks()[0].enabled);
    }

    return (
        <Box
            elevation="medium"
            pad="small"
            margin="medium"
            background={!isHidden ? theme.primary : theme.darkBackground}
            round="medium"
        >
            <Button
                label={<Text weight={500}>{!isHidden ? `Hide Video` : `Show Video`}</Text>}
                plain
                focusIndicator={false}
                onClick={toggleVideo}
            ></Button>
        </Box>
    );
};
