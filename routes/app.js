let express = require('express');
let router = express.Router();
let GameEngine = require('../app/gameEngine');
let engine = new GameEngine();

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
        // req.session.id 是房主id - unique
        engine.newGame(req.session.id, JSON.parse(req.body["settings"]));
        res.status(200).redirect('/room');
    } catch (e) {
        res.status(404).send(e.message);
    }
});

module.exports = router;