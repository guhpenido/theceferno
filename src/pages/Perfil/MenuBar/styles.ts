import styled, { css } from 'styled-components';
import {
IconSearch,
WhisperIcon,
IconEmail,
ConfigIcon,
BellIcon } from '../styles/Icons';

export const Container = styled.div`    
    display: none;

    @media(min-width: 500px) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        position: sticky;
        top: 0;
        left: 0;
        padding: 9px 19px 20px;
        max-height: 100vh;
        overflow-y: auto;
    }
`;

export const TopSide = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;

    @media(min-width: 1280px) {
        align-items: flex-start;
    }
`;

export const Logo = styled.div`
    width: 41px;
    height: 41px;
    border-radius: 58px;
    border: 1.5px solid #4763E4;
    background: url(<path-to-image>),
    lightgray 50% / cover no-repeat;

> path {
    fill: #4763E4;
}
    margin-bottom: 20px;
`;

export const MenuButton = styled.button `
    display: flex;
    align-items: center;
    flex-shrink: 0;
    background: #000;
    color: #d9d9d9;
    border: 0;

> span {
    display: none;
}

    @media(min-width: 1280px) {
        > span {
            display: inline;
            margin-left: 19px;
            font-weight: bold;
            font-size: 19px;
        }

        padding-right: 20px;
        padding-left: 10px;
    }

    padding: 8.25px 0;
    outline: 0;

    & + button {
        margin-top: 16.5px;
    }
    
    & + button:last-child {
        margin-top: 33px;
        width: 40px;
        height: 40px;

    > span {
        display: none;
    }

    @media(min-width: 1280px) {
        width: 100%;
        height: unset;

    > span {
        display: inline;
        }
    }
    }

    cursor: pointer;
    border-radius: 25px;

    &:hover {
        background: #00003d;
    }

    &:hover, &.active {
        span, svg {
            color: #4763E4;
            fill: #4763E4;
        }
    }
`;

const iconCSS = css`
    flex-shrink: 0;
    width: 30px;
    height:30px;
`;


export const SearchIcon = styled(IconSearch)`${iconCSS}`;
export const IconWhisper = styled(WhisperIcon)`${iconCSS}`;
export const IconBell = styled(BellIcon)`${iconCSS}`;
export const EmailIcon = styled(IconEmail)`${iconCSS}`;
export const IconConfig = styled(ConfigIcon)`${iconCSS}`;

export const BotSide = styled.div`
    margin-top: 20px;
    display: flex;
    align-items: center;
`;
export const Avatar = styled.div `
    width: 39px;
    height: 39px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #7a7a7a;
    align-items: center;
`;
export const ProfileData = styled.div `
    display: none;
    color: #d9d9d9;

    @media(min-width: 1280px) {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        font-size: 14px;

    > span {
        color: #7a7a7a;
    }
    }
`;