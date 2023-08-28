import React from 'react';
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import Pagination from '../components/Pagination';
import { useSearch } from '../hooks/useSearch';
import Search from '../components/Search';
import { logOutIfTokenExpired } from '../utils/logOutIfTokenExpired';
import { Chart } from '../components/Chart';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { WorkoutsPlaceholder } from '../components/WorkoutsPlaceholder';
import { useSelector } from 'react-redux';

export default function Home() {
    const [addWorkoutForm, setAddWorkoutForm] = React.useState(false);
    const { workouts } = useWorkoutContext(); 
    const { search, total, limit, allWorkoutsMuscleGroups, isLoading, error } = useSearch();
    const [page, setPage] = React.useState(0);
    const [pageSpread, setPageSpread] = React.useState([]);
    const { workouts, loading, setWorkoutsError } = useSelector(state => state.workout);
    const { total, allUserWorkoutsMuscleGroups, workoutsChunk } = workouts;
    const { search } = useSearch();
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

   const muscleGroups = React.useMemo(() => allWorkoutsMuscleGroups, [allWorkoutsMuscleGroups.length])

    return (
      <div className="home--container" onClick={logOutIfTokenExpired}>
        <div className="home">
          <Search
            handleSearchChange={handleSearchChange}
            handleSearch={handleSearch}
            query={query}
          />
            {setWorkoutsError && (
              <div role="alert" className="error">
                {setWorkoutsError}
              </div>
            )}
          <div aria-label="workouts" className="workouts--container">
            {workoutsChunk ?
              workoutsChunk.map((workout) => (
                <WorkoutDetails
                  key={workout._id}
                  id={workout._id}
                  title={workout.title}
                  muscle_group={workout.muscle_group}
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
              )) : <WorkoutsPlaceholder />}
             {workoutsChunk && !workoutsChunk.length && !loading && 
              <h4 className="get--started">
                {!workoutsChunk && !query && <>Buff it up to get started.<br></br>No pressure <span>🥤</span></>} 
                {query && <>No "{query}" workouts found.</>} 
              </h4>}
           </div>
          {workoutsChunk ? <Chart muscleGroups={muscleGroups}/> : <ChartPlaceholder />}
          {!addWorkoutForm && (
            <button
              aria-label="buff it up"
              className={workoutsChunk && workoutsChunk.length ? 
                           "add--workout" : (
                            query ? 
                            "add--workout" : (
                            loading ?
                            "add--workout is--loading" : "add--workout no--workouts--yet" 
                            )
                         )}
              onClick={() => setAddWorkoutForm(true)}
              disabled={loading}
            >
              + Buff It Up
            </button>
          )}

          {workouts && workouts.length > 0 &&
          <Pagination
            page={page}
            pageSpread={pageSpread}
            total={total}
            limit={limit}
            flipPage={flipPage}
          />}
          
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
          
        </div>
      </div>
    );
};
