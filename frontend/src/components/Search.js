import { useSelector, useDispatch } from "react-redux";
import { useSearch } from "../hooks/useSearch";

export default function Search() {
  const { loading } = useSelector(state => state.workout);
  const dispatch = useDispatch();
  const page = useSelector(state => state.page);
  const query = useSelector(state => state.query);
  const { search } = useSearch();

  const handleSearch = async (e) => {
    e.preventDefault();
    await search(query, page);
  };

  return (
    <form aria-label="search bar" className={loading ? "search--bar is--loading" : "search--bar"} onSubmit={handleSearch}>
      <input
        aria-label="search input"
        type="search"
        placeholder="search workouts..."
        value={query}
        onChange={(e) => {
          dispatch({type: "SET_QUERY", payload: e.target.value});
       }}
        disabled={loading}
      ></input>
      <button aria-label="search button" disabled={loading}>
        <span className="material-symbols-outlined">search</span>
      </button>
    </form>
  );
}
