import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import { theme } from "config/styles";
import Web3ReactManager from "components/Web3ReactManager";
import NavBar from "components/NavBar";
import Routes from "routes";

import "assets/fonts/index.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3ReactManager>
        <BrowserRouter>
          <NavBar />
          <Routes />
        </BrowserRouter>
      </Web3ReactManager>
    </ThemeProvider>
  );
}

export default App;
