import {Box, Button, Text} from 'grommet';
import React, {useState} from 'react';
import {GenericVideoButton} from './GenericVideoButton';
import {theme} from './theme';
import Mic from './icons/Mic';
import MicOff from './icons/MicOff';

export const MuteButton = ({remoteVideoRef, ...props}) => {
    const [isMuted, setIsMuted] = useState(false);

    const toggleMuted = () => {
        setIsMuted(!isMuted);
    };

    if (remoteVideoRef?.current?.srcObject) {
        remoteVideoRef.current.srcObject.getAudioTracks()[0].enabled = !isMuted;
        //console.log('Muted: ', remoteVideoRef.current.srcObject.getAudioTracks()[0].enabled);
    }

    return <GenericVideoButton state={isMuted} onClick={toggleMuted} Icon1={Mic} Icon2={MicOff} />;
};
