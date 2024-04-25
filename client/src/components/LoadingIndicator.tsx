import { Box, CircularProgress } from "@mui/material";

export const LoadingIndicator = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "absolute",
        width: "100vw",
        backgroundColor: "transparent",
        top: 0,
        left: 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
};
