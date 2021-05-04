import {Text} from 'grommet';
import React, {useContext, useState} from 'react';
import ScreenShare from './icons/ScreenShare';
import StopScreenShare from './icons/StopScreenShare';
import styled from 'styled-components';
import {GenericVideoButton} from './GenericVideoButton';
import ScreenSharingContext from './ScreenSharingContext';

const ShareScreenButton = ({getSharedStream, getLocalStream, ...props}) => {
    const {isSharing, setIsSharing} = useContext(ScreenSharingContext);

    const onClick = async () => {
        if (isSharing) {
            await getLocalStream();
            setIsSharing((currentState) => !currentState);
        } else {
            await getSharedStream();
            setIsSharing((currentState) => !currentState);
        }
    };
    return <GenericVideoButton state={isSharing} onClick={onClick} Icon1={ScreenShare} Icon2={StopScreenShare} />;
};

export default ShareScreenButton;
