import styled from "styled-components";
import Button from "../Button";


export const Container = styled.div `
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Banner = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: min(33vw, 199px);
  padding: 60px 0 100px;
  background: #4763E4;
  position: relative;
`;

export const Avatar = styled.div`
  width: max(45px, min(135px, 22vw));
  height: max(45px, min(135px, 22vw));
  border: 3.75px solid #000;
  background: #7a7a7a;
  border-radius: 50%;
  bottom: -30px;
  left: 15px;
  position: absolute;
`;

export const ProfileData = styled.div`
  padding: min(calc(10vw + 7px), 67px) 16px 0;
  display: flex;
  flex-direction: column;
  position: relative;


  > h1 {
    font-weight: bold;
    font-size: 19px;
    text-align: left;
    margin-top: -20px;
    color: #d9d9d9;
  }

  > h2 {
    font-weight: normal;
    font-size: 15px;
    text-align: left;
    color: #7a7a7a;
  }

  > p {
    font-size: 15px;
    margin-top: 10px;
    color: #d9d9d9;
    margin-left: auto; ; /* Coloca o parágrafo no lado direito */
    padding: 0 16px; /* Espaçamento interno para telas menores */

    @media (min-width: 768px) {
      font-size: 15px;
      margin-top: -50px; /* Mantenha o valor para telas maiores */
    }
  }
`;

export const EditButton = styled(Button)`
  position: absolute;
  top: calc(100% + 10px);
  right: 7px;
  padding: 4px 16px;
  font-size: 13px;

  @media (min-width: 320px) {
    top: calc(80% + 2px);
    padding: 5px 15px;
    font-size: 15px;
    border-radius: 25px;
  }
`;

export const Tags = styled.div`
  display:flex;
  justifyContent: 'space-between';
  align-items: center; 
  margin: 0;
`;

export const Institution = styled.div`
  background-color: #f0d447;
  border: 3px solid #b59803;
  height: 5vh; 
  width: 8vw;
  text-align: center; 
  border-radius: 10px;
`;

export const Course = styled.div`
  background-color: #62b038;
  border: 3px solid #134a05;  
  margin-left: 2vw;
  height: 5vh; 
  width: 8vw;
  text-align: center; 
  border-radius: 10px;
`;



