import React from 'react';
import { GenericVideoButton } from './GenericVideoButton';
import Chat from './icons/Chat';
import ChatOff from './icons/ChatOff';

const ChatButton = ({isChatOpen, setIsChatOpen, ...props}) => {
    const toggleChatOpen = () => {
        setIsChatOpen((o) => !o);
    };

    return <GenericVideoButton state={isChatOpen} onClick={toggleChatOpen} Icon1={Chat} Icon2={ChatOff} />;
};

export default ChatButton;
