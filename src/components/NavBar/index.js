import React, { useState, useEffect } from "react";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  Container,
  Link,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import NAV_SECTIONS from "config/nav";
import useStyles from "config/styles";
import ConnectWalletButton from "components/ConnectWalletButton";
import { useActiveWeb3React } from "hooks/web3";

import logoImage from "assets/logo.svg";

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
      return window.innerWidth < 992
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
      <Toolbar disableGutters>
        <img src={logoImage} alt="RandomWalkNFT" />
        {NAV_SECTIONS.map(
          (nav, i) =>
            (!nav.auth || account) && (
              <Box ml={3} key={i}>
                <Link className={classes.navItem} href={nav.route}>
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
        <img src={logoImage} alt="RandomWalkNFT" />
        <IconButton
          aria-label="menu"
          aria-haspopup="true"
          edge="start"
          color="inherit"
          onClick={handleDrawerOpen}
          style={{ marginLeft: "auto" }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
          <List className={classes.drawerList}>
            <ListItem>
              <ConnectWalletButton isMobileView />
            </ListItem>
            {NAV_SECTIONS.map(
              (nav, i) =>
                !nav.auth && (
                  <ListItem key={i} style={{ justifyContent: "center" }}>
                    <Link
                      className={classes.navItem}
                      href={nav.route}
                      onClick={handleDrawerClose}
                    >
                      {nav.title}
                    </Link>
                  </ListItem>
                )
            )}
            <ListItem style={{ justifyContent: "center" }}>
              <Link
                className={classes.navItem}
                href="/my-nfts"
                onClick={handleDrawerClose}
              >
                My NFTs
              </Link>
            </ListItem>
            <ListItem style={{ justifyContent: "center" }}>
              <Link
                className={classes.navItem}
                href="/my-offers"
                onClick={handleDrawerClose}
              >
                My Offers
              </Link>
            </ListItem>
          </List>
        </Drawer>
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
