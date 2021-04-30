import {Box, Button} from 'grommet';
import React from 'react';
import {theme} from './theme';

export const GenericVideoButton = ({state, onClick, Icon1, Icon2}) => {
    return (
        <Box
            elevation="medium"
            pad="small"
            margin="medium"
            background={!state ? theme.primary : theme.darkBackground}
            round="medium"
        >
            <Button label={!state ? <Icon1 /> : <Icon2 />} plain focusIndicator={false} onClick={onClick}></Button>
        </Box>
    );
};
