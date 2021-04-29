import {Box, Button, Layer, Text} from 'grommet';
import React, {useState} from 'react';
import {theme} from './theme';

export const LinkLayer = ({tr, ...props}) => {
    const [show, setShow] = useState(true);
    return (
        <Box>
            {show && (
                <Layer responsive position="center">
                    <Box background={theme.yellow} round="small">
                        <Box round="medium" width="large" direction="row" justify="center" align="center">
                            <Text>{`Psst, here's a lil link to send to ur pals 😏😏: `}</Text>
                        </Box>
                        <Box round="medium" width="large" direction="row" justify="center" align="center">
                            <Box elevation="medium" background={theme.green} round="medium">
                                <Button
                                    label={<Text weight={500}>{`(Click me to copy the link 😎)`}</Text>}
                                    plain
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href + tr.current);
                                        //console.log(tr.current.length);
                                        setShow(false);
                                    }}
                                ></Button>
                            </Box>
                        </Box>
                    </Box>
                </Layer>
            )}
        </Box>
    );
};
