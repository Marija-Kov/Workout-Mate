import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import Pagination from '../components/Pagination';
import { useSearch } from '../hooks/useSearch';
import Search from '../components/Search';
import { logOutIfTokenExpired } from '../utils/logOutIfTokenExpired';

export default function Home() {
    const [addWorkoutForm, setAddWorkoutForm] = React.useState(false);
    const { workouts } = useWorkoutContext(); 
    const { search, total, limit, isLoading, error } = useSearch();
    const [page, setPage] = React.useState(0);
    const [pageSpread, setPageSpread] = React.useState([]);
    const [query, setQuery] = React.useState("");

    React.useEffect(() => {
      getItems(query, page);
    }, [query, page]);

    React.useEffect(()=> {
      spreadPages(total, limit)
    },[total,limit])

    const getItems = async (q,p) => {
      await search(q, p);
    };
    
    const spreadPages = (t, l) => {
      const pagesNum = Math.ceil(t / l);
      let spread = [];
      for (let i = 1; i <= pagesNum; ++i) {
        spread.push(i);
      }
      setPageSpread(spread);
    };

   const hideForm = () => {
       setAddWorkoutForm(false)
   }

   const flipPage = (num) => {
     setPage((prev) => {
       if (num === -1) return prev + num;
       if (num[0]) return prev + num[0];
       return num - 1;
     });
   };

   const handleSearch = async (e) => {
     e.preventDefault();
     await getItems(query, page);
   };

   const handleSearchChange = (e) => {
      setQuery(e.target.value);
      setPage(0);
   }

    return (
      <div className="home--container" onClick={logOutIfTokenExpired}>
        <div className="home">
          <Search
            handleSearchChange={handleSearchChange}
            handleSearch={handleSearch}
            query={query}
            isLoading={isLoading}
          />
            {error && (
              <div role="alert" className="error">
                {error}
              </div>
            )}
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
          <div className="space"></div>
          <div className="chart--container">
            <h3>Routine Balance</h3>
            <div className="chart"></div>
            <div className="chart--legend">
            <p className="stats--upper-bod">
              <span></span> Upper body: 64%
            </p>
            <p className="stats--lower-bod">
              <span></span> Lower body: 36%
            </p>              
            </div>

          </div>
        </div>
      </div>
    );
};
