import {Text} from 'grommet';
import React, {useState} from 'react';
import ScreenShare from './icons/ScreenShare';
import StopScreenShare from './icons/StopScreenShare';
import styled from 'styled-components';
import {GenericVideoButton} from './GenericVideoButton';

export const ShareScreenButton = ({pc, getSharedStream, getLocalStream, ...props}) => {
    const [isSharing, setIsSharing] = useState(false);

    const onClick = async () => {
        if (isSharing) {
            await getLocalStream();
            setIsSharing(!isSharing);
        } else {
            await getSharedStream();
            setIsSharing(!isSharing);
        }
    };
    return <GenericVideoButton state={isSharing} onClick={onClick} Icon1={ScreenShare} Icon2={StopScreenShare} />;
};
