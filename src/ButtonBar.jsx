import React, {createContext, useState} from 'react';
import MuteButton from './MuteButton';
import PIPButton from './PIPButton';
import ScreenSharingContext from './ScreenSharingContext';
import ShareScreenButton from './ShareScreenButton';
import ToggleVideoButton from './ToggleVideoButton';

const ButtonBar = ({remoteStream, sharedStream, localStream, getSharedStream, getLocalStream, pc}) => {
    return (
        <>
            <PIPButton />
            <MuteButton localStream={localStream} />
            <ToggleVideoButton localStream={localStream} />
            <ShareScreenButton getSharedStream={getSharedStream} getLocalStream={getLocalStream} />
        </>
    );
};

export default ButtonBar;
