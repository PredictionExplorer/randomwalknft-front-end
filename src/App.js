import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, Box } from "@material-ui/core";

import { theme } from "config/styles";
import NavBar from "components/NavBar";
import Routes from "routes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box flexDirection="column" display="flex">
        <BrowserRouter>
          <NavBar />
          <Routes />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}
export default App;
