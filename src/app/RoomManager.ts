import * as fs from "fs";
import path from "path";
import Room from "./Room";
import Log from "./util/Logger";
import {RoomExpireError, RoomNotFoundError, TooManyRoomsError} from "./error/RoomError";

const cachePath = path.join(__dirname, "../data");
const cacheFile = path.join(cachePath, "cache.json");
const cacheBackup = path.join(cachePath, "cache-backup.json");

const MAX_ID_LENGTH = 8;
const MAX_GAME_ID = 100000000;
const GARBAGE_COLLECTION_THRESHOLD = MAX_GAME_ID / 2;

/**
 * GameEngine is the entry point of the app. The caller, the controller in this case,
 * should perform validation before invoke the Engine.
 */
export default class RoomManager {
    private readonly rooms: { [key: string]: Room };
    private isSaving: boolean;
    private isGarbageCollecting: boolean;

    constructor() {
        this.rooms = RoomManager.loadRooms();
        this.saveRooms();
        this.removeExpiredRooms();
    }

    /**
     * This should create a new room in the system, and generate a unique {@code MAX_ID_LENGTH}-digit room ID
     * for users to join the room.
     * @param creator
     * @param settings TODO: needs interface
     * @return string id
     */
    public newRoom(creator: string, settings: any) {
        const id: string = this.generateRoomId();
        this.rooms[id] = new Room(creator, settings);
        this.saveRooms();
        return id;
    }

    /**
     *
     * @param id
     * @return Room the room
     */
    public getRoom(id: string) {
        const room: Room = this.rooms[id];
        if (!room) {
            throw new RoomNotFoundError();
        } else if (room.isRoomExpired()) {
            delete this.rooms[id];
            throw new RoomExpireError();
        }
        this.saveRooms();
        return room;
    }

    public deleteRoom(id: string) {
        delete this.rooms[id];
        this.saveRooms();
    }

    private generateRoomId() {
        if (Object.keys(this.rooms).length > GARBAGE_COLLECTION_THRESHOLD) {
            this.removeExpiredRooms();
        }

        if (Object.keys(this.rooms).length > MAX_GAME_ID) {
            throw new TooManyRoomsError();
        }

        let id = Math.floor(Math.random() * MAX_GAME_ID).toString();
        while (Object.keys(this.rooms).includes(id)) {
            // TODO: should probably add a cool-down period in the controller if we'are hacked
            id = Math.floor(Math.random() * MAX_GAME_ID).toString();
        }

        if (id.length < MAX_ID_LENGTH) {
            id = "0".repeat(MAX_ID_LENGTH - id.length) + id;
        }

        return id;
    }

    /***
     * Thread-safe & recoverable save
     * @private
     */
    private saveRooms() {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        if (fs.existsSync(cacheFile)) {
            fs.renameSync(cacheFile, cacheBackup);
        }
        // should be async to reduce latency
        fs.writeFile(cacheFile, JSON.stringify(this.rooms), (err: any) => {
            if (fs.existsSync(cacheBackup)) {
                fs.unlinkSync(cacheBackup);
            }
            this.isSaving = false;
            if (err) {
                throw err;
            }
        });
    }

    /***
     * recoverable load - should run once only
     * @private
     */
    private static loadRooms() {
        try {
            if (fs.existsSync(cacheBackup)) {
                fs.unlinkSync(cacheFile);
                fs.renameSync(cacheBackup, cacheFile);
            }
            const unParsedObjects = JSON.parse(fs.readFileSync(cacheFile).toString());
            Object.keys(unParsedObjects).forEach(key => Object.setPrototypeOf(unParsedObjects[key], Room.prototype));
            return unParsedObjects;
        } catch (e) {
            fs.mkdir(cachePath, (err: any) => {
                /* very likely the dir exists, do nothing, other errs will cause error when saving */
            });
            return {};
        }
    }

    private removeExpiredRooms(): Promise<number> {
        if (this.isGarbageCollecting) {
            return Promise.reject();
        }
        this.isGarbageCollecting = true;
        return new Promise((fulfill, reject) => {
            let counter = 0;
            for (const id of Object.keys(this.rooms)) {
                try {
                    this.getRoom(id);
                } catch (e) {
                    counter++;
                }
            }
            this.isGarbageCollecting = false;
            Log.info(`removed ${counter} expired rooms`);
            fulfill(counter);
        });
    }
}
