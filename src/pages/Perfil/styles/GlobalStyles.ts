import { createGlobalStyle } from "styled-components";

export default createGlobalStyle` 
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: #d9d9d9;
}
html, body, #root {
    max-height: 100vh;
    max-width: 100vw;
    height: 100%;
    width: 100%;
}

*, button, input {
    border: 0;
    background: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
html {
    background: #000;
}
:root {
    --primary: #000;
    --secondary: #15181c;
    --search: #202327;
    --white: #d9d9d9;
    --gray: #7a7a7a;
    --outline:#4763E4;
    --retweet: #00c06b;
    --like: #e8265e;
    --ceferno: #4763E4;
    --ceferno-dark-hover: #00003d;
    --ceferno-light-hover: #00276c;
}
`;
