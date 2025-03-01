module.exports = (params, res) => {
    const db = require('../Database');
    const raceId = db.getRaceCount()+1;

    let unixEnd = Date.now();

    switch (+params.d) {
        case 0: // 1 day
            unixEnd += 1000 * 60 * 60 * 24;
            break;

        case 1: // 3 days
            unixEnd += 1000 * 60 * 60 * 24 * 3;
            break;

        case 2: // 1 week
            unixEnd += 1000 * 60 * 60 * 24 * 7;
            break;

        case 3: // 2 weeks
            unixEnd += 1000 * 60 * 60 * 24 * 7 * 2;
            break;

        case 4: // 1 month
            unixEnd += 1000 * 60 * 60 * 24 * 7 * 4;
            break;

        case 5: // 3 month
            unixEnd += 1000 * 60 * 60 * 24 * 7 * 4 * 3;
            break;
    }

    db.createRace(raceId, decodeURIComponent(params.n), params.t, params.u, unixEnd);

    res.end(require('../Utils').response({
        
        return: "racecreated",
        raceid: raceId

    }));
}