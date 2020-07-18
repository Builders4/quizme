'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Application Setup
const app = express();
const PORT = process.env.PORT;
// const client = new pg.Client(process.env.DATABASE_URL)
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
// app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//General Route
app.get('/', loadApp);
app.get('/cards', lodcards);

// Route Definitions



// Route Handlers
function loadApp(req,res) {
    res.status(200).render('pages/index')
}
function lodcards(req,res) {
    res.status(200).render('pages/cards')
}


// To connect the client 
// client.connect()
//     .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    // })