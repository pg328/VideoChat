import {Box, Button, Text} from 'grommet';
import React, {useState} from 'react';
import {theme} from './theme';

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
    return (
        <Box
            elevation="medium"
            pad="small"
            margin="medium"
            background={!isSharing ? theme.primary : theme.darkBackground}
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
