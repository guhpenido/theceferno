import styled from "styled-components";
import Button from "../Button";


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  max-width: 100%;
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
    margin-top: -10px;
    color: #d9d9d9;
    margin-left:15px;
  }

  > h2 {
    font-weight: normal;
    font-size: 15px;
    text-align: left;
    color: #7a7a7a;
    margin-top: 5px;
    margin-left:15px;
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
  display: grid;
  gap: 10px;
  grid-template-columns: auto auto;
  justify-content: left;
  margin: 10px 0 0 0;
  color: whitesmoke;
  text-align: left; 
`;

// const responsiveWidth = '5vw'; // Adjust this value as needed

// const ResponsiveTag = styled.div`
//   border: 3px solid rgb(71, 99, 228);
//   background-color: rgba(71, 99, 228, 0.2);
//   height: 5vh;
//   width: ${responsiveWidth};
//   text-align: center;
//   border-radius: 10px;

//   @media (max-width: 900px) {
//     width: 70%; // Take up full width on smaller screens
//     margin-bottom: 2px; // Add some spacing between tags
//   }

//   @media (min-width: 901px) {
//     width: 70%
//   }
// `;

export const Institution = styled.div`
  text-align: center;
  border-radius: 10px;
  font-size: 12px;
  padding: 5px 5px;
  margin-left:10px;
  color: #9f9d9d;
`;

export const Course = styled.div`
  padding: 5px 10px;
  display: inline-block;
  flex: 1 0 auto;
  width: max-content;
  box-sizing: border-box;
  border-radius: 15px;
  border-radius: 10px; 
  font-size: 12px;
  color: #9f9d9d;
`;

export const Following = styled.div`
  
  color: rgba(255, 255, 255, 0.757);

  span{
    color: whitesmoke;
    display: inline-block;
    flex: 1 0 auto;
    width: max-content;
    box-sizing: border-box;
    font-weight: bolder;
    margin-right: 5px;
  }
  
`;

export const Followers = styled.div`
  color: rgba(255, 255, 255, 0.757);

  span{
    color: whitesmoke;
    display: inline-block;
    flex: 1 0 auto;
    width: max-content;
    box-sizing: border-box;
    font-weight: bolder;
    margin-right: 5px;
  }
`;

export const Cabecalho = styled.div`
  z-index: 2;
  position: sticky;
  top: 0;
  background: #0c0c0c;
  display: flex;
  align-items: center;
  text-align: left;
  padding: 8px 0 9px 13px;
  border-bottom: 1px solid #4763E4;
  flex-direction: column; 

  > button {
    padding: 8px;
    border-radius: 50%;
    outline: 0;
    cursor: pointer;
    background: #000;
    border: 0;

    &:hover {
      background: #00003d;
    }
  }
`

export const Botao = styled.button`
    
    
    &[data-follow='true']{
      all: unset;
      padding: 5px 15px;
      display: inline-block;
      flex: 1 0 auto;
      width: max-content;
      box-sizing: border-box;
      border-radius: 15px;
      border: 2px solid #4763e4;
      margin-left: auto;
    }

    &[data-follow='false']{
      all: unset;
      padding: 5px 15px;
      display: inline-block;
      flex: 1 0 auto;
      width: max-content;
      box-sizing: border-box;
      border-radius: 15px;
      border: 2px solid #4763e4;
      background-color: rgba(71, 99, 228, 0.2);
      margin-left: auto;
    }

    &[data-follow='false']:hover {
      background-color: rgba(71, 99, 228, 0.5);
      cursor: pointer;
    }

    &[data-follow='true']:hover {
      background-color: rgba(255, 0, 0, 0.2);
      border: 2px solid #ff0000;
      cursor: pointer;
    }

`
