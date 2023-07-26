// import styled from "styled-components";
// import Button from "../Button";

// export const Container = styled.div `
//   display: flex;
//   flex-direction: column;
//   max-height: 100%;
//   overflow-y: auto;

//   ::-webkit-scrollbar {
//     display: none;
//   }
// `;

// export const Banner = styled.div`
//   flex-shrink: 0;
//   width: 100%;
//   height: min(33vw, 199px);
//   padding: 60px 0 100px;
//   stroke: var(--ceferno);
//   position: relative;
// `;

// export const Avatar = styled.div`
//   width: max(45px, min(135px, 22vw));
//   height: max(45px, min(135px, 22vw));
//   border: 3.75px solid var(--primary);
//   background: var(--gray);
//   border-radius: 50%;
//   bottom: max(-60px, -10vw);
//   bottom: -30px;
//   left: 15px;
//   position: absolute;
// `;

// export const ProfileData = styled.div`
//   padding: min(calc(10vw + 7px), 67px) 16px 0;
//   display: flex;
//   flex-direction: column;
//   position: relative;

//   > h1 {
//     font-weight: bold;
//     font-size: 19px;
//     text-align: left;
//     margin-top: -20px;

//   }

//   > h2 {
//     font-weight: normal;
//     font-size: 15px;
//     text-align: left;
//     color: var(--gray);

//   }

//   > p {
//     font-size: 12px;
//     margin-top: -60px;
//     margin-left: 200px;

//     @media(min-width: 768px){
//       top: 100px;
//       font-size: 12px;
//       margin-left: 230px;
//       margin-top: -40px;
//     }
// }
// `;

// export const EditButton = styled(Button) `
//   position: absolute;
//   top: 10px;
//   right: 7px;
//   padding: 4px 16px;
//   font-size: 13px;

//   @media (min-width: 320px) {
//     top: 70px;
//     padding: 5px 15px;
//     font-size: 15px;
//     border-radius: 25px;
//   }
// `;

import styled from "styled-components";
import Button from "../Button";

export const Container = styled.div`
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
  stroke: var(--ceferno);
  position: relative;
`;

export const Avatar = styled.div`
  width: max(45px, min(135px, 22vw));
  height: max(45px, min(135px, 22vw));
  border: 3.75px solid var(--primary);
  background: var(--gray);
  border-radius: 50%;
  bottom: -30px;
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
  }

  > h2 {
    font-weight: normal;
    font-size: 15px;
    text-align: left;
    color: var(--gray);
  }

  > p {
    font-size: 12px;
    margin-top: -60px;
    margin-left: 200px;

    @media (min-width: 768px) {
      top: 100px;
      font-size: 12px;
      margin-left: 230px;
      margin-top: -50px;
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



