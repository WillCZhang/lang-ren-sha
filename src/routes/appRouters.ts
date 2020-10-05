import {Request, Response} from "express";
import * as fs from "fs";
import RoomManager from "../app/RoomManager";
import Room from "../app/room/Room";
import AppError from "../app/error/AppError";

const roomManager = new RoomManager();

const descriptions = JSON.parse(fs.readFileSync(__dirname + "/../appConfigs/descriptions.json").toString());

// TODO: add multi-language support

/* GET */

export const index = (req: any, res: any) => {
    res.render("index", {descriptions: descriptions});
};

export const rooms = (req: Request, res: Response) => {
    try {
        const roomId: string = req.params.id;
        const room: Room = roomManager.getRoom(roomId);
        const playerId = req.session.userId;
        res.render("room", {
            roomId: roomId,
            configuration: room.getGameConfigurationDisplayText(),
            isCreator: room.isCreator(playerId),
            playerCount: room.getRoomSize(),
            seatMap: room.getCurrentSeatStatus(),
            mySeatNumber: room.getSeatNumber(playerId)
        });
    } catch (e) {
        // res.status(404).send(e instanceof GameError ? e.getMessage() : "Invalid Request");
        res.status(404).render("error", {message: e instanceof AppError ? e.getMessage() : "Invalid Request"});
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
export const createRoom = (req: any, res: any) => {
    try {
        const creatorId = req.session.userId; // req.session.userId 是房主id - unique
        const settings = JSON.parse(req.body["settings"]);
        if (!creatorId || !settings) {
            throw new Error();
        }
        const id = roomManager.newRoom(creatorId, settings);

        // TODO: figure out how to handle this type of res from frontend then enable it
        // res.status(200).redirect("/rooms/" + id);
        res.json({code: 200, data: `/rooms/${id}`});
    } catch (e) {
        // res.status(400).send(e instanceof GameError ? e.getMessage() : "Invalid Request");
        res.json({code: 400, data: e instanceof AppError ? e.getMessage() : "Invalid Request"});
    }
};

/**
 * Body json format
 * {
 *     "roomId": id
 *     "seatNumber": number
 * }
 */
export const sitInRoom = (req: any, res: any) => {
    try {
        const roomId: string = req.body["roomId"];
        const playerId: string = req.session.userId;
        const seatNumber: number = parseInt(req.body["seatNumber"], 10);
        if (!roomId || !playerId || seatNumber < 0 || seatNumber > roomManager.getRoom(roomId).getRoomSize()) {
            throw new Error();
        }
        const room: Room = roomManager.getRoom(roomId);
        room.join(playerId, seatNumber);
        res.json({code: 200});
    } catch (e) {
        res.json({code: 400, data: e instanceof AppError ? e.getMessage() : "Invalid Request"});
    }
};

/**
 * Body json format
 * {
 *     "roomId": id
 * }
 */
export const leaveRoom = (req: any, res: any) => {
    try {
        const roomId: string = req.body["roomId"];
        const playerId: string = req.session.userId;
        if (!roomId || !playerId) {
            throw new Error();
        }
        const room: Room = roomManager.getRoom(roomId);
        if (room.isCreator(playerId)) {
            roomManager.deleteRoom(roomId);
            res.json({code: 200, data: "房间已解散"});
        } else {
            room.leave(playerId);
            res.json({code: 200, data: "退出房间"})
        }
    } catch (e) {
        res.json({code: 400, data: e instanceof AppError ? e.getMessage() : "Invalid Request"});
    }
};

/**
 * Body json format
 * {
 *     "roomId": id
 * }
 */
export const startGame = (req: any, res: any) => {
    try {
        const roomId: string = req.body["roomId"];
        const playerId: string = req.session.userId;
        if (!roomId || !playerId) {
            throw new Error();
        }
        const room: Room = roomManager.getRoom(roomId);
        room.start(playerId);
    } catch (e) {
        res.json({code: 400, data: e instanceof AppError ? e.getMessage() : "Invalid Request"});
    }
};
