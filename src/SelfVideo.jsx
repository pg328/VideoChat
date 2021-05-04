import styled from 'styled-components';
import VideoElem from './VideoElem';

const SelfVideo = styled(VideoElem)`
    & {
        ${(props) =>
            props.isFlipped &&
            `
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);`}
    }
`;

export default SelfVideo;
