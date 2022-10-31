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
Controllers/route handlers require the Model and use APIs to return desired response. ( https://mongoosejs.com/docs/api/model.html )
These methods are asynchronous so in order for the route handler to work correctly, it needs to be async as well. Plus it only makes sense to display the result once the method is called on the Model.

It's worth noting that all the data from the Model is passed on the request body so we can extract the properties we want to use from req.body. So a controller would look something like this:

- const getItem = async (req, res) => {
    const { id } = req.body;
    const item = await Model.findById(id);
    res.json(item);
};


## Frontend

Written in React using create-react-app.

## React router

- What do I know about React router except how to set it up? This readme section is a stub.
## Fetching data from the backend

The page needs to fetch data from the backend in order to show it to the client. 
Fetch method takes in the path (string) of the page and once it succeeds, the data is set as the earlier created state.
This state has access to the properties that have been defined in the Model and passed to the req.body on the backend.

Because frontend and backend of the app are running on two different servers, CORS policy will block the front from accessing the resources on the back by default for security reasons.
This can be overcome (in development phase) by adding: "proxy" : "http://localhost:<backend port number>" to package.json on the frontend.

## Adding components to the page

Home page fetches the data and renders instances of WorkoutDetails component and passes all the workout model/request body properties to it as props.

### Input Form

Input form is rendered on the Home page and maintains a state for each input name that corresponds to a request body property.

The states are reset on every input change and once handleSubmit is triggered:

1) all states are stored inside workout object (mimicking the workout model);
2) the existing data/workouts are fetched, the interaction with the backend happens; 
3) workout object is turned into JSON and stored as the request body;
4) POST method is used to add the new object to the array of existing objects;
5) The new workout can be logged in the console;

At the moment, the UI is not in sync with the database, new workout only appears on the page after refresh.
The function containing fetch request can't be wrapped inside useEffect because the form needs access to the function.
This can be solved using context.
## Context

The context is provided by WorkoutsContext to the whole App component by wrapping the App component where it's rendered in index.js.

The reducer is used in place of multiple functions changing multiple states.

## Custom hook

Creating useWorkoutsContext hook as a clean way to use context across components.

## Syncing UI with the database

1) Import useWorkoutsContext hook to the page where the content that needs to be synced with the DB lives.

2) Replace the local state with the global state, which is the hook destructured.
- * - remember that, since the hook returns the context, it has access to its structure/data.
- const { state, dispatch } = theHook();

3) Consequentially, replace setState() with dispatch({type:.., payload:..});

## Deleting items

1) there needs to be an element listening for clicks
2) there needs to be an event handler that would identify the target (get workout id) and fetch all and filter the target out of the array of workouts

3) context will need to be used to sync the state with the database


## Redesigning the UI

- Style update, conditional rendering of the input form.

- BUG : When invalid input error is caused, the backend server crashes and does not recover until restarted.
- SOLVED - quick fix by implementing the frontend error message solution instead of sending error from the backend. Will have to examine why the backend was crashing previously.


## Update item feature

### Overview
- Click on edit button renders the edit form that includes current content in all input fields.
- Upon changing the content of the post, click on save/update button on the form shows the new content within the same card and the edit form disappears from the screen.


### Process

1. DONE: Build edit React component
- * - discard button needs to be outside the form tag or it will trigger the update event?...

2. DONE: Make it pop up on edit icon click and disappear on save click.

- ISSUE "Cannot update a component (`Home`) while rendering a different component (`WorkoutDetails`)."
 SOLVED by wrapping props.showEdit() inside a function;

Uh...should I have an edit form for each workout? 
Or find a way to pass single workout data to just one?

#### Approach 1:

Import EditWorkout to WorkoutDetails.
This would create an edit form for every workout that will have immediate access to all the existing workout data.

##### How it went
- PROBLEM: any details component sets showEditForm to true for all edit components.
- There needs to be a way for a details component to single out the corresponding edit component.

#### Approach 2:

Import EditWorkout to Home page.

Every time edit button is clicked on detail card with _id: X, EditWorkout fetches _id: X;

##### How it went
Before coming up with how to pass the correct document data to EditWorkout component, I tested the fetch method by adding any existing document _id to the fetch url.

Although it shows in the console that the file has been fetched, I get an error: "workouts.map is not a function", as if .map() was running before the workouts were fetched on the home page.

I suspect this could be prevented by preventing the rerendering of the Home page on the click of edit.

More detailed observation: when edit is clicked, home and details are rerendered, edit is rendered, document is logged in console, but then home rerenders again - twice - and that's when it throws the error.
*
#### Approach 1.1:

Let's reconsider the edit component being rendered in the details component *and* the details component managing showEditForm state *unique to each details/form component*.
This worked.

Also the fetch-patch request works and the result can be seen on both ends.

- Optimization ideas: 
The page doesn't need to re-render after patch request is sent. How can this be accomplished?
The edit component doesn't need to rerender with every input change either.

The user should be able to discard a new workout as well.


## User authentication feature
### Overview

The user should see the login/sign up page when logged out and should only see the items they posted on the home page.
Signing up would automatically log the user in and redirect to the home page.
Logging out should take the user to the login form.

JWT should be created with every login for extra security.

## Search and pagination

Implemented a simple search filter on the frontend that works, but since implementing the pagination on the backend, only search results from the current page are displayed;

 




