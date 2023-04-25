import React from 'react'
import WorkoutDetails from './WorkoutDetails';
import { genSampleWorkouts } from '../../utils/test/genSampleWorkouts';
import Search from './Search';
import Pagination from "../../components/Pagination"
import WorkoutForm from "./WorkoutForm"

export default function Home() {
    const [isLoading, setIsloading] = React.useState(false);
    const { searchResults, resultsOnPage } = genSampleWorkouts();
    const [workouts, setWorkouts] = React.useState(resultsOnPage)
    const [query, setQuery] = React.useState("");
    const [addWorkoutForm, setAddWorkoutForm] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [pageSpread, setPageSpread] = React.useState([]);
    const limit = 3;
    const total = searchResults.length;
    React.useEffect(() => {
      spreadPages(total, limit);
    }, [total, limit]);

    const spreadPages = (t, l) => {
      const pagesNum = Math.ceil(t / l);
      let spread = [];
      for (let i = 1; i <= pagesNum; ++i) {
        spread.push(i);
      }
      setPageSpread(spread)
    };
    
    const logOutIfTokenExpired = () => {};
    const handleSearchChange = () => {};
    const handleSearch = () => {};
    const getItems = () => {};

    const flipPage = (num) => {
     setPage((prev) => {
       if (num === -1) return prev + num;
       if (num[0]) return prev + num[0];
       return num - 1;
     });
   };
    const hideForm = () => {};
    
  return (
    <div className="home--container" onClick={logOutIfTokenExpired}>
      <div className="home">
        <Search
          handleSearchChange={handleSearchChange}
          handleSearch={handleSearch}
          query={query}
          isLoading={isLoading}
        />

        <div aria-label="workouts" className="workouts--container">
          {workouts &&
            workouts.map((workout) => (
              <WorkoutDetails
                key={workout._id}
                id={workout._id}
                title={workout.title}
                reps={workout.reps}
                load={workout.load}
                createdAt={workout.createdAt}
                updatedAt={workout.updatedAt}
                page={page}
                getItems={getItems}
                spreadPages={spreadPages}
                total={total}
                limit={limit}
              />
            ))}
        </div>
        {!addWorkoutForm && (
          <button
            aria-label="buff it up"
            className="add--workout"
            onClick={() => setAddWorkoutForm(true)}
          >
            + Buff It Up
          </button>
        )}

        <Pagination
          page={page}
          pageSpread={pageSpread}
          total={total}
          limit={limit}
          flipPage={flipPage}
        />

        {addWorkoutForm && (            
          <WorkoutForm
            hideForm={hideForm}
            getItems={getItems}
            spreadPages={spreadPages}
            flipPage={flipPage}
            total={total}
            limit={limit}
          />
        )}
        {/* <div className="space"></div>
        <div className="chart--container">
          <h3>Routine Balance</h3>
          <div className="chart"></div>
          <p className="stats--upper-bod">
            <span></span> Upper body - 36%
          </p>
          <p className="stats--lower-bod">
            <span></span> Lower body - 64%
          </p>
        </div> */}
      </div>
    </div>
  );
}
