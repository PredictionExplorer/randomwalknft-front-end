import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Select,
  CircularProgress,
  MenuItem,
  FormControl,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import Offer from "components/Offer";

const PaginationOfferGrid = ({ loading, data }) => {
  const [collection, setCollection] = useState([]);
  const [perPage, setPerPage] = useState(20);
  const [curPage, setCurPage] = useState(1);

  useEffect(() => {
    setCollection(data);
  }, [data]);

  return (
    <>
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress color="secondary" />
        </Box>
      )}
      {data.length > 0 && (
        <>
          <Grid spacing={2} container>
            {collection
              .slice((curPage - 1) * perPage, curPage * perPage)
              .map((index) => (
                <Grid key={index} item xs={6} sm={4} md={3}>
                  <Offer offerId={index} />
                </Grid>
              ))}
          </Grid>
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
        </>
      )}
      {!loading && !data.length && (
        <Typography variant="h6">Nothing Found!</Typography>
      )}
    </>
  );
};

export default PaginationOfferGrid;
