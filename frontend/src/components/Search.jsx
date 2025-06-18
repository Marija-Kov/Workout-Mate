import { forwardRef, memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Search = forwardRef((props, ref) => {
  const loading = useSelector((state) => state.loader);
  const dispatch = useDispatch();
  const query = useSelector((state) => state.query);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    dispatch({ type: "SET_QUERY", payload: e.target.value });
    dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 1 });
  };

  return (
    <form
      data-testid="search-form"
      className={loading.workouts ? "search--bar is--loading" : "search--bar"}
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="search" className="hidden">
        Search:
      </label>
      <input
        type="search"
        id="search"
        className={ isFocused ? "focused" : null }
        placeholder="🔎 type workout title"
        value={query}
        ref={ref}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
});

export default memo(Search);
