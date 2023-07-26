// import styled from "styled-components";


// export const Container = styled.div`
//   justify-content: space-around;
// `;

// export const Tab = styled.div `
//   flex: 1;
//   margin-top: 30px;
//   padding: 11px 35px 15px;
//   text-align: center;
//   font-weight: bold;
//   font-size: 15px;
//   outline: 0;
//   cursor: pointer;
//   color: var(--ceferno);
//   padding-left: 35px;
//   border-bottom: 2px solid var(--ceferno);
  


//   &:hover {
//     background: var(--ceferno-dark-hover);
//   }
// `;

// export const TabContainer = styled.div`
//   display: flex;
// `;

// export const Whispers = styled.div`
//   padding: 30px;
//   display: flex;
//   flex-direction: column;
//   flex-shrink: 0;
//   top: 29px;
// `;

import styled from "styled-components";

export const Container = styled.div`
  justify-content: space-around;
`;

export const Tab = styled.div`
  flex: 1;
  margin-top: 2vw;
  padding: 1.5vw 3.5vw 2vw;
  text-align: center;
  font-weight: bold;
  font-size: 1.5vw;
  outline: 0;
  cursor: pointer;
  color: var(--ceferno);
  padding-left: 3.5vw;
  border-bottom: 0.15vw solid var(--ceferno);

  &:hover {
    background: var(--ceferno-dark-hover);
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
  padding: 30px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  top: 29px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;
