import {Box, Button, Text} from 'grommet';
import React, {useState} from 'react';
import {theme} from './theme';

export const ShareScreenButton = ({pc, getSharedStream, getLocalStream, ...props}) => {
    const [isSharing, setIsSharing] = useState(false);

    const onClick = () => {
        if (isSharing) {
            setIsSharing(!isSharing);
            getLocalStream();
        } else {
            setIsSharing(!isSharing);
            getSharedStream();
        }
    };
    return (
        <Box
            elevation="medium"
            pad="small"
            margin="large"
            background={!isSharing ? theme.green : theme.orange}
            round="medium"
        >
            <Button
                label={<Text weight={500}>{!isSharing ? `Share Screen` : `Stop Sharing Screen`}</Text>}
                plain
                focusIndicator={false}
                onClick={onClick}
            ></Button>
        </Box>
    );
};
