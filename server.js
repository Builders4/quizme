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
app.post('/add', addCardToDB)
app.get('/cards', loadcards);
app.delete('/cards/:id', deleteCard);

// Route Definitions

function deleteCard(req, res) {
    let SQL = `DELETE FROM words WHERE id=$1;`
    let val = [req.params.id];
    client.query(SQL, val)
        .then(() => {
            res.redirect('/cards');
        })
}

function loadcards(req, res) {
    let SQL = `SELECT * FROM words;`;
    client.query(SQL)
        .then(data => {
            res.render('pages/cards', { allCards: data.rows })
        })

}

function addCardToDB(req, res) {
    let SQL = `INSERT INTO words (word,definition,example,synonyms,list,img_url) VALUES ($1,$2,$3,$4,$5,$6);`
    let safeValues = [req.body.word, req.body.definition, req.body.example, req.body.synonyms, req.body.list, req.body.img_url];
    client.query(SQL, safeValues)
        .then(() => {
            res.redirect('/cards');
        });
}




// Route Handlers
function loadApp(req, res) {
    res.status(200).render('pages/index')
}



// To connect the client 
// client.connect()
//     .then(() => {
app.listen(PORT, () =>
    console.log(`listening on ${PORT}`)
);
    // })