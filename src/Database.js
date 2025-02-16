class Database {
    constructor() {
        this.db = new require('better-sqlite3')("./database.db");

        this.db.pragma('journal_mode = WAL');

        this.db.exec(`
            create table if not exists users (
                id integer primary key,
                name text,
                score integer,
                money integer,
                banned integer,
                level integer,
                lastTrackId integer,
                activityUnix integer,
                carType integer,
                carStyle integer,
                carColour1 text,
                carColour2 text,
                hornType integer
            );

            create table if not exists tracks (
                trackId integer primary key,
                trackName text,
                userId integer,
                userName text,
                trackUnix integer,
                data text
            );

            create table if not exists records (
                trackId integer,
                userId integer,
                timer integer,
                hornTimer integer,
                chat text,
                chatTimer integer,
                recordUnix integer,
                path text,
                pathCheck text
            );
        `);
    }

    getUserCount() { return this.db.prepare(`select count(id) from users`).get()['count(id)']; }
    getTrackCount() { return this.db.prepare(`select count(trackId) from tracks`).get()['count(trackId)']; }

    getUserById(id) { return this.db.prepare(`select * from users where id = ?;`).get(id); }
    getUserByName(name) { return this.db.prepare(`select * from users where name = ?;`).get(name); }

    getTrackById(id) { return this.db.prepare(`select * from tracks where trackId = ?;`).get(id); }

    getRecordsByTrackId(id) { return this.db.prepare(`select * from records where trackId = ?;`).all(id); }
    
    addUser(id, name, carStyle, carColour1, carColour2) {
        this.db.prepare(`
            insert or replace into users (
                id,
                name,
                score,
                money,
                banned,
                level,
                lastTrackId,
                activityUnix,
                carType,
                carStyle,
                carColour1,
                carColour2,
                hornType
            ) values (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            );
        `).run(
            id, name,
            require('./Config').defaultScore,
            require('./Config').defaultMoney,
            0, 0, 0,
            Date.now(),
            0, carStyle,
            carColour1, carColour2,
            0
        );
    }
    
    addTrack(trackId, trackName, userId, userName, data) {
        this.db.prepare(`
            insert or replace into tracks (
                trackId,
                trackName,
                userId,
                userName,
                trackUnix,
                data
            ) values (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            );
        `).run(
            trackId, trackName,
            userId, userName,
            Date.now(),
            data
        );
    }

    addRecord(trackId, userId, timer, hornTimer, chat, chatTimer, path, pathCheck) {
        this.db.prepare(`
            insert into records (
                trackId,
                userId,
                timer,
                hornTimer,
                chat,
                chatTimer,
                recordUnix,
                path,
                pathCheck
            ) values (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            );
        `).run(
            trackId, userId,
            timer, hornTimer,
            chat, chatTimer,
            Date.now(),
            path, pathCheck
        );
    }

    updateActivity(id) {
        this.db.prepare(`
            update users set activityUnix = ? where id = ?;
        `).run(
            Date.now(), id
        );
    }

    updateCar(id, carType, carStyle, carColour1, carColour2, hornType) {
        this.db.prepare(`
            update users
            set carType = ?, carStyle = ?,
            carColour1 = ?, carColour2 = ?,
            hornType = ?
            where id = ?;
        `).run(
            carType, carStyle,
            carColour1, carColour2,
            hornType,
            id
        );
    }

    updateScore(id, score) {
        this.db.prepare(`
            update users set score = ? where id = ?;
        `).run(
            score, id
        );
    }

    updateMoney(id, money) {
        this.db.prepare(`
            update users set money = ? where id = ?;
        `).run(
            money, id
        );
    }

    updateLastTrack(userId, trackId) {
        this.db.prepare(`
            update users set lastTrackId = ? where id = ?;
        `).run(
            trackId, userId
        );
    }
}

module.exports = new Database();