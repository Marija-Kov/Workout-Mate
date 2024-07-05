import { useDispatch, useSelector } from "react-redux";

const Pagination = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.workouts);
  const currentPage = useSelector((state) => state.page);
  const { total, limit, pageSpread } = workouts;

  function pageBtnStyle(currentPage, aPage) {
    if (currentPage === aPage) {
      if (aPage - 3 > 1 && pageSpread.length - aPage > 1)
        return "num--page current dots-left dots-right";
      if (pageSpread.length - aPage > 1 && aPage > 2)
        return "num--page current dots-right";
      if (aPage - 3 > 1) return "num--page current dots-left";
      return "num--page current";
    }
    if (aPage === 3 && pageSpread.length > 4 && currentPage < 3)
      return "num--page dots-right";
    if (aPage <= 3 || aPage === pageSpread.length) return "num--page";
    return "invisible";
  }
  return (
    <div className="page--btn--container">
      <button
        aria-label="previous page"
        type="button"
        className="prev--page"
        disabled={currentPage <= 1}
        onClick={() => dispatch({ type: "PREV_PAGE" })}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      {pageSpread.map((aPage) => {
        return (
          <button
            aria-label={`go to page ${aPage}`}
            key={Math.random() * 10e7}
            className={pageBtnStyle(currentPage, aPage)}
            onClick={() =>
              dispatch({ type: "GO_TO_PAGE_NUMBER", payload: aPage })
            }
          >
            {aPage}
          </button>
        );
      })}
      <button
        aria-label="next page"
        type="button"
        className="next--page"
        disabled={currentPage * limit >= total}
        onClick={() => dispatch({ type: "NEXT_PAGE" })}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
