let fs = require('fs');
let express = require('express');
let router = express.Router();
let GameEngine = require('../app/gameEngine');
let engine = new GameEngine();
let GameError = require('../app/Error/GameError');

const descriptions = JSON.parse(fs.readFileSync(__dirname + "/../appConfigs/descriptions.json").toString());

// TODO: add multi-language support

/* GET */
router.get('/', function(req, res, next) {
    res.render('index', {descriptions: descriptions});
});

router.get('/rooms/:id', (req, res, next) => {
    try {
        let roomId = req.params.id;
        let game = engine.getGame(roomId);
        res.render('room', {
            playerCount: 10,
            seatMap: game.getCurrentSeatMap()
        });
    } catch (e) {
        res.status(404).send(e instanceof GameError? e.getMessage() : "Invalid Request");
    }
});

/**
 * The body json should look like this:
 * {
 *     "settings": {
 *         "职业": 该职业人数
 *     }
 * }
 */
router.post('/create-room', (req, res, next) => {
    try {
        let creatorId = req.session.id; // req.session.id 是房主id - unique
        let settings = JSON.parse(req.body["settings"]);
        if (!creatorId || !settings)
            throw new Error("Invalid request");
        let id = engine.newGame(creatorId, settings);
        res.status(200).redirect('/room/' + id);
    } catch (e) {
        res.status(404).send(e instanceof GameError? e.getMessage() : "Invalid Request");
    }
});

module.exports = router;