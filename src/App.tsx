import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, Box } from "@material-ui/core";

import { theme } from "config/styles";
import Web3ReactManager from "components/Web3ReactManager";
import NavBar from "components/NavBar";
import Routes from "routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3ReactManager>
        <Box flexDirection="column" display="flex">
          <BrowserRouter>
            <NavBar />
            <Routes />
          </BrowserRouter>
        </Box>
      </Web3ReactManager>
    </ThemeProvider>
  );
}

export default App;
