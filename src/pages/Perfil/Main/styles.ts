import styled, { css } from "styled-components";
import {
ArrowIcon,
IconHome,
IconSearch,
WhisperIcon,
IconEmail,
ConfigIcon}  from "../styles/Icons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: min(700px, 100%);
  height: 100vh;

  @media (min-width: 500px) {
    border-left: 1px solid #4763E4;
    border-right: 1px solid #4763E4;
  }
  @media screen and (min-width: 501px) and (max-width: 923px) {
    width: 70%; 
  }

  @media screen and (min-width: 924px)  and (max-width: 1090px) {
    width: 45%; 
  }

  @media screen and (min-width: 1090px)  and (max-width: 1279px) {
    width: 50%; 
  }
`;

export const ContainerTopo = styled.div`
  display: flex;
  flex-direction: column;
  width: min(601px, 100%);

  @media (min-width: 500px) {
    border-left: 1px solid #4763E4;
    border-right: 1px solid #4763E4;
  }
`;

export const Header = styled.div`
  z-index: 2;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  text-align: left;
  padding: 8px 0 9px 13px;

  > button {
    padding: 8px;
    border-radius: 50%;
    outline: 0;
    cursor: pointer;
    background: #000;
    border: 0;
    color: #ffffff;

    &:hover {
      background: #00003d;
    }
  }
`;

export const BackIcon = styled(ArrowIcon)`
  width: 24px;
  height: 24px;
  fill: #4763E4;
  
`;

export const ProfileInfo = styled.div`
  margin-left: 17px;
  display: flex;
  flex-direction: column;

  > strong {
    font-size: 19px;
    color: white;
  }
`;

export const BottomMenu = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  background: #000;
  width: 100%;
  border: 1px solid #111111;
  display: flex;
  justify-content: space-between;
  padding: 8px min(46px, max(10vw, 10px));

  @media (min-width: 923px) {
    display: none;
  }
  
`;

const iconCSS = css`
  width: 31px;
  height: 31px;
  cursor: pointer;
  fill:  #7a7a7a;

  &:hover,
  &.active {
    fill: #4763E4;
  }
`;

export const HomeIcon = styled(IconHome)`
  ${iconCSS}
`;
export const SearchIcon = styled(IconSearch)`
  ${iconCSS}
`;
export const Whisper = styled(WhisperIcon)`
  ${iconCSS}
`;
export const DmIcon = styled(IconEmail)`
  ${iconCSS}
`;
export const Config = styled(ConfigIcon)`
  ${iconCSS}
`;
