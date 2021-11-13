import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Grid,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import useStyles from "config/styles";
import NFT from "components/NFT";

const PaginationGrid = ({ loading, data }) => {
  const [nftId, setNftId] = useState("");
  const [searchId, setSearchId] = useState(null);
  const [searchResult, setSearchResult] = useState(false);
  const [collection, setCollection] = useState([]);
  const [perPage] = useState(15);
  const [curPage, setCurPage] = useState(1);
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();

  const handleSearchChange = async (e) => {
    setNftId(e.target.value);
    if (!e.target.value) {
      setSearchId(null);
      setSearchResult(false);
    }
  };

  const handleSearch = async () => {
    setSearchId(nftId);
    setSearchResult(collection.includes(parseInt(nftId)));
  };

  useEffect(() => {
    setCollection(data);
  }, [data]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurPage(page);
  }, [location]);

  return (
    <Box mt={4}>
      <Box className={classes.searchBar}>
        <TextField
          variant="filled"
          placeholder="Enter NFT ID"
          className={classes.searchField}
          color="secondary"
          value={nftId}
          onChange={handleSearchChange}
        />
        <Button
          size="large"
          variant="contained"
          color="primary"
          className={classes.searchButton}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress color="secondary" />
        </Box>
      )}
      {data.length > 0 && (
        <>
          <Grid spacing={4} container>
            {searchId ? (
              !searchResult ? (
                <Grid item>
                  <Typography variant="h6" align="center">
                    Nothing Found!
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={6} sm={4}>
                  <NFT tokenId={searchId} />
                </Grid>
              )
            ) : (
              collection
                .slice((curPage - 1) * perPage, curPage * perPage)
                .map((index) => (
                  <Grid key={index} item xs={12} sm={6} md={4}>
                    <NFT tokenId={index} />
                  </Grid>
                ))
            )}
          </Grid>
          {!searchId && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                color="primary"
                page={curPage}
                onChange={(e, page) =>
                  history.push(`${location.pathname}?page=${page}`)
                }
                count={Math.ceil(collection.length / perPage)}
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
      {!loading && !data.length && (
        <Typography variant="h6" align="center">
          Nothing Found!
        </Typography>
      )}
    </Box>
  );
};

export default PaginationGrid;
