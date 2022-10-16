const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id:{
        type:Number
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const counterSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    seq: {
        type: Number,
    },
});
const user = mongoose.model('User', userSchema);
const counter = mongoose.model('Counter', counterSchema);
module.exports = {user, counter}