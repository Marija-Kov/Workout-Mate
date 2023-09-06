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

  const handleChange = (e) => {
    if(!loading){
      dispatch({type: "SET_QUERY", payload: e.target.value});
      dispatch({type: "GO_TO_PAGE_NUMBER", payload: 0})  
    } else {
      return
    }
  }

  return (
    <form aria-label="search bar" className={loading ? "search--bar is--loading" : "search--bar"} onSubmit={handleSearch}>
      <input
        aria-label="search input"
        type="search"
        placeholder="search workouts..."
        value={query}
        onChange={handleChange}
      ></input>
      <button aria-label="search button" disabled={loading}>
        <span className="material-symbols-outlined">search</span>
      </button>
    </form>
  );
}
