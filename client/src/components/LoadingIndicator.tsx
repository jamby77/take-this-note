import { Backdrop, CircularProgress } from "@mui/material";

export const LoadingIndicator = () => {
  return (
    <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress />
    </Backdrop>
  );
};
