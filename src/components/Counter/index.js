import { Box, Typography } from "@material-ui/core";
import { isMobile } from "react-device-detect";

const Counter = ({ days, hours, minutes, seconds, completed }) => {
  const counterWrapper = {
    display: "flex",
    flexDirection: isMobile ? "column" : "rpw",
    justifyContent: isMobile ? "center" : "space-between",
    alignItems: "center",
  };

  const counterItem = {
    width: isMobile ? "80%" : "20%",
    padding: "8px 0",
    border: "2px solid #F4BFFF",
    boxSizing: "border-box",
    boxShadow: "0px 0px 10px #C676D7",
    marginBottom: isMobile ? 24 : 0,
  };

  const padZero = (x) => x.toString().padStart(2, "0");

  if (completed) {
    return <></>;
  } else {
    return (
      <Box style={counterWrapper}>
        <Box style={counterItem}>
          <Typography align="center" component="p" variant="h4" color="primary">
            {padZero(days)}
          </Typography>
          <Typography align="center" variant="body1">
            Days
          </Typography>
        </Box>
        <Box style={counterItem}>
          <Typography align="center" component="p" variant="h4" color="primary">
            {padZero(hours)}
          </Typography>
          <Typography align="center" variant="body1">
            Hours
          </Typography>
        </Box>
        <Box style={counterItem}>
          <Typography align="center" component="p" variant="h4" color="primary">
            {padZero(minutes)}
          </Typography>
          <Typography align="center" variant="body1">
            Minutes
          </Typography>
        </Box>
        <Box style={counterItem}>
          <Typography align="center" component="p" variant="h4" color="primary">
            {padZero(seconds)}
          </Typography>
          <Typography align="center" variant="body1">
            Seconds
          </Typography>
        </Box>
      </Box>
    );
  }
};

export default Counter;
