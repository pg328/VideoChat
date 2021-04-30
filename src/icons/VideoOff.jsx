import React from 'react';
const VideoOff = ({width, height, colour, ...props}) => (
    <svg
        width={`${width || 142}`}
        height={`${height || 142}`}
        viewBox={`0 0 142 142`}
        fill={`${colour || 'none'}`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M142 33.6316L112.105 63.5263V37.3684C112.105 33.2579 108.742 29.8947 104.632 29.8947H58.4442L142 113.451V33.6316ZM9.49158 0L0 9.49158L20.4032 29.8947H14.9474C10.8368 29.8947 7.47368 33.2579 7.47368 37.3684V112.105C7.47368 116.216 10.8368 119.579 14.9474 119.579H104.632C106.201 119.579 107.546 118.981 108.667 118.234L132.508 142L142 132.508L9.49158 0Z"
            fill={`${colour || 'white'}`}
        />
    </svg>
);

export default VideoOff;
