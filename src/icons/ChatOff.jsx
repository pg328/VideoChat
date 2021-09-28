import React from 'react';
const ChatOff = ({width, height, colour, ...props}) => (
    <svg
        width={`${width || 146}`}
        height={`${height || 129}`}
        viewBox={`0 0 28 28`}
        fill={`${colour || 'none'}`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M25.2 0H2.8C1.26 0 0 1.26 0 2.8V28L5.6 22.4H25.2C26.74 22.4 28 21.14 28 19.6V2.8C28 1.26 26.74 0 25.2 0Z"
            fill={`${colour || 'white'}`}
        />
    </svg>
);

export default ChatOff;
