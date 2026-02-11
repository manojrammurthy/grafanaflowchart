import React from 'react';
import { createTheme } from './createTheme.js';

const ThemeContext = React.createContext(createTheme());
ThemeContext.displayName = "ThemeContext";

export { ThemeContext };
//# sourceMappingURL=context.js.map
