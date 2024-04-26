import { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import {
  alpha,
  AppBar,
  Box,
  Container,
  InputBase,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNotes } from "../providers/UseNotes.tsx";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  flexGrow: 0.5, // for search box
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export function Header() {
  const { onNotesSearch, currentSearch } = useNotes();
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onNotesSearch(e.target.value);
  };
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="p"
            sx={{
              mr: 2,
              display: { xs: "none", md: "block" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
              flexGrow: 0,
              textTransform: "uppercase",
              width: "calc(250px - 16px)",
            }}
          >
            <Link to={"/"} style={{ color: "#fff", textDecoration: "none" }}>
              Take This Note
            </Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "block", md: "flex" },
              justifyContent: "center",
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={currentSearch}
                onChange={handleSearch}
              />
            </Search>
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", md: "flex" },
              marginLeft: { xs: 0, md: 10 },
              width: "calc(250px - 80px)", // width+margin = 250px
              justifyContent: "flex-end",
            }}
          >
            <SignedIn>
              <UserButton afterSignOutUrl="/sign-in" />
            </SignedIn>
            <SignedOut>
              <Link to="/sign-in">Sign In</Link>
            </SignedOut>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
