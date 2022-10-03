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

