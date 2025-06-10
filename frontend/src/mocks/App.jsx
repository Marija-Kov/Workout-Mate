import { useSelector } from "react-redux";

export default function App() {
  const { success, error } = useSelector((state) => state.flashMessages);
  return (
    <>
      {error && (
        <div role="alert" className="error flashMessage">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div role="alert" className="success flashMessage">
          <p>{success}</p>
        </div>
      )}
    </>
  );
}
