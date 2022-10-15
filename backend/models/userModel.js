const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, 'Please provide an username.'],
        unique: [true, "That username already exists. Please use a different one."]
    },
    password:{
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [6, 'Your password must be at least 6 characters long.']
    }

})

module.exports = mongoose.model('User', userSchema);