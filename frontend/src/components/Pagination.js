import React from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutContext";

export default function Pagination(){
    const [page, setPage] = React.useState(1);
  // page number, total items, items per page
    return (
        <div className="page--btn--container">Page btns</div>
    )
}