import useClerkQuery from "../../useClerkQuery.ts";

export function NotesList({}) {
  const { status, error, data } = useClerkQuery("api/notes");
  return (
    <div>
      {status === "pending" && <div>Loading...</div>}
      {status === "error" && <div>Error: {error.message}</div>}
      {status === "success" && data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
