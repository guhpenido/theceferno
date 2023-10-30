import styled from 'styled-components';
import { IconSearch } from '../styles/Icons';

export const Container = styled.div`
    display: none;

    @media (min-width: 1000px) {
    display: flex;
    flex-direction: column;
    width: min(200px, 100%);
}
`;
export const SearchWrapper = styled.div`
    padding: 10px 24px;
    width: min(399px, 100%);
    position: fixed;
    top: 0;
    z-index: 2;
    background: #000;
    max-height: 57px;
`;

export const SearchInput = styled.input`
    width: 100%;
    height: 39px;
    font-size: 14px;
    color: #d9d9d9;
    padding: 0 10px 0 52px;
    border-radius: 19.5px;
    background:  #202327;
    border: 0;

    &::placeholder {
        color: #7a7a7a;
    }

    ~ svg {
        position: relative;
        top: -33px;
        margin-left: 10px;
        z-index: 1;
        transition: 180ms ease-in-out;
    }

    outline: 0;

    &:focus {
        border: 1px solid #4763E4;

        ~ svg {
        fill: #4763E4;
        }
    }
`;

export const SearchIcon = styled(IconSearch)`
    width: 27px;
    height: 27px;
    fill: #4763E4;
`;

export const ContainerLoadedPost = styled.div`
::-webkit-scrollbar {
    display: none;
  }
`

