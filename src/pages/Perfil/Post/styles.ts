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
  background: #111111;
  margin-bottom: 15px;
  align-items: flex-start;
  box-sizing: border-box;
  margin-top: 15px;
  width: 100%;
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
  width: 100%;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #7a7a7a;
  top: 10px;
  left: 10px;
  margin-right: 10px;
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
  height: auto;
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
  text-align: left;
  font-size: 15px;
  margin-top: 2px;
  color: #d6d6d6;
  font-weight: normal;
`;

export const Postdays = styled.div`
  color: #d6d6d6;
  float: right;

  > div {
    color: #7a7a7ac7;
  }
`;

export const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;

  @media (min-width: 330px) {
   
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
  align-items: center; 
  display: flex;
  flex-direction: row; 
  width: fit-content; 
  margin-left: 35px;
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
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  height: fit-content; 
  gap: 5px;

  > div:nth-child(1) {
    font-size: 15px;
    color: white;
  }

  > div:nth-child(2) {
    color: #7a7a7ac7;
  }
`;

export const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

`

export const HeaderNameMentioned = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  width: fit-content; 
  height: fit-content; 

  > div:nth-child(1) {
    font-size: 15px;
    color: white;
  }
  > div:nth-child(2) {
    color: white;
    font-size: 13px;
  }
`;

export const NomeHeaderTw = styled.div`
  color: white;
  font-size: 15px;
  border: solid 1px black;
  width: 10%;
`;


