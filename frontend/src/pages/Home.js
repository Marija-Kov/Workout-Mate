import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import Navbar from'../components/Navbar'
import { useWorkoutsContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from "../hooks/useAuthContext";
import Pagination from '../components/Pagination';
import { useSearch } from '../hooks/useSearch';

export default function Home() {
    const [addWorkoutForm, setAddWorkoutForm] = React.useState(false);
    const { workouts } = useWorkoutsContext(); 
    const { user } = useAuthContext();
    const { search, total, limit, isLoading } = useSearch();
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

   function hideForm(){
       setAddWorkoutForm(false)
   }

   function goToPageOne(){
    setPage(0)
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
     await getItems(query, page)
   };

    return (
      <>
        <Navbar page={page} setPage={setPage}/>
        {user && ( // SEARCH BAR
          <>
            <form className="search--bar" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="search workouts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
              ></input>
              <button disabled={isLoading}>
                <span className="material-symbols-outlined">search</span>
              </button>
            </form>
            {isLoading && <h1 className="loading">Loading data...</h1>}
          </>
        )}    
        {user && (
          <Pagination
            page={page}
            pageSpread={pageSpread}
            total={total}
            limit={limit}
            flipPage={flipPage}
          />
        )}
        <div className="home">
          <div className="workouts">
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
                  spreadPages={spreadPages}
                />
              ))}
          </div>
          {addWorkoutForm && 
          <WorkoutForm 
          goToPageOne={() => goToPageOne()}
          hideForm={() => hideForm()} />}
          {!addWorkoutForm && (
            <button
              className="add--workout"
              onClick={() => setAddWorkoutForm(true)}
            >
              + Add workout
            </button>
          )}
        </div>
      </>
    );
};
