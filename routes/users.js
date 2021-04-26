var express = require('express');
var router = express.Router();
const {createUser, logIn, addDeck, getDecks, deleteDeck, addKanji, deleteKanji} = require("./userController")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-user", createUser)

router.post("/log-in", logIn)

router.post('/add-deck', addDeck)

router.post('/get-decks', getDecks)

router.post('/delete-deck', deleteDeck)

router.post('/add-kanji', addKanji)

router.post('/delete-kanji', deleteKanji)

module.exports = router;
