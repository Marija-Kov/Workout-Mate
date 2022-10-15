const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, 'Please provide an username.'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [6, 'Your password must be at least 6 characters long.']
    }

});


// This function is fired AFTER the docment is saved to db:
// userSchema.post('save', function (doc, next) {
//     console.log('new user created and saved', doc);
//     next(); // * 
// })

// Fired BEFORE the document is saved to db:
userSchema.pre('save', async function (next) {  // ** 
   const salt = await bcrypt.genSalt();
   this.password = await bcrypt.hash(this.password, salt);
// *** 
    next();
})

module.exports = mongoose.model('User', userSchema);

// * next has to be called at the end of any mongoose middleware/hook or the process will hang and the response will not be sent to the client

// ** Why not ()=> ? not using arrow function because it doesn't bind 'this', 
// which we want to use to refer to the instance of the user.

// ** a) We don't pass the 'doc' argument here because at the time the function is fired, the doc doesn't exist in the db yet. 

// *** We can refer to the instance of the user here because we have access to it LOCALLY before it's saved to the db .
