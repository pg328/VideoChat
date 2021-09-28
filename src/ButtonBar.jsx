import React, {createContext, useState} from 'react';
import ChatButton from './ChatButton';
import MuteButton from './MuteButton';
import PIPButton from './PIPButton';
import ScreenSharingContext from './ScreenSharingContext';
import ShareScreenButton from './ShareScreenButton';
import ToggleVideoButton from './ToggleVideoButton';

const ButtonBar = ({
    remoteStream,
    sharedStream,
    localStream,
    getSharedStream,
    getLocalStream,
    pc,
    DC,
    isChatOpen,
    setIsChatOpen,
}) => {
    return (
        <>
            <PIPButton />
            <MuteButton pc={pc} DC={DC} localStream={localStream} />
            <ToggleVideoButton localStream={localStream} />
            <ShareScreenButton getSharedStream={getSharedStream} getLocalStream={getLocalStream} />
            {/*<ChatButton isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />*/}
        </>
    );
};

export default ButtonBar;
