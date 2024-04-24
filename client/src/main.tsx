import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IndexPage } from "./routes/IndexPage.tsx";
import { SignInPage } from "./routes/SignIn.tsx";
import { SignUpPage } from "./routes/SignUp.tsx";
import { DashboardLayout } from "./DashboardLayout.tsx";
import { DashboardPage } from "./routes/Dashboard.tsx";
import { NotesPage } from "./routes/Notes.tsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/notes", element: <NotesPage /> },
        ],
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
