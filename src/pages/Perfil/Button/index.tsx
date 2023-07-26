import styled from 'styled-components';

interface Props {
    outlined ?: boolean;
}

export default styled.button<Props>`
    background: ${(props) => (props.outlined ? 'transparent' : '#41a7cf')};
    color: ${(props) => (props.outlined ? 'var(--ceferno)' : 'var(--white)')};
    border: ${(props) => (props.outlined ? '2px solid var(--ceferno)': 'none')};
    padding: 16px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    outline: 0;

    &:hover {
        background: ${props => 
        props.outlined 
        ? 'var(--ceferno-dark-hover)' 
        : 'var(--ceferno-light-hover)'};
    }
`;