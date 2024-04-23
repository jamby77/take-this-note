import "./App.css";
import { Header } from "./components/Header.tsx";
import { Outlet } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  // const navigate = useNavigate();
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Header />
      <main>
        <Outlet />
      </main>
    </ClerkProvider>
  );
}

export default App;
