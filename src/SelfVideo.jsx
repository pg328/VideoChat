import styled from 'styled-components';

export const SelfVideo = styled.video`
    & {
        ${(props) =>
            props.isFlipped &&
            `
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);`}
    }
`;
