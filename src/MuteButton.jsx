import {Box, Button, Text} from 'grommet';
import React, {useState} from 'react';
import {theme} from './theme';

export const MuteButton = ({remoteVideoRef, ...props}) => {
    const [isMuted, setIsMuted] = useState(false);

    const toggleMuted = () => {
        setIsMuted(!isMuted);
    };

    if (remoteVideoRef?.current?.srcObject) {
        remoteVideoRef.current.srcObject.getAudioTracks()[0].enabled = !isMuted;
        //console.log('Muted: ', remoteVideoRef.current.srcObject.getAudioTracks()[0].enabled);
    }

    return (
        <Box
            elevation="medium"
            pad="small"
            margin="medium"
            background={!isMuted ? theme.primary : theme.darkBackground}
            round="medium"
        >
            <Button
                label={<Text weight={500}>{!isMuted ? `Mute` : `Unmute`}</Text>}
                plain
                focusIndicator={false}
                onClick={toggleMuted}
            ></Button>
        </Box>
    );
};
