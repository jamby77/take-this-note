import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

export function IndexPage() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && userId) {
      navigate("/dashboard");
    }
  }, [isLoaded, userId, navigate]);
  return (
    <Container maxWidth="xl" sx={{ p: 6 }}>
      <Typography variant="h1" align="center">
        This is the index page
      </Typography>
      <Box
        component="ul"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-evenly",
          gap: 0.5,
          listStyle: "none",
          p: 6,
          m: 0,
        }}
      >
        <li>
          <Typography
            variant="button"
            noWrap
            component="p"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
              flexGrow: 0,
              textTransform: "uppercase",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            <Link style={{ color: "inherit", textDecoration: "none" }} to="/sign-up">
              Sign Up
            </Link>
          </Typography>
        </li>
        <li>
          <Typography
            variant="button"
            noWrap
            component="p"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
              flexGrow: 0,
              textTransform: "uppercase",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            <Link style={{ color: "inherit", textDecoration: "none" }} to="/sign-in">
              Sign In
            </Link>
          </Typography>
        </li>
      </Box>
    </Container>
  );
}
