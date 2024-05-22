import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";

const Pagination = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.workouts);
  const page = useSelector((state) => state.page);
  const { total, limit, pageSpread } = workouts;

  const btnIsDisabled = () => (page + 1) * limit >= total;
  function pageBtnStyle(page, p) {
    if (page + 1 === p) {
      if (p - 3 > 1 && pageSpread.length - p > 1)
        return "num--page current dots-left dots-right";
      if (pageSpread.length - p > 1 && p > 2)
        return "num--page current dots-right";
      if (p - 3 > 1) return "num--page current dots-left";
      return "num--page current";
    }
    if (page + 1 !== p) {
      if (p > 3 && p !== pageSpread.length) return "invisible";
      if (p === pageSpread.length && p < pageSpread.length - 1)
        return "num--page dots-left";
      if (p === 3 && pageSpread.length > 4 && page + 1 < 3)
        return "num--page dots-right";
      if (p <= 3 || p === pageSpread.length) return "num--page";
    }
  }
  return (
    <div className="page--btn--container">
      <button
        aria-label="previous page"
        type="button"
        className="prev--page"
        disabled={page <= 0}
        onClick={() => dispatch({ type: "PREV_PAGE" })}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      {pageSpread.map((p) => {
        return (
          <button
            aria-label={`go to page ${p}`}
            key={uuid()}
            className={pageBtnStyle(page, p)}
            onClick={() =>
              dispatch({ type: "GO_TO_PAGE_NUMBER", payload: p - 1 })
            }
          >
            {p}
          </button>
        );
      })}
      <button
        aria-label="next page"
        type="button"
        className="next--page"
        disabled={btnIsDisabled()}
        onClick={() => dispatch({ type: "NEXT_PAGE" })}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
