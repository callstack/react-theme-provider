import React from 'react';
import styled from 'styled-components';
import { withTheme } from './theming';

const Header = ({ theme }) => (
  <Container textColor={theme.textColor} background={theme.backgroundColor2}>
    react-theme-provider
  </Container>
);

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  color: ${props => props.textColor};
  background-color: ${props => props.background};
  padding: 4rem;
  text-align: center;
  font-size: 2rem;
`;

export default withTheme(Header);
