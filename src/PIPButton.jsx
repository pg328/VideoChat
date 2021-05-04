import {Box, Button, Text} from 'grommet';
import React, {useContext, useEffect, useState} from 'react';
import {GenericVideoButton} from './GenericVideoButton';
import {theme} from './theme';
import PIP from './icons/PIP.jsx';
import PIPOff from './icons/PIPOff.jsx';
import ScreenSharingContext from './ScreenSharingContext';

const PIPButton = ({...props}) => {
    const [isPIP, setIsPIP] = useState(false);
    const {remoteVideo} = useContext(ScreenSharingContext);

    const togglePIP = (e) => {
        if (!isPIP) {
            remoteVideo.current.requestPictureInPicture();
            setIsPIP(true);
        } else {
            document.exitPictureInPicture();
        }
    };
    useEffect(() => {
        document.addEventListener('leavepictureinpicture', function (event) {
            setIsPIP(false);
            console.log('Video left Picture-in-Picture.');
            // User may have played a Picture-in-Picture video from a different page.
        });
    });

    return <GenericVideoButton state={isPIP} onClick={togglePIP} Icon1={PIP} Icon2={PIPOff} />;
};

export default PIPButton;
