import styled, { css } from "styled-components";

export const Container = styled.div `
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  border-bottom: 1px solid #4763E4;
  max-width: 100%;
  flex-shrink: 0;
  max-width: 100%;
  border-radius: 5px;
  border: 2px solid #4763e4;
  background: rgba(71, 99, 228, 0.2);
  margin-bottom: 15px;
`;
export const Body = styled.div`
  display: flex;
  margin-top: 3px;
  position: relative;
`;

export const Avatar = styled.div`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #7a7a7a;
  position: absolute;
  top: 0;
  left: 0;
`;
export const Content = styled.div `
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 2px;
    padding-left: 59px; 
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  white-space: nowrap;

  > strong {
    margin-left: 5px;
    color: #d9d9d9;
  }

  > span {
    color: #7a7a7a;
  }

  > strong,
  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 2px;
  }
`;
export const Posts = styled.div`
  font-size: 14px;
  margin-top: 4px;
  color: #d9d9d9;
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
