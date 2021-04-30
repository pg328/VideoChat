import {Box, Button} from 'grommet';
import React from 'react';
import {theme} from './theme';

export const GenericVideoButton = ({state, onClick, Icon1, Icon2}) => {
    return (
        <Box
            elevation="medium"
            pad="small"
            margin={{horizontal: 'medium', vertical: 'small'}}
            background={!state ? theme.primary : theme.darkBackground}
            round="medium"
        >
            <Button
                label={
                    !state ? (
                        <Box a11yTitle="ff">
                            <Icon1 width={'40px'} height={'40px'} />
                        </Box>
                    ) : (
                        <Box>
                            <Icon2 width={'40px'} height={'40px'} />
                        </Box>
                    )
                }
                plain
                focusIndicator={false}
                onClick={onClick}
            ></Button>
        </Box>
    );
};
