import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { App } from "./App";
import GlobalStyle from "./GlobalStyles";

const DEFAULT_THEME = {
  accentColor: "#7F85F5",
  accentColorHover: "#5B5FC7",
  containerColor: "#2e3039",
  btnBgColor: "#4e5973",
};

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={DEFAULT_THEME}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
);
