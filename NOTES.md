# Workout Mate - MERN stack CRUD app with authentication

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

##### Addendum: 
This function is fired AFTER the document is saved to db: 

userSchema.post('save', function (doc, next) {
    console.log('new user created and saved', doc);
    next(); // * 
})

Fired BEFORE the document is saved to db: 

userSchema.pre('save', async function (next) {  // ** 
   const salt = await bcrypt.genSalt();
   this.password = await bcrypt.hash(this.password, salt);
// *** 
    next();
})



-* next has to be called at the end of any mongoose middleware/hook or the process will hang and the response will not be sent to the client

-** Why not ()=> ? not using arrow function because it doesn't bind 'this', 
which we want to use to refer to the instance of the user that hasn't been created YET.

-** a) We don't pass the 'doc' argument here because at the time the function is fired, the doc doesn't exist in the db yet. 

-*** We can refer to the instance of the user here with 'this' (not 'User') because we have access to it LOCALLY before it's saved to the db .

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

##### Addendum:
Workout controller - andling missing input server-side:

    let emptyFields = [];
    if(!title){
      emptyFields.push('title')
    };
    if(!reps){
      emptyFields.push('reps')
    };
    if(!load){
      emptyFields.push('load')
    };
    if(emptyFields.length > 0){
      res.status(400).json({error: 'Please fill in all the fields.', emptyFields})
    };

Auth controller - Error handling outside static method:

const handleErrors = (err) => {
  let errors = { email: '', password:'' };

  if(err.message.includes('User validation failed')){
    Object.values(err.errors).forEach(e => {  // by extracting ({properties}) here...
        let errorsProperty = e.properties.path; // you could simplify the next couple of lines
        errors[ errorsProperty] = e.properties.message + ' ';
    })
  } else if(err.code === 11000){
      errors.email = "That email already exists. Please enter a different one."
  }
  return errors
}

....}catch(err){
 res.status(400).json({errors});
}

## Frontend

Written in React using create-react-app.

## Set up React router

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

## Update item feature

- Click on edit button renders the edit form that includes current content in all input fields.
- Upon changing the content of the post, click on save/update button on the form shows the new content within the same card and the edit form disappears from the screen.
- The user may discard edit form if they give up on updating the info.

### Process

- Build edit React component that pops up on edit icon click and disappears on save button click.

- Import EditWorkout to WorkoutDetails which creates an edit form for every workout that will have immediate access to all the existing workout data. Every WorkoutDetails component manages a showEditForm state.

## User authentication feature

The user sees the login/sign up page when logged out and only sees the items they posted on the home page.
Signing up automatically logs the user in and redirects to the home page.
Logging out redirects the user to the login form.

JWT is created with every login for extra security.

## Search and pagination

- The docs are fetched upon every search query, and filtered on the backend, which displays correct number of search results on the UI.

- Pages can be flipped back and forth, buttons disabled using the page limit data from the backend.

- Add Workout component has access to page-flip function - flips to to page 0 once a workout is added.

## Account deletion

- The user can delete their account - workouts and username - from the database.

## Password recovery feature

- Built UI for sending password recovery request.
- Built reset password request controller with corresponding routes.
- Used installed nodemailer, crypto, handlebars.
- Built sendEmail() middleware, recovery email template.
- Updated User model with resetPasswordToken and expiry date.
- Built UI for password reset.
##### Flow:

1. Client sends request for password reset by entering email in the form
2. Server responds by: 1) finding the user doc by email, 2) updating it with password reset token and token expiry time 3), creating password reset link, 4) sending an email from template with password reset link.
3. When the user clicks on the link: 1) the token number is extracted from location.href, 2) the user can enter new password
4. Once user clicks save, PATCH request is sent to the server with token number(in path) and password+confirmPassword(in body). If the request passes all validation, the password is updated, resetToken and expiry are removed from the doc; if the password is weak, passwords don't match or resetToken expires, errors are thrown.

#### ISSUES: 

- RESOLVED: Errors are not showing on ResetPassword page..
* Status code methods were missing.


- RESOLVED - When the link in the password recovery email is clicked, ERR_SSL_PROTOCOL_ERROR is thrown. 
* 'http' instead of 'https' (no SSL requirement) will do for development purposes. 

- RESOLVED - The link in the password recovery email is not showing.
 * { link: resetLink, } --> {{link}} in hbs template (not resetLink)

- RESOLVED - No recipients (protonmail, outlook, gmail) would accept the password recovery emails because they see it as spam. 
* Adding 'from: process.env.EMAIL_USERNAME' to options in sendEmail.js made it work, all recipients are getting password recovery email.

- RESOLVED - I'm not able to sign up to the app with a new email. If I try to sign up with an existing email, it returns the corresponding error so the request reaches the database and finds irregularities there.
Error message: "E11000 duplicate key error collection: mern_app.users index: username_1 dup key: { username: null }" 
* Deleting MongoDB 'users' collection and restarting the server made it work.

## Change profile picture feature

### Frontend

- Created UserMenu component as a Navbar child component;

- Created UserSettings as a UserMenu child component; It contains a file input form. Once the file is chosen and upload button is clicked, the chosen file is logged into the console.

- Wrote functions in UserSettings that let the chosen files be read and previewed. Wrote a patch request within uploadImage function that takes base64EncodedImage to be sent as profileImg value.

- Passed changeProfileImg function (that has control over setProfileImg state from Navbar --> UserMenu --> UserSettings where it can be set to the image of choice.

- When a new image is selected and upload is clicked, the database is updated. However, another request to the server would be required to get the image back from the database and set it as profile image right after. To avoid this, newImage is set in the localstorage so the user can see the new profile image until they log out. The next time they log in, the client will get the new profile image from the database.

### Backend

- Updated userModel with profileImg property.

- Installed cloudinary package and added cloudinary middleware.

- Added user_update_patch to authController that requires cloudinary for storing files.

- Updated users routes correspondingly.








