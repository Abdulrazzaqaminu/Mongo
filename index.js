require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session')

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) =>{
    console.log(err);
})
db.once('open', () =>{
    console.log('connected to database')
})

// midlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}))
app.use((req, res, next) =>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})
// middlewares end
app.use(express.static("uploads"))
// template engine

app.set('view engine', 'ejs');

app.use('', require('./routes/routes'))

app.listen(PORT, () =>{
    console.log(`Server starting at port ${PORT}`)
})