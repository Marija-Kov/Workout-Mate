# MERN stack app
## Backend
##### backend/package.json 
"script":{
    ...
    "dev": nodemon server.js (--> npm run dev --> to start the app)
}

## Setting up routes / route handlers

Routes live in routes/workouts.js .
Unlike in server.js, we don't have access to app (in server.js we could simply go with app.get(..), app.post(..)) so we create a router with express and then we attach the route methods to the router instance.

- const router = express.Router(); 
--> ex: router.patch('path', handlerFunction);

Then we export the router via module.exports and require it in the server.

## Database

Using MongoDB to store and retrieve data for the project.
## Data modelling

Using mongoose library methods, we can structure and shape MongoDB data the way we want to store it in the database/send it to the client. 

### Creating a Schema

Schema defines a structure, a set of rules on what and how we want to store. With mongoose.Schema we create custom Schemas for our data, which looks something like this:

- const Schema = mongoose.Schema;
const mySchema = new Schema({
    property1: {
        type: String,
        //more property1 rules
    } 
    ...
});

In order to use the schema on our database, we need to convert it to a model (to compile a model from the schema) that can interact with our MongoDB collection. 

- mongoose.model('MyModel', mySchema);

Then we have to import the model in the router file. Before we create the documents with the model, we need to destructure the model. Since all the structure of the model is passed on the req.body, we can extract the model properties from the req.body. 
After extracting the properties (destructuring), we call .create() method on the model that will create one or more documents in the collection. (Under the hood, create() is running save() for every document.) 
Once the documents are created, we can return a response.
Because create() is asynchronous, we can make sure that the documents are created before we get the response by using await and putting async in front of the route handler function.

## Controllers

Creating controllers is all about migrating route handlers into a separate file. 
Controllers/route handlers reqire the Model and use APIs to return desired response. ( https://mongoosejs.com/docs/api/model.html )
These methods are asynchronous so in order for the route handler to work correctly, it needs to be async as well. Plus it only makes sense to display the result once the method is called on the Model.

It's worth noting that all the data from the Model is passed on the request body so we can extract the properties we want to use from req.body. So a controller would look something like this:

- const getItem = async (req, res) => {
    const { id } = req.body;
    const item = await Model.findById(id);
    res.json(item);
};


# Frontend

Written in React using create-react-app.

## Fetching data from the backend

A page file needs to fetch data from the backend in order to show it to the client. 
Fetch method takes in the path (string) of the page and once it succeeds, the data is set as the earlier created state.
This state has access to the properties that have been defined in the Model and passed to the req.body on the backend.

Because frontend and backend of the app are running on two different servers, CORS policy will block the front from accessing the resources on the back by default for security reasons.
This can be overcome (in development phase) by adding: "proxy" : "http://localhost:<backend port number>" to package.json on the frontend.

## Adding components to the page

Home page renders instances of WorkoutDetails component and passes all the workout model/request body properties to it as props.

### Input Form

Input form maintains a state for each input name that corresponds to a request body property.

The states are reset on every input change and once handleSubmit is triggered:

1) all states are stored inside workout object;
2) the existing data/workouts are fetched, the interaction with the backend happens; 
3) workout object is turned into JSON and stored as the request body;
4) POST method is used to add the new object to the array of existing objects;
5) The new workout can be logged in the console;

At the moment, the UI is not in sync with the database, new workout only appears on the page after refresh.
The function containing fetch request can't be wrapped inside useEffect because the form needs access to the function.
This can be solved using context.
## Context

The context is provided by WorkoutsContext to the whole App component by wrapping the App component where it's renderd in index.js.

The reducer is used in place of multiple functions changing multiple states.

## Custom hook

Creating useWorkoutsContext hook as a clean way to use context across components.

## Syncing UI with the database

1) Import useWorkoutsContext hook to the page where the content that needs to be synced with the DB lives.

2) Replace the local state with the global state, which is the hook destructured.
- * - remember that, since the hook returns the context, it has access to its structure/data.
- const { state, dispatch } = theHook();

3) Consequentially, replace setState() with dispatch({type:.., payload:..});
