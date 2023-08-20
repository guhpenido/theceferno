import styled from 'styled-components';

interface Props {
    outlined ?: boolean;
}

export default styled.button<Props>`
    background: ${(props) => (props.outlined ? 'transparent' : '#41a7cf')};
    color: ${(props) => (props.outlined ? '#4763E4' : '#d9d9d9')};
    border: ${(props) => (props.outlined ? '2px solid #4763E4': 'none')};
    padding: 16px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    outline: 0;

    &:hover {
        background: ${props => 
        props.outlined 
        ? '#00003d' 
        : '#00276c'};
    }
`;