import { useSelector, useDispatch } from "react-redux";

const Search = () => {
  const loading = useSelector((state) => state.loader);
  const dispatch = useDispatch();
  const query = useSelector((state) => state.query);

  const handleChange = (e) => {
    dispatch({ type: "SET_QUERY", payload: e.target.value });
    dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 0 });
  };

  return (
    <form
      data-testid="search-form"
      className={loading ? "search--bar is--loading" : "search--bar"}
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="search" className="hidden">
        Search:
      </label>
      <input
        type="search"
        id="search"
        placeholder="🔎 type workout title"
        value={query}
        onChange={handleChange}
      ></input>
      {query ? (
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_QUERY", payload: "" })}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      ) : (
        ""
      )}
    </form>
  );
};

export default Search;
