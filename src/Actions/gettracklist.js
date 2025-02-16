module.exports = (params, res) => {
    try {
    const db = require('../Database');

    let response = {

        return: "tracklist",
        awards: 0

    }

    let tracks;

    if (params.mine == "yes") {
        tracks = db.getNonActivatedTracksByUserId(params.u);
    } else {
        if (params.f != undefined) switch (+params.f) {
            // your tracks
            case 1:
                tracks = db.getActivatedTracksByUserId(params.u);
                break;

            // standard tracks
            case 2:
                tracks = [];

                for (let i = 1; i <= 7; i++)
                    tracks.push(db.getTrackById(i));

                break;

            // all tracks
            case 10:
            default:
                tracks = db.getActivatedTracks();
                break;
            
        }
    }

    response["found"] = tracks.length;

    let trackIndex = 0;
    for (let track of tracks) {
        response[`TN${trackIndex}`] = encodeURIComponent(track.trackName);
        response[`TID${trackIndex}`] = track.trackId;

        trackIndex++;
    }

    res.end(require('../Utils').response(response));
} catch (e) { console.log(e)}
}