import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  Container,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import NAV_SECTIONS from "config/nav";
import useStyles from "config/styles";
import ConnectWalletButton from "components/ConnectWalletButton";
import { useActiveWeb3React } from "hooks/web3";

import logoImage from "assets/svg/logo.svg";

const NavBar = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const { account } = useActiveWeb3React();

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

  const renderDesktop = () => {
    return (
      <Toolbar>
        <img src={logoImage} alt="RandomWalkNFT" />
        {NAV_SECTIONS.map(
          (nav, i) =>
            (!nav.auth || account) && (
              <Box ml={3} key={i}>
                <Link className={classes.navItem} to={nav.route}>
                  {nav.title}
                </Link>
              </Box>
            )
        )}
        <ConnectWalletButton />
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

        <ConnectWalletButton />
      </Toolbar>
    );
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Container maxWidth="lg">
        {mobileView ? renderMobile() : renderDesktop()}
      </Container>
    </AppBar>
  );
};

export default NavBar;
