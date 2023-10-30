import styled from "styled-components";

export const Container = styled.div`
  justify-content: space-around;
`;

export const Tab = styled.div`
  flex: 1;
  margin-top: 2vw;
  padding: 15px 15px 15px 15px;
  text-align: center;
  font-weight: bold;
  font-size: 15px;
  outline: 0;
  cursor: pointer;
  color: white;
  padding-left: 3.5vw;
  
  border-radius: 15px 15px 0  0 ;

  &:hover {
    border-bottom: 2px solid #4763E4;
  }

  &:active{
    border-bottom: 2px solid #4763E4;
  }

  &:after{
    border-bottom: 2px solid #4763E4;
  }

  @media (max-width: 768px) {
    margin-top: 20px;
    padding: 10px 20px 15px;
    font-size: 15px;
    border-bottom-width: 2px;
  }
`;

export const TabContainer = styled.div`
  display: flex;
`;

export const Whispers = styled.div`
  background-color: black; 
  padding: 30px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  top: 29px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

