import React from 'react';

import { Container, SearchWrapper, SearchInput, SearchIcon } from './styles';

const SideBar: React.FC = () => {
  return(
    <Container>
        <SearchWrapper>
        <SearchInput placeholder="Buscar no Ceferno" />
            <SearchIcon />
        </SearchWrapper>
    </Container>
  );
}

export default SideBar;