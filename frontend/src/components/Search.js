import React from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Search(){
      const { dispatch } = useWorkoutsContext();
      const { user } = useAuthContext();
    const [query, setQuery] = React.useState('');
    const handleSubmit = (e) =>{
        e.preventDefault();
          if (user) {
            fetch("/api/workouts", {
              headers: {
                'Authorization': `Bearer ${user.token}`,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                let queried = query ? 
                data.filter(e=>e.title.toLowerCase().includes(query.toLowerCase())) :
                data;
                dispatch({ type: "SET_WORKOUTS", payload: queried });
              })
              .catch((err) => console.log(`ERROR: ${err}`));
          }
    }
    return (
      <form className="search--bar" onSubmit={handleSubmit}>
        <input type="search" 
               placeholder="search..."
               value={query}
               onChange={e=>setQuery(e.target.value)}
               ></input>
        <button>
          <span class="material-symbols-outlined">search</span>
        </button>
      </form>
    );
}