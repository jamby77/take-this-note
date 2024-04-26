import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import { Header } from "./components/Header.tsx";
import { Outlet } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { NotesProvider } from "./providers/NotesProvider.tsx";

const queryClient = new QueryClient();
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <NotesProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Header />
            <main>
              <Outlet />
            </main>
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </NotesProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
