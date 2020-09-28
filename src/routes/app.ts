import {Request, Response} from "express";
import * as fs from "fs";
import GameEngine from "../app/GameEngine.js";
import GameError from "../app/Error/GameError.js";

const engine = new GameEngine();

const descriptions = JSON.parse(fs.readFileSync(__dirname + "/../appConfigs/descriptions.json").toString());

// TODO: add multi-language support

/* GET */
export const index = (req: any, res: any) => {
    res.render("index", {descriptions: descriptions});
};

export const rooms = (req: Request, res: Response) => {
    try {
        const roomId = req.params.id;
        const game = engine.getGame(roomId);
        res.render("room", {
            playerCount: 10,
            seatMap: game.getCurrentSeatMap()
        });
    } catch (e) {
        res.status(404).send(e instanceof GameError ? e.getMessage() : "Invalid Request");
    }
};

/**
 * The body json should look like this:
 * {
 *     "settings": {
 *         "职业": 该职业人数
 *     }
 * }
 */
export const createRooms = (req: any, res: any) => {
    try {
        const creatorId = req.session.id; // req.session.id 是房主id - unique
        const settings = JSON.parse(req.body["settings"]);
        if (!creatorId || !settings) {
            throw new Error("Invalid request");
        }
        const id = engine.newGame(creatorId, settings);
        res.status(200).redirect("/room/" + id);
    } catch (e) {
        res.status(404).send(e instanceof GameError ? e.getMessage() : "Invalid Request");
    }
};
