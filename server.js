'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const { json } = require('express');

// Application Setup
const app = express();
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL)
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.static('./public/js'));

// app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//General Route

app.get('/', loadApp);
app.post('/add', addCardToDB)
app.get('/goToCards/:list', loadcards);
app.delete('/cards/:id', deleteCard);
//rout to search for a word dif
app.post('/searches', searchWord);
app.get('/searches', (req, res) => {
    res.render('pages/search');
});
app.get('/showlist', showList);
app.get('/goToQuiz/:list', sendWords);
app.get('/deletUpdateForm/:id', formEdit);
app.put('/updateWord/:id', updateWord);
app.delete('/deleteWord/:id', deletWord);
app.get('/challenge', loadChalleng);


app.get('/aboutus', aboutUS);

// Route Definitions

function deletWord(req, res) {
    let SQL1 = `SELECT * FROM words WHERE id=$1;`;
    let val = [req.params.id];
    client.query(SQL1, val)
        .then((result) => {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', result.rows[0].list);
            let SQL2 = `DELETE FROM words WHERE id=$1;`
            client.query(SQL2, val)
                .then(() => {
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', result.rows[0].list);
                    res.redirect(`/showlist?list=${result.rows[0].list}`);
                })
        })
}

function updateWord(req, res) {
    let { word, definition, example, synonyms, list, img_url, audio } = req.body;
    let SQL = `UPDATE words SET word=$1,definition=$2,example=$3,synonyms=$4,list=$5,img_url=$6,audio=$7 WHERE id =$8;`;
    let id = req.params.id;
    console.log(req.body);
    let values = [word, definition, example, synonyms, list, img_url, audio, id];
    client.query(SQL, values)
        .then(() => {
            res.redirect(`/showlist?list=${list}`);
        });
}

function formEdit(req, res) {
    let id = req.params.id;
    let SQL = `SELECT * FROM words WHERE id=$1;`;
    let SQL2 = `SELECT DISTINCT list FROM words`;

    let safe = [id];
    client.query(SQL, safe)
        .then(data => {
            client.query(SQL2)
                .then(data2 => {

                    res.render('pages/show', { wordToEdit: data.rows, list:data2.rows });
                });

        });
}

function deleteCard(req, res) {
    let SQL1 = `SELECT * FROM words WHERE id=$1;`;
    let val = [req.params.id];
    client.query(SQL1, val)
        .then((result) => {
            let SQL2 = `DELETE FROM words WHERE id=$1;`
            client.query(SQL2, val)
                .then(() => {
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', result.rows[0].list);
                    res.redirect(`/showlist?list=${result.rows[0].list}`);
                })
        })
}


function loadcards(req, res) {
    let list = req.params.list;
    let SQL = `SELECT * FROM words WHERE list=$1;`;
    let safe = [list];
    client.query(SQL, safe)
        .then(data => {
            res.render('pages/cards', { allCards: data.rows, listName: list });
        })

}

function showList(req, res) {
    // let list = req.query;
    let SQL = `SELECT DISTINCT list FROM words;`;

    client.query(SQL)
        .then(data1 => {
            let list = req.query.list;
            let SQL2 = `SELECT * FROM words WHERE list=$1;`;
            // console.log(list);
            let safe = [list];
            return client.query(SQL2, safe)
                .then(data2 => {
                    // console.log(list);
                    // console.log(data2.rows);
                    res.render('pages/list', { listData: data1.rows, allList: data2.rows, list: list });
                });
        })

}

function addCardToDB(req, res) {
    let SQL = `INSERT INTO words (word,definition,example,synonyms,list,img_url,audio) VALUES ($1,$2,$3,$4,$5,$6,$7);`
    let safeValues = [req.body.word, req.body.definition, req.body.example, req.body.synonyms, req.body.list, req.body.img_url, req.body.audio];
    client.query(SQL, safeValues)
        .then(() => {
            res.redirect(`/showlist?list=${req.body.list}`);
        });
}
function sendWords(req, res) {
    let list = req.params.list;
    let SQL = `SELECT * FROM words WHERE list=$1;`;
    let safe = [list];
    client.query(SQL, safe)
        .then(data => {
            let allData = JSON.stringify(data.rows);
            res.render('pages/exam', { allData: allData, listName: list });
        })
}





// Route Handlers
function loadApp(req, res) {
    res.status(200).render('pages/index')
}
function aboutUS(req, res) {
    res.status(200).render('pages/aboutus')

}

//route to handle searching for a word
function searchWord(req, res) {
    let word = req.body.word;
    let key = process.env.AUDIO_API_KEY;
    let url = `https://api.dictionaryapi.dev/api/v1/entries/en/${word}`;
    let url2 = `http://www.splashbase.co/api/v1/images/search?query=${word}`;
    let url3 = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${key}`;



    superagent.get(url)
        .then(result => {
            let tegetObj;
            tegetObj = result.body[0].meaning['intransitive verb'];
            if (!tegetObj) {
                tegetObj = result.body[0].meaning.noun;
            }
            let newWordArr = tegetObj.map(val => {
                let newWord = new Word(val);
                return newWord;
            })
            return superagent.get(url2)
                .then(result2 => {
                    let imgArr = result2.body.images.map(val => {
                        let newImg = new Images(val);
                        return newImg;
                    })
                    if (!imgArr.length) {
                        imgArr.push({ img_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png' });
                    }
                    superagent.get(url3)
                        .then(audioData => {
                            let targetAduio = audioData.body[0].hwi.prs[0].sound.audio;
                            let aduioLink = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${word.charAt(0)}/${targetAduio}.mp3`

                            let SQL = `SELECT DISTINCT list FROM words;`;
                            client.query(SQL)
                                .then(data => {
                                    // console.log(data.rows);
                                    res.render('pages/new', { newWord: newWordArr, word: word, images: imgArr, audio: aduioLink, list: data.rows });
                                })
                        })
                    // res.status(201).json(imgArr);          
                })
        })
        .catch(error => errorHandler(error, res));

}

//constructor for words
function Word(newWord) {
    this.word = newWord.word;
    this.definition = newWord.definition ? newWord.definition : 'No definition available';
    this.example = newWord.example ? newWord.example : 'No example available';
    this.synonyms = newWord.synonyms ? newWord.synonyms : 'No synonyms available';
    // this.list = list;
}

//constructor for images
function Images(img) {
    this.img_url = img.url;
}
function loadChalleng(req, res) {
    let challengData = require('./data/challenge.json');
    let allData = JSON.stringify(challengData);
    res.render('pages/exam', { allData: allData });
}

function errorHandler(error, res) {
    res.status(404).render('pages/error', { error: error });
}
// To connect the client 
client.connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    })