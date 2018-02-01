import React from 'react';
import { withTheme } from 'react-theme-provider';

const Header = ({ theme }) => <div>{theme.primaryColor}</div>;

export default withTheme(Header);
