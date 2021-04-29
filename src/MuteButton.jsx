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
            margin="large"
            background={!isMuted ? theme.green : theme.orange}
            round="medium"
        >
            <Button
                label={<Text weight={500}>{!isMuted ? `Mute` : `Unmute`}</Text>}
                plain
                onClick={toggleMuted}
            ></Button>
        </Box>
    );
};
