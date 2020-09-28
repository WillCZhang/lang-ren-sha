import {Request, Response} from "express";
import * as fs from "fs";
import GameEngine from "../app/GameEngine";
import GameError from "../app/Error/GameError.js";
import Game from "../app/Game";

const engine = new GameEngine();

const SESSION_EXPIRE_TIME = 100000 * 1000; // TODO: this is a temp fix until session bug is fix

const descriptions = JSON.parse(fs.readFileSync(__dirname + "/../appConfigs/descriptions.json").toString());

// TODO: add multi-language support

/* GET */

export const index = (req: any, res: any) => {
    // TODO: 这里有个bug，为啥每次request session id会刷新呢？？？
    // 这是个暂时解决方案，强行存起来，但是还是要fix
    req.session.userId = req.session.id;
    req.session.createTime = Date.now();

    res.render("index", {descriptions: descriptions});
};

export const rooms = (req: Request, res: Response) => {
    try {
        const roomId: string = req.params.id;
        const game: Game = engine.getGame(roomId);
        // const playerId: string = req.session.id; // TODO
        const playerId = req.session.userId;
        res.render("room", {
            roomId: roomId,
            configuration: game.getRoomConfiguration(),
            isCreator: game.isCreator(playerId),
            playerCount: game.getPlayerCount(),
            seatMap: game.getCurrentSeatMap(),
            mySeatNumber: game.getSeatNumber(playerId) === undefined? -1 : game.getSeatNumber(playerId)
        });
    } catch (e) {
        // res.status(404).send(e instanceof GameError ? e.getMessage() : "Invalid Request");
        res.json({code: 400, data: e instanceof GameError ? e.getMessage() : "Invalid Request"});
    }
};

/* POST */

/**
 * Body json format
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
            throw new Error();
        }
        const id = engine.newGame(creatorId, settings);

        // TODO: figure out how to handle this type of res from frontend then enable it
        // res.status(200).redirect("/rooms/" + id);
        res.json({code: 200, data: `/rooms/${id}`});
    } catch (e) {
        // res.status(400).send(e instanceof GameError ? e.getMessage() : "Invalid Request");
        res.json({code: 400, data: e instanceof GameError ? e.getMessage() : "Invalid Request"});
    }
};

/**
 * Body json format
 * {
 *     "roomId": id
 *     "seatNumber": number
 * }
 */
export const sit = (req: any, res: any) => {
    try {
        const roomId: string = req.body["roomId"];
        // const playerId: string = req.session.id; // TODO
        const playerId = req.session.userId;
        if (Date.now() - req.session.createTime > SESSION_EXPIRE_TIME) {
            throw new Error();
        }
        const seatNumber: number = parseInt(req.body["seatNumber"]);
        if (!roomId || !playerId || seatNumber < 0 || seatNumber > engine.getGame(roomId).getPlayerCount()) {
            throw new Error();
        }
        const game: Game = engine.getGame(roomId);
        const joined: boolean = game.join(playerId, seatNumber);
        if (joined) {
            res.json({code: 200});
        } else {
            throw new GameError("座位已经被人抢啦，请换个座位试一试~");
        }
    } catch (e) {
        res.json({code: 400, data: e instanceof GameError ? e.getMessage() : "Invalid Request"});
    }
};
