module.exports = (params, res) => {
    const db = require('../Database');

    let trackId = params.tid;

    const trackCount = db.getTrackCount();

    if (trackId == "undefined") {
        trackId = Math.floor(Math.random() * trackCount) + 1;
    }

    if (trackId == "0")
        trackId = db.getUserById(params.u).lastTrackId;
    
    let track = db.getTrackById(trackId);

    while (track.activated == 0) {
        // gm 2 is edit mode
        if (params.gm == "2" && track.userId == params.u)
            break;

        if (params.tid != "undefined") {
            res.end(require('../Utils').response({ error: "Tried to get an unactivated track in race mode - not yours." }));
            return;
        }

        trackId = Math.floor(Math.random() * trackCount) + 1;
        track = db.getTrackById(trackId);
    }

    let response = {
                
        return: "trackdata",
        trackfound: "true",

        TrackData: track.data,

        TrackId: track.trackId,
        TrackName: encodeURIComponent(track.trackName),

        CreatedBy: track.userId,
        UserName: encodeURIComponent(track.userName),

        FunRating: 0, // stars
        Ratings: 0, // fun vote count
        DifficultyRating: 0,
        DiffAmount: 0, // diff vote count
        YourFunRating: 0,
        YourDifficultyRating: 0,

        Activated: track.activated,

        // preview
        p: params.p == "1" ? "True" : "False",

        // awards: 1,
        // A_T: 1,
        // A_UN0: "Best Racer",
        // A_RT0: 100,

        found: 0 // how many replays

    }

    const records = db.getRandomRecordsByTrackId(track.trackId);

    if (records.length > 0) response.found = records.length;

    let recordIndex = 0;
    for (let record of records) {
        const recordUser = db.getUserById(record.userId);

        response[`UN${recordIndex}`] = recordUser.name;
        response[`P${recordIndex}`] = record.path;
        response[`C${recordIndex}`] = recordUser.carType;
        response[`C1${recordIndex}`] = recordUser.carColour1;
        response[`C2${recordIndex}`] = recordUser.carColour2;
        response[`RT${recordIndex}`] = record.timer;
        response[`UID${recordIndex}`] = record.userId;
        response[`H${recordIndex}`] = record.hornTimer;
        response[`CS${recordIndex}`] = recordUser.carStyle;

        if (record.chat != "")
            response[`Ch${recordIndex}`] = `${record.chat}<>${record.chatTimer}<>`;
        else
            response[`Ch${recordIndex}`] = "";

        response[`HS${recordIndex}`] = recordUser.hornType;

        if (record.pathCheck != undefined)
            response[`PC${recordIndex}`] = record.pathCheck;
        else
            response[`PC${recordIndex}`] = "";

        recordIndex++;
    }

    db.updateLastTrack(params.u, track.trackId);
    db.updateActivity(params.u);
    res.end(require('../Utils').response(response));
}