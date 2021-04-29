import styled from 'styled-components';

export const SelfVideo = styled.video`
    & {
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
    }
`;
