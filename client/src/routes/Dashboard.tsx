import { Link } from "react-router-dom";

export function DashboardPage() {
  return (
    <>
      <h1>Dashboard page</h1>
      <p>This is a protected page.</p>

      <ul>
        <li>
          <Link to="/dashboard/notes">Notes</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </>
  );
}
