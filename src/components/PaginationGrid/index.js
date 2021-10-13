import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Select,
  CircularProgress,
  MenuItem,
  FormControl,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import NFT from "components/NFT";

const PaginationGrid = ({ loading, data }) => {
  const [nftId, setNftId] = useState("");
  const [searchId, setSearchId] = useState(null);
  const [searchResult, setSearchResult] = useState(false);
  const [collection, setCollection] = useState([]);
  const [perPage, setPerPage] = useState(20);
  const [curPage, setCurPage] = useState(1);

  const handleSearchChange = async (e) => {
    setNftId(e.target.value);
    if (!e.target.value) {
      setSearchId(null);
      setSearchResult(false);
    }
  };

  const handleSearch = async () => {
    setSearchId(nftId);
    setSearchResult(collection.includes(nftId));
  };

  useEffect(() => {
    setCollection(data);
  }, [data]);

  return (
    <>
      <Box display="flex" pb={4} justifyContent="flex-end">
        <TextField
          variant="filled"
          placeholder="Enter NFT Id"
          style={{ marginRight: 10 }}
          color="secondary"
          value={nftId}
          onChange={handleSearchChange}
        />
        <Button variant="outlined" onClick={handleSearch}>
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
          <Grid spacing={2} container>
            {searchId ? (
              !searchResult ? (
                <Grid item>
                  <Typography variant="h4">Nothing Found!</Typography>
                </Grid>
              ) : (
                <Grid item xs={6} sm={4} md={3}>
                  <NFT tokenId={searchId} />
                </Grid>
              )
            ) : (
              collection
                .slice((curPage - 1) * perPage, curPage * perPage)
                .map((index) => (
                  <Grid key={index} item xs={6} sm={4} md={3}>
                    <NFT tokenId={index} />
                  </Grid>
                ))
            )}
          </Grid>
          {!searchId && (
            <Box display="flex" justifyContent="center" py={3}>
              <FormControl style={{ minWidth: 120 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={perPage}
                  onChange={(e) => setPerPage(e.target.value)}
                >
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>

              <Pagination
                page={curPage}
                onChange={(e, page) => setCurPage(page)}
                count={Math.ceil(collection.length / perPage)}
              />
            </Box>
          )}
        </>
      )}
      {!loading && !data.length && (
        <Typography variant="h4">Nothing Found!</Typography>
      )}
    </>
  );
};

export default PaginationGrid;
