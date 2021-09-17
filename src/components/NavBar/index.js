import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Chip,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import NAV_SECTIONS from "config/nav";
import useStyles from "config/styles";
import { formatAddress } from "utils/web3";

const NavBar = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 768
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const renderWalletButton = () => {
    const wallet = null;
    return wallet ? (
      <Chip
        variant="outlined"
        color="secondary"
        label={formatAddress(wallet)}
      />
    ) : (
      <Button
        variant="outlined"
        color="secondary"
        onClick={(e) => {
          console.log(e);
        }}
      >
        Connect To Wallet
      </Button>
    );
  };

  const renderDesktop = () => {
    return (
      <Toolbar>
        {NAV_SECTIONS.map(
          (nav, i) =>
            !nav.auth && (
              <Box ml={3} key={i}>
                <Link className={classes.navItem} to={nav.route}>
                  {nav.title}
                </Link>
              </Box>
            )
        )}
        <div className={classes.toolbarButtons}>{renderWalletButton()}</div>
      </Toolbar>
    );
  };

  const renderMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
          aria-label="menu"
          aria-haspopup="true"
          edge="start"
          color="inherit"
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
          <List>
            {NAV_SECTIONS.map(
              (nav, i) =>
                !nav.auth && (
                  <ListItem key={i}>
                    <Link
                      className={classes.navItem}
                      to={nav.route}
                      onClick={handleDrawerClose}
                    >
                      {nav.title}
                    </Link>
                  </ListItem>
                )
            )}
          </List>
        </Drawer>

        <div className={classes.toolbarButtons}>{renderWalletButton()}</div>
      </Toolbar>
    );
  };

  return (
    <AppBar position="fixed">
      {mobileView ? renderMobile() : renderDesktop()}
    </AppBar>
  );
};

export default NavBar;
