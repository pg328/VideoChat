import React, {createContext, useState} from 'react';
import MuteButton from './MuteButton';
import PIPButton from './PIPButton';
import ScreenSharingContext from './ScreenSharingContext';
import ShareScreenButton from './ShareScreenButton';
import ToggleVideoButton from './ToggleVideoButton';

const ButtonBar = ({remoteVideo, localVideo, localStream, getSharedStream, getLocalStream, pc}) => {
    const [isSharing, setIsSharing] = useState(false);
    return (
        <ScreenSharingContext.Provider value={{isSharing, setIsSharing}}>
            <PIPButton remoteVideoRef={remoteVideo} />
            <MuteButton localStream={localVideo} />
            <ToggleVideoButton remoteVideoRef={localVideo} />
            <ShareScreenButton
                localVideoRef={localVideo}
                pc={pc}
                getSharedStream={getSharedStream}
                getLocalStream={getLocalStream}
            />
        </ScreenSharingContext.Provider>
    );
};

export default ButtonBar;
