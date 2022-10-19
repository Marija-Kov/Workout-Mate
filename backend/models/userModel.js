const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, 'Please provide an username.'],
        unique: true, 
        minlength: [3, 'Username must be at least 3 characters long.'],
        //TODO: username should only contain const re = /([A-Za-z0-9\.\_\-])/g
        //     - must contain at least one letter
    },
    password:{
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [8, 'Your password must be at least 8 characters long.']
    }

});

// This function is fired AFTER the document is saved to db:
// userSchema.post('save', function (doc, next) {
//     console.log('new user created and saved', doc);
//     next(); // * 
// })

// Fired BEFORE the document is saved to db:
// userSchema.pre('save', async function (next) {  // ** 
//    const salt = await bcrypt.genSalt();
//    this.password = await bcrypt.hash(this.password, salt);
// // *** 
//     next();
// })



// * next has to be called at the end of any mongoose middleware/hook or the process will hang and the response will not be sent to the client

// ** Why not ()=> ? not using arrow function because it doesn't bind 'this', 
// which we want to use to refer to the instance of the user that hasn't been created YET.

// ** a) We don't pass the 'doc' argument here because at the time the function is fired, the doc doesn't exist in the db yet. 

// *** We can refer to the instance of the user here with 'this' (not 'User') because we have access to it LOCALLY before it's saved to the db .


///// Static signup method
userSchema.statics.signup = async function (username, password) {

if(!username || !password) {
    throw Error('All fields must be filled')
}
if(!validator.isStrongPassword(password)){
  throw Error('Password not strong enough')  
}

const exists = await this.findOne({username});
 if (exists){
    throw Error('Username already in use')
 }
 const salt = await bcrypt.genSalt(10);
 const hash = await bcrypt.hash(password, salt);
 const user = await this.create({username, password: hash})
 return user
}

///// Static login method
userSchema.statics.login = async function (username, password) {
    if(!username || !password){
        throw Error('All fields must be filled')
    }
    const user = await this.findOne({username});
    if(!user){
        throw Error ('That username does not exist in our database')
    }
    const match = await bcrypt.compare(password, user.password);
   if(!match){
   throw Error ('Wrong password')
   }
   return user
}

module.exports = mongoose.model('User', userSchema);