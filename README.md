<h1 align="center">Workout Mate</h1>
<h3 align="center">A MERN stack app with authentication</h3>
<br>
<div align="center"><img src="./demo/wm-login.gif" alt="logging into app" /></div> 
<br>
<p align="center"> <i>
Workout Mate is there for you when you need to keep track of your physical activity. 
It lets you submit exercise whenever you want and without any real-life relavance if that's what you prefer.
Workout Mate doesn't judge.
Workout Mate lets you be the athlete you want to be.</i>
</p>
<br>

---

## Table of Contents

1. [How did it come about?](#motivation)
2. [App Features](#features)
3. [Tools and Dependencies](#tools)
4. [Test coverage](#test)
5. [Todos](#todos)
6. [Resources](#resources)
7. [Author](#author)

---
<br>

## How did it come about? <a name = "motivation"></a>
<p> 
Workout Mate started off as a basic made-from-scratch CRUD course project that I decided to build on top of to create a more complete web app. I've done a lot of research, trial and error to hopefully make something that looks like a project that anybody would want to put in their portfolio to demonstrate profound understanding of the fundamentals of building a common real-world piece of software.
</p>

<br>

## App Features <a name = "features"></a>
<p> 
As the User, you can <b>create an account</b> on Workout Mate from the <b>Signup</b> page with a valid email address and a strong password. You will then be sent an email with a link to <b>confirm your account</b>. Clicking on the link, you will be redirected to the page that will inform you that your account has been confirmed successfully and you can go to the <b>Login</b> page and use your credentials to access your account. If you type in wrong credentials, you will be alerted so. Note that every clickable element in the app is also <b>keyboard focusable</b>.
 
Once you log in successfully, you will be redirected to your <b>Home</b> page where you will see your generated default username and avatar in the Navbar section. These can be changed by clicking on the avatar or username and then clicking the "Settings" option on the dropdown menu. This will open the <b>Profile Settings</b> form where you can enter a different username and choose a <b>custom profile image</b> from your device that you can also crop to your taste within the form. All the changes that you made will be saved after clicking the "Upload" button. You can opt out of changes by clicking the X in the top right corner of the form.
 
After personalizing your profile, you can start <b>adding workouts</b> by clicking the "Buff It Up" button. A form will appear with "title", "reps" and "load" input fields that you'll have to fill entirely before your workout can be added. Clicking "Add Workout" with valid input will make a card with your <b>Workout details</b> appear on the page. The time of the entry will be added automatically on every card and you'll find that the workouts are sorted in the chronological order, newer first.
 
As you keep adding workouts, you will find to be useful the <b>Pagination</b> feature at the bottom-left of the page that will enable you to access your entire workout history by clicking on page numbers or chevrons, since the app is set up to only show 3 workouts at a time. Also, you can use the <b>Search bar</b> in the top-left section of the page (right below the Navbar) to search your workout history by the workout title.
 
Every workout card contains a <b>delete workout</b> (trash can) and <b>edit workout</b> (pen) icons at the bottom right of the card. By clicking on the trash can, the workout will be deleted from your workouts list and from the database. By clicking on the pen, the Edit workout form will pop-up and it will be filled with the current workout details. After editing the workout and clicking save, the workout will be updated with the new details. You can opt out of editing by clicking X.
 
You can finish your session with Workout Mate by clicking <b>Log Out</b> after opening the dropdown menu from your avatar/username and you will be logged out and redirected to the Login page.
 
If you happen to forget your password, you will be able to recover it by first clicking on <b>Forgot password?</b> that's in the login form, which will open a <b>Reset password request</b> form that will ask you to enter your email address that you have an account with. Once you correctly enter your email address and click proceed, you will be alerted to check your inbox for an email with the <b>password reset link</b>. When you click on the password reset link, you will be redirected to the password reset page that will contain a single form asking you to type your new password in two input fields. The form will check the strength of the new password as well as whether the passwords are matching before you will be allowed to finish the password reset. Once you've successfully reset your password, you will be able to access your account with it.
 
In case you want to delete your Workout Mate account, you will have to log in, open Profile settings from the dropdown menu and click on <b>delete account</b> at the bottom-right of the form. You will see a dialogue pop-up that will warn you about the consequences of deleting your account and will give you an option to change your mind or delete your account permanently. After you click on "Yes, delete my account permanently", all your data will be deleted from the database and you will be redirected to the Login page.
</p>

<br>

## Tools and Dependencies <a name = "tools"></a>

### Backend

- [NodeJS](https://nodejs.org/en/) - Server logic
- [Express](https://expressjs.com/) - Routing
- [MongoDB](https://account.mongodb.com/account/login) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB document modelling
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - hashing passwords
- [Dotenv](https://www.npmjs.com/package/dotenv) - secret-keeping
- [JWT](https://jwt.io/) - Authentication
- [Validator](https://www.npmjs.com/package/validator) - request (input) validation
- [Nodemailer](https://nodemailer.com/about/) - Email sending middleware
- [Handlebars](https://handlebarsjs.com/) - Email templates
- [Ethereal email](https://ethereal.email/) - Mock SMTP service

#### Dev Dependencies

- [Jest](https://jestjs.io/) - Javascript testing framework
- [Supertest](https://github.com/ladjs/supertest) - testing HTTP requests
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) - testing/mocking MongoDB memory server in NodeJS
- [@shelf/jest-mongodb](https://www.npmjs.com/package/@shelf/jest-mongodb) - A Jest preset for running MongoDB memory server

### Frontend

- [React](https://reactjs.org/) - User interface
- [React router](https://reactrouter.com/en/main) - Browser routing
- [React easy crop](https://www.npmjs.com/package/react-easy-crop) - Image cropping
- [Date-fns](https://date-fns.org/) - Date formatting
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) - Styling

<br>

## Test coverage <a name = "test"></a>

As of last update:

### Backend


File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |   95.05 |     92.3 |      92 |   95.05 |                   
 backend                     |    90.9 |       50 |   66.66 |    90.9 |                   
  database.config.js         |     100 |      100 |     100 |     100 |                   
  server.js                  |   84.21 |       50 |   33.33 |   84.21 | 26-31             
 backend/controllers         |   94.92 |    96.42 |     100 |   94.92 |                   
  authController.js          |   94.64 |      100 |     100 |   94.64 | 53,88,98          
  passwordResetController.js |     100 |      100 |     100 |     100 |                   
  workoutController.js       |   91.11 |    93.75 |     100 |   91.11 | 31,49,72,82       
 backend/middleware          |      96 |      100 |     100 |      96 |                   
  requireAuth.js             |     100 |      100 |     100 |     100 |                   
  sendEmail.js               |   92.85 |      100 |     100 |   92.85 | 36                
 backend/models              |   94.73 |     90.9 |     100 |   94.73 |                   
  userModel.js               |   94.11 |     90.9 |     100 |   94.11 | 41,67             
  workoutModel.js            |     100 |      100 |     100 |     100 |                   
 backend/routes              |     100 |      100 |     100 |     100 |                   
  resetPassword.js           |     100 |      100 |     100 |     100 |                   
  users.js                   |     100 |      100 |     100 |     100 |                   
  workouts.js                |     100 |      100 |     100 |     100 |                   


### Frontend

File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------------|---------|----------|---------|---------|-------------------
All files                     |   39.39 |    27.53 |   38.88 |   41.55 |                   
 src                          |       0 |        0 |       0 |       0 |                   
  App.js                      |       0 |        0 |       0 |       0 | 6-16              
  index.js                    |       0 |      100 |     100 |       0 | 8-9               
 src/components               |    20.9 |    21.84 |   18.96 |   22.87 |                   
  EditWorkout.js              |       0 |        0 |       0 |       0 | 6-74              
  ForgotPasswordForm.js       |      50 |       50 |      25 |      50 | 10-11,19-32       
  Navbar.js                   |      68 |    65.51 |   83.33 |      80 | 20,29-31          
  Pagination.js               |    12.5 |        0 |   28.57 |    12.5 | 8-18,27-46        
  Search.js                   |     100 |      100 |     100 |     100 |                   
  UserMenu.js                 |      50 |       50 |      20 |   55.55 | 10,14-15,24       
  UserSettings.js             |       0 |        0 |       0 |       0 | 11-94             
  WorkoutDetails.js           |    7.69 |        0 |       0 |    9.09 | 8-39              
  WorkoutForm.js              |   22.22 |    21.05 |   14.28 |      25 | 14-32,37-39       
 src/context                  |   55.17 |       25 |   57.14 |   57.14 |                   
  AuthContext.js              |   78.57 |       50 |     100 |   78.57 | 12-20             
  WorkoutContext.js           |   33.33 |        0 |      25 |   35.71 | 6-29              
 src/hooks                    |   36.97 |    17.91 |      40 |    37.6 |                   
  useAuthContext.js           |      75 |       50 |     100 |      75 | 7                 
  useConfirmAccount.js        |     100 |      100 |     100 |     100 |                   
  useCreateWorkout.js         |    37.5 |        0 |      50 |    37.5 | 11-32             
  useCroppedImg.js            |    3.12 |        0 |       0 |    3.33 | 4-57              
  useDeleteAllWorkouts.js     |      10 |        0 |       0 |      10 | 6-23              
  useDeleteUser.js            |    12.5 |        0 |       0 |    12.5 | 6-20              
  useDeleteWorkout.js         |       0 |        0 |       0 |       0 | 6-33              
  useEditWorkout.js           |       0 |        0 |       0 |       0 | 6-35              
  useLogin.js                 |     100 |      100 |     100 |     100 |                   
  useLogout.js                |   41.66 |        0 |      50 |   41.66 | 9-18              
  useResetPassword.js         |   36.36 |        0 |      50 |   36.36 | 8-23              
  useSearch.js                |   52.63 |        0 |     100 |   52.63 | 20-30             
  ...dPasswordResetRequest.js |   36.36 |        0 |      50 |   36.36 | 8-21              
  useSignup.js                |     100 |      100 |     100 |     100 |                   
  useUpdateUser.js            |    3.33 |        0 |       0 |    3.57 | 5-49              
  useWorkoutContext.js        |      80 |       50 |     100 |      80 | 8                 
 src/mocks                    |     100 |      100 |     100 |     100 |                   
  server.js                   |     100 |      100 |     100 |     100 |                   
 src/pages                    |   80.21 |    75.75 |   69.69 |    81.6 |                   
  About.js                    |       0 |      100 |       0 |       0 | 6                 
  ConfirmedAccount.js         |     100 |      100 |     100 |     100 |                   
  Home.js                     |   65.78 |       50 |      50 |   68.57 | ...54-55,59-60,76 
  Login.js                    |     100 |      100 |     100 |     100 |                   
  ResetPassword.js            |   69.23 |     62.5 |      40 |   69.23 | 17-18,29-37       
  Signup.js                   |     100 |      100 |     100 |     100 |                   
 src/utils                    |      40 |       25 |     100 |      40 |                   
  logOutIfTokenExpired.js     |      40 |       25 |     100 |      40 | 6-13              

<br>

## Todos <a name = "todos"></a>

- Finish UI tests
- Add more demo gifs to readme
- Feature: Change the pie chart role from ornamental to relevant/functional.

<br>

## Resources <a name = "resources"></a>

🐱 You can start building the app from scratch by following along [this tutorial](https://www.youtube.com/watch?v=98BzS5Oz5E4&list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE) (like I did).

<br>

## Author <a name = "author"></a>

[@marija-kov](https://github.com/Marija-Kov) 









 
