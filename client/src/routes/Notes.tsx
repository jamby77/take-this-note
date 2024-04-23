import { Link } from "react-router-dom";

export function NotesPage() {
  return (
    <>
      <h1>Notes page</h1>
      <p>This is a protected page.</p>

      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </>
  );
}
