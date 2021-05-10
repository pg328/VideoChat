import React from 'react';
import {GenericVideoButton} from './GenericVideoButton';
import Mic from './icons/Mic';
import MicOff from './icons/MicOff';

const ChatButton = ({isChatOpen, setIsChatOpen, ...props}) => {
    const toggleChatOpen = () => {
        setIsChatOpen((o) => !o);
    };

    return <GenericVideoButton state={isChatOpen} onClick={toggleChatOpen} Icon1={Mic} Icon2={MicOff} />;
};

export default ChatButton;
