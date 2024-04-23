import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Auth } from "./Auth.tsx";

export function Header() {
  return (
    <header className="header">
      <div>
        <div>
          <h1>Take This Note</h1>
        </div>
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <SignedIn>
          <Auth />
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in">Sign In</Link>
        </SignedOut>
      </div>
    </header>
  );
}
