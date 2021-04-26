const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    decks:{
        type: Array
    }
})


module.exports = mongoose.model("User", UserSchema)