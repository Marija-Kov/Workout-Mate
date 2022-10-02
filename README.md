# MERN stack app

## Folder structure
- frontend
- backend - .env
          - models - Workout.js
          - node_modules
          - package.json 
          - package-lock.json
          - routes - workouts.js
          - server.js
          

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

### Creating a Schema

Schema defines a structure, a set of rules on what and how we want to store. With mongoose.Schema we create custom Schemas for our data, which looks something like this:
const Schema = mongoose.Schema; (we're essentially destructuring the mongoose object here);
const mySchema = new Schema({
    //properties 
})

In order to use the schema on our database, we need to convert it to a model (to compile a model) that can interact with our MongoDB collection. 
mongoose.model('MyModel', mySchema);

Then we have to import the model in the router file. Before we create the documents with the model, we need to destructure the model. Since all the structure of the model is passed on the req.body, we can extract the model properties from the req.body. 
After extracting the properties, we call .create() method on the model that will create one or more documents in the collection. (Under the hood, create() is running save().) 
Once the documents are created, we can return a response.
Because create() is asynchronous, we can make sure that the documents are created before we get the response by using await and putting async in front of the route handler function.

## Controllers

Creating controllers is all about migrating route handlers into a separate file. 