import {Box, Button, Text} from 'grommet';
import React, {useState} from 'react';
import {GenericVideoButton} from './GenericVideoButton';
import VideoIcon from './icons/VideoIcon';
import VideoOff from './icons/VideoOff';
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

    return <GenericVideoButton state={isHidden} onClick={toggleVideo} Icon1={VideoIcon} Icon2={VideoOff} />;
};
