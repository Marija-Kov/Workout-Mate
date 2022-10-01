# MERN stack app

## Folder structure
- frontend
- backend - .env
          - node_modules
          - package.json 
          - package-lock.json
          - server.js
          - routes - workouts.js

##### package.json 
"script":{
    ...
    "dev": nodemon server.js --> npm run dev --> to start the app
}

## Setting up routes / route handlers

Routes live in routes/workouts.js .
Unlike in server.js, we don't have access to app (in server.js we could simply go with app.get(..), app.post(..)) so we create a router with express and then we attach the route handlers to the router instance.
const router = express.Router(); router.patch();
Then we export the router via module.exports and require it in the server.

## Database

Using MongoDB to store and retrieve data for the project.
## Data modelling

Using mongoose library methods we can structure and shape MongoDB data the way we want to show it on the page. 
