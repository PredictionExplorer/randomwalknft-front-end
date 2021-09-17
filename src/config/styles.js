import { createTheme, makeStyles } from "@material-ui/core/styles";

export const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#151814",
    },
    secondary: {
      main: "#FFB186",
    },
    text: {
      secondary: "#F68671",
    },
    background: {
      default: "#151814",
    },
  },
  typography: {
    fontFamily: "Inter",
  },
});

const useStyles = makeStyles(
  (theme) => ({
    root: {
      paddingTop: theme.spacing(8),
      overflow: "hidden",
      lineHeight: 1,
    },
    paper: {
      margin: theme.spacing(1),
    },
    gridContainer: {
      padding: theme.spacing(8),
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(6),
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3),
      },
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2),
      },
      paddingBottom: 0,
    },
    salesImage: {
      width: "60%",
      margin: "0 auto",
      paddingBottom: theme.spacing(8),
      [theme.breakpoints.down("md")]: {
        paddingBottom: theme.spacing(6),
      },
      [theme.breakpoints.down("sm")]: {
        paddingBottom: theme.spacing(3),
      },
      [theme.breakpoints.down("xs")]: {
        paddingBottom: theme.spacing(2),
      },
    },
    salesHeader: {
      [theme.breakpoints.down("sm")]: {
        fontSize: "3rem",
      },
    },
    salesSection: {
      padding: theme.spacing(8),
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(6),
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3),
      },
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2),
      },
      paddingLeft: 0,
      paddingRight: 0,
    },
    salesCard: {
      backgroundColor: "#1E2525",
      borderRadius: "18px",
      boxShadow: "10px 10px #000",
      padding: theme.spacing(3),
      maxWidth: 320,
      margin: "0 auto",
    },
    salesTitle: {
      backgroundColor: "#2F3833",
      borderRadius: 14,
      padding: "0.5rem",
    },
    salesButton: {
      textDecoration: "underline",
      marginTop: theme.spacing(8),
    },
    salesInfo: {
      marginTop: theme.spacing(8),
      color: "#E6AEA8",
    },
    viewButton: {
      color: "#fff",
      backgroundColor: "#FF6340",
      borderRadius: 70,
      padding: "0.75rem 2.5rem",
      fontSize: "125%",
    },
    navItem: {
      color: "#fff",
      textDecoration: "none",
      textTransform: "uppercase",
    },
    toolbarButtons: {
      marginLeft: "auto",
    },
    faqCard: {
      padding: "1rem",
      marginBottom: "2rem",
      backgroundColor: "#000",
      borderRadius: 18,
      boxShadow: "8px 8px #1E2525",
    },
    footer: {
      textAlign: "center",
    },
    address: {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    socialButtons: {
      display: "flex",
      justifyContent: "center",
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  }),
  { index: 1 }
);

export default useStyles;
