import React from 'react'
import github from "../assets/github.png";
import patternBkg from "../assets/gym-pattern.png"

export default function About() {
  return (
    <>
      <div className="about--container">
        <h1>About</h1>
        <p>Workout Mate is there for you to keep track of your physical activity.</p>
        <p>
          You will be able to submit exercise whenever you want and without any
          real-life relavance if that's what you prefer.
        </p>
        <p> Workout Mate doesn't judge.</p>
        <p>
          Workout Mate lets you be the athlete <i>you</i> want to be.
        </p>
    
        <a href="https://github.com/Marija-Kov/Workout-Mate">
          <img className="github" src={github} alt="Github" />
        </a>
      </div>
      <img className="gym--pattern--bkg" src={patternBkg} alt="Sports and healthy lifestyle symbols pattern" />
    </>
  );
}
