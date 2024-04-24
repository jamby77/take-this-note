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
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  // const navigate = useNavigate();
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <CssBaseline enableColorScheme />
      <Header />
      <main>
        <Outlet />
      </main>
    </ClerkProvider>
  );
}

export default App;
