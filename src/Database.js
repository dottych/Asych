class Database {
    constructor() {
        this.db = new (require('bun:sqlite')).Database("./database.db");

        this.db.exec("PRAGMA journal_mode = WAL;");

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
                activated integer,
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
                raceId integer,
                path text,
                pathCheck text
            );

            create table if not exists races (
                raceId integer primary key,
                raceName text,
                unixEnd integer,
                trackId integer,
                userId integer
            );
        `);
    }

    getUserCount() { return this.db.prepare(`select count(id) from users`).get()['count(id)']; }
    getTrackCount() { return this.db.prepare(`select count(trackId) from tracks`).get()['count(trackId)']; }
    getRaceCount() { return this.db.prepare(`select count(raceId) from races`).get()['count(raceId)']; }

    getUserById(id) { return this.db.prepare(`select * from users where id = ?;`).get(id); }
    getUserByName(name) { return this.db.prepare(`select * from users where name = ?;`).get(name); }

    getTrackById(id) { return this.db.prepare(`select * from tracks where trackId = ?;`).get(id); }
    getTracks() { return this.db.prepare(`select * from tracks;`).all(); }
    getActivatedTracks() { return this.db.prepare(`select * from tracks where activated = 1;`).all(); }
    getTracksByUserId(id) { return this.db.prepare(`select * from tracks where userId = ?;`).all(id); }
    getActivatedTracksByUserId(id) { return this.db.prepare(`select * from tracks where userId = ? and activated = 1;`).all(id); }
    getNonActivatedTracksByUserId(id) { return this.db.prepare(`select * from tracks where userId = ? and activated = 0;`).all(id); }

    getRecordsByTrackId(id) { return this.db.prepare(`select * from records where trackId = ?`).all(id); }
    getRandomRecordsByTrackId(id) {
        return this.db.prepare(`
            with top_half as (
                select * from records where trackId = ? order by timer asc limit (select count(trackId)/2 from records)
            ) select * from top_half order by random() limit 9;
        `).all(id); 
    }
    getTopRecordsByTrackId(id) {
        return [
            // all-time
            this.db.prepare(`select * from records where trackId = ? and timer > 0 order by timer asc limit 1;`).get(id),

            // monthly
            this.db.prepare(
                `select * from records where trackId = ? and timer > 0 and recordUnix > ? order by timer asc limit 1;`
            ).get(id, Date.now()-(1000*60*60*24*7*4)),

            // weekly
            this.db.prepare(
                `select * from records where trackId = ? and timer > 0 and recordUnix > ? order by timer asc limit 1;`
            ).get(id, Date.now()-(1000*60*60*24*7)),

            // daily
            this.db.prepare(
                `select * from records where trackId = ? and timer > 0 and recordUnix > ? order by timer asc limit 1;`
            ).get(id, Date.now()-(1000*60*60*24))
        ]
    }
    getRaceRecordsByTrackId(raceId, trackId) {
        return this.db.prepare(`select * from records where raceId = ? and trackId = ? order by timer asc;`).all(raceId, trackId);
    }

    getRaceById(id) { return this.db.prepare(`select * from races where raceId = ?;`).get(id) }
    getRaces() { return this.db.prepare(`select * from races;`).all(); }
    
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
                activated,
                trackUnix,
                data
            ) values (
                ?,
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
            0,
            Date.now(),
            data
        );
    }

    addActivatedTrack(trackId, trackName, userId, userName, data) {
        this.addTrack(trackId, trackName, userId, userName, data);
        this.activateTrack(trackId);
    }

    addRecord(trackId, userId, timer, hornTimer, chat, chatTimer, raceId, path, pathCheck) {
        this.db.prepare(`
            insert into records (
                trackId,
                userId,
                timer,
                hornTimer,
                chat,
                chatTimer,
                recordUnix,
                raceId,
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
                ?,
                ?
            );
        `).run(
            trackId, userId,
            timer, hornTimer,
            chat, chatTimer,
            Date.now(),
            raceId,
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

    activateTrack(trackId) {
        this.db.prepare(`
            update tracks set activated = 1 where trackId = ?;
        `).run(
            trackId
        );
    }

    createRace(raceId, raceName, trackId, userId, unixEnd) {
        this.db.prepare(`
            insert into races (
                raceId,
                raceName,
                unixEnd,
                trackId,
                userId
            ) values (
                ?,
                ?,
                ?,
                ?,
                ?
            );
        `).run(
            raceId, raceName,
            unixEnd,
            trackId,
            userId
        );
    }
}

module.exports = new Database();