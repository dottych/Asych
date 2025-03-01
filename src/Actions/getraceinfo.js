module.exports = (params, res) => {
    // comments in game don't work for some reason so it's not really needed rn

    const db = require('../Database');

    const race = db.getRaceById(params.r);
    const track = db.getTrackById(race.trackId);

    let response = {

        return: "race",

        RaceName: encodeURIComponent(race.raceName),
        CreatedBy: encodeURIComponent(db.getUserById(race.userId).name),

        Track: encodeURIComponent(track.trackName),
        TrackBy: encodeURIComponent(track.userName),

        RaceOver: Date.now() > race.unixEnd ? 1 : 0,
        TimeLeft: "",

        new: 0,

        standingsfound: 0,
        commentsfound: 0

    }

    const records = db.getRaceRecordsByTrackId(params.r, race.trackId);

    // TODO: make all of this shorter?

    let recordIndex = 0;
    // winners
    for (let record of records) {
        if (record.timer < 0) continue;

        response.standingsfound++;

        const recordUser = db.getUserById(record.userId);

        response["SU"+recordIndex] = encodeURIComponent(recordUser.name);
        response["ST"+recordIndex] = record.timer;
        response["FBID"+recordIndex] = "";
        response["Cr"+recordIndex] = recordUser.carType;
        response["CS"+recordIndex] = recordUser.carStyle;
        response["C1"+recordIndex] = recordUser.carColour1;
        response["C2"+recordIndex] = recordUser.carColour2;

        recordIndex++;
    }

    // DNF
    for (let record of records) {
        if (record.timer >= 0) continue;
        
        response.standingsfound++;

        const recordUser = db.getUserById(record.userId);

        response["SU"+recordIndex] = encodeURIComponent(recordUser.name);
        response["ST"+recordIndex] = record.timer;
        response["FBID"+recordIndex] = "";
        response["Cr"+recordIndex] = recordUser.carType;
        response["CS"+recordIndex] = recordUser.carStyle;
        response["C1"+recordIndex] = recordUser.carColour1;
        response["C2"+recordIndex] = recordUser.carColour2;

        recordIndex++;
    }

    if (race.unixEnd - Date.now() < 1000 * 60) {
        response.TimeLeft = `${Math.round((race.unixEnd - Date.now()) / 1000)} seconds`;
    } else
    if (race.unixEnd - Date.now() < 1000 * 60 * 60) {
        response.TimeLeft = `${Math.round((race.unixEnd - Date.now()) / 1000 / 60)} minutes`;
    } else
    if (race.unixEnd - Date.now() < 1000 * 60 * 60 * 24) {
        response.TimeLeft = `${Math.round((race.unixEnd - Date.now()) / 1000 / 60 / 60)} hours`;
    } else
    if (race.unixEnd - Date.now() < 1000 * 60 * 60 * 24 * 7) {
        response.TimeLeft = `${Math.round((race.unixEnd - Date.now()) / 1000 / 60 / 60 / 24)} days`;
    } else
    if (race.unixEnd - Date.now() < 1000 * 60 * 60 * 24 * 7 * 4) {
        response.TimeLeft = `${Math.round((race.unixEnd - Date.now()) / 1000 / 60 / 60 / 24 / 7)} weeks`;
    } else
    if (race.unixEnd - Date.now() < 1000 * 60 * 60 * 24 * 7 * 4 * 12) {
        response.TimeLeft = `${Math.round((race.unixEnd - Date.now()) / 1000 / 60 / 60 / 24 / 7 / 4)} months`;
    }

    res.end(require('../Utils').response(response));
}