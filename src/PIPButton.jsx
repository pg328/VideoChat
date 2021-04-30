import {Box, Button, Text} from 'grommet';
import React, {useState} from 'react';
import {GenericVideoButton} from './GenericVideoButton';
import {theme} from './theme';
import PIP from './icons/PIP.jsx';
import PIPOff from './icons/PIPOff.jsx';

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

    return <GenericVideoButton state={isPIP} onClick={togglePIP} Icon1={PIP} Icon2={PIPOff} />;
};
