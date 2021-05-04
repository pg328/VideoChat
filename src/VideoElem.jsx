import React, {forwardRef, useEffect, useRef} from 'react';

const VideoElem = forwardRef(({srcObject, isFlipped, ...props}, ref) => {
    useEffect(() => {
        ref.current.srcObject = srcObject;
    }, [srcObject]);
    return (
        <video {...{...props}} ref={ref}>
            {props.children}
        </video>
    );
});

export default VideoElem;
