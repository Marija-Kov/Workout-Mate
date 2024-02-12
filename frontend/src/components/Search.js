import { useSelector, useDispatch } from "react-redux";
import { useSearch } from "../hooks/useSearch";

export default function Search() {
  const { loading } = useSelector((state) => state.workout);
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page);
  const query = useSelector((state) => state.query);
  const { search } = useSearch();

  const handleSearch = async (e) => {
    e.preventDefault();
    await search(query, page);
  };

  const handleChange = (e) => {
    dispatch({ type: "SET_QUERY", payload: e.target.value });
    dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 0 });
  };

  return (
    <form
      data-testid="search-form"
      className={loading ? "search--bar is--loading" : "search--bar"}
      onSubmit={handleSearch}
    >
      <label htmlFor="search" className="hidden">
        Search:
      </label>
      <input
        type="search"
        id="search"
        placeholder="type workout title"
        value={query}
        onChange={handleChange}
      ></input>
      <button disabled={loading}>
        <span className="material-symbols-outlined">search</span>
      </button>
    </form>
  );
}
