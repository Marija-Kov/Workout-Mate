import { useMemo } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import CustomLegend from "./CustomLegend.js";

ChartJS.register(ArcElement, Tooltip);

const Chart = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.workouts);
  const { allUserWorkoutsMuscleGroups } = workouts;
  const {
    chest,
    shoulder,
    biceps,
    triceps,
    leg,
    back,
    glute,
    ab,
    calf,
    forearmAndGrip,
  } = useSelector((state) => state.routineBalance);
  const muscleGroups = useMemo(
    () => allUserWorkoutsMuscleGroups,
    [allUserWorkoutsMuscleGroups]
  );
  useEffect(() => {
    dispatch({ type: "SET_ROUTINE_BALANCE", payload: muscleGroups });
  }, [muscleGroups]);

  const data = {
    labels: [
      "Chest",
      "Shoulder",
      "Biceps",
      "Triceps",
      "Leg",
      "Back",
      "Glute",
      "Ab",
      "Calf",
      "Forearm and Grip",
    ],
    datasets: [
      {
        data: [
          chest,
          shoulder,
          biceps,
          triceps,
          leg,
          back,
          glute,
          ab,
          calf,
          forearmAndGrip,
        ],
        backgroundColor: [
          "rgb(219, 162, 215, 0.7)",
          "rgb(212, 122, 147, 0.7)",
          "rgb(162, 122, 212, 0.7)",
          "rgb(122, 131, 212, 0.7)",
          "rgb(99, 148, 255, 0.7)",
          "rgb(99, 224, 255, 0.7)",
          "rgb(99, 255, 239, 0.7)",
          "rgb(99, 255, 140, 0.7)",
          "rgb(255, 206, 99, 0.7)",
          "rgb(255, 127, 99, 0.7)",
        ],
        borderWidth: 1,
        borderColor: "rgb(255, 255, 255, 0.001)",
      },
    ],
  };

  Tooltip.positioners.myCustomPositioner = () => {
    return window.innerWidth <= 450 ? { x: 80, y: 100 } : { x: 100, y: 150 };
  };

  const options = {
    onHover: (event, chartElement) => {
      event.native.target.style.cursor = chartElement.length
        ? "pointer"
        : "default";
    },
    plugins: {
      legend: false,
      tooltip: {
        position: "myCustomPositioner",
        displayColors: false,
        backgroundColor: "rgb(255, 255, 255, 0.7)",
        titleColor: "rgb(112, 98, 109)",
        bodyColor: "rgb(48, 48, 48)",
        titleFont: {
          family: "Poppins",
          weight: 600,
          size: 14,
        },
        bodyFont: {
          family: "Poppins",
          weight: 600,
          size: 14,
        },
      },
    },
  };

  return (
    <div className="chart--container">
      <h3>Routine balance (%)</h3>
      <div className="chart">
        <Doughnut data={data} options={options} />
        <CustomLegend
          labels={data.labels}
          colors={data.datasets[0].backgroundColor}
          percentage={data.datasets[0].data}
        />
      </div>
    </div>
  );
};

export default Chart;
