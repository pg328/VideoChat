import {Box, Button, Text} from 'grommet';
import React, {useContext, useState} from 'react';
import {GenericVideoButton} from './GenericVideoButton';
import {theme} from './theme';
import Mic from './icons/Mic';
import MicOff from './icons/MicOff';
import ScreenSharingContext from './ScreenSharingContext';

const MuteButton = ({localStream, pc, ...props}) => {
    const {isSharing, setIsSharing} = useContext(ScreenSharingContext);
    const [isMuted, setIsMuted] = useState(false);

    const toggleMuted = () => {
        isSharing
            ? alert("Can't mute or unmute while screen sharing yet, sorry!")
            : localStream.current?.srcObject?.getAudioTracks?.()[0] && setIsMuted(!isMuted);
    };

    if (localStream.current?.srcObject?.getAudioTracks?.()[0]) {
        localStream.current.srcObject.getAudioTracks()[0].enabled = !isMuted;
    }

    return <GenericVideoButton state={isMuted} onClick={toggleMuted} Icon1={Mic} Icon2={MicOff} />;
};

export default MuteButton;
