import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  border-bottom: 1px solid #4763e4;
  max-width: 100%;
  flex-shrink: 0;
  max-width: 100%;
  border-radius: 5px;
  border: 2px solid #4763e4;
  background: rgba(71, 99, 228, 0.2);
  margin-bottom: 15px;
  align-items: flex-start;
  box-sizing: border-box;
  margin-top: 15px;
`;

export const ImgConteiner = styled.img`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background: #7a7a7a;
  left: 10px;
  margin-right: 1em;
  align-items: left; 
`;
export const Body = styled.div`
  display: flex;
  margin-top: 3px;
  position: relative;
  flex-direction: column;
  text-align: center;
  align-items: center; 
`;

export const Avatar = styled.div`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #7a7a7a;
  top: 10px;
  left: 10px;
  margin-right: 1em;
  align-items: left; 
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2px;
  border: solid black 4px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: fit-content;
  font-size: 15px;
  color: #fff;

  > div:nth-child(5) {
    margin: 3px;
  }

  > strong {
    margin-left: 50px;
    color: #d9d9d9;
  }

  > span {
    color: #7a7a7a;
  }

  > strong,
  span {
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 2px;
    
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 10vh;
  font-size: 15px;
  color: #fff;

  > div:nth-child(5) {
    margin: 3px;
  }

  > strong {
    margin-left: 50px;
    color: #d9d9d9;
  }

  > span {
    color: #7a7a7a;
  }

  > strong,
  span {
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 2px;
  }
`;
export const Posts = styled.div`
  font-size: 14px;
  margin-top: 4px;
  color: #d9d9d9;
  width: 300px;
`;

export const Postdays = styled.div`
  display: flex;
  justify-content: space-between;

  > div:nth-child(1) {
    color: white;
    left: 3em;
    position: relative;
  }
`;

export const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 11px auto 0;
  width: 100%;

  @media (min-width: 330px) {
    width: 63%;
  }

  > div {
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
`;

export const Status = styled.div`
  color: #d9d9d9;
  margin-left: 3em;
  align-items: center; 
  display: flex;
  flex-direction: row; 
  width: fit-content; 
`;

const IconCSS = css`
  width: 19px;
  height: 19px;
`;
export const CommentIcon = styled.div`
  ${IconCSS};
`;
export const RepublicationIcon = styled.div`
  ${IconCSS};
`;
export const LikeIcon = styled.div`
  ${IconCSS};
`;

export const ConteudoPostagens = styled.div`
  background-color: black;
  width: 100%;
  height: 100%;
`;

export const HeaderName = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: flex-start;
  align-content: center;
  height: fit-content; 

  > div:nth-child(1) {
    font-size: 15px;
    margin-left: -40px;
    color: white;
    margin-top: -50px;
    margin-bottom: 6px;
  }

  > div:nth-child(2) {
    margin-left: 10px;
    margin-top: -50px;
    color: white;
  }
`;

export const HeaderNameMentioned = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  width: fit-content; 
  height: fit-content; 
  margin-top: -60px;
  margin-left: 50px;

  > div:nth-child(1) {
    margin-right: 5px;
    font-size: 15px;
    color: white;
  }
  > div:nth-child(2) {
    color: white;
    font-size: 13px;
    margin-top: 8px;
    margin-left: 12px;
    margin-right: 13px;
  }
`;

export const NomeHeaderTw = styled.div`
  color: white;
  font-size: 15px;
  border: solid 1px black;
  width: 10%;
`;


