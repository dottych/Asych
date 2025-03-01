module.exports = (params, res) => {
    let response = {

        return: "foundraces",
        found: 0

    }

    const db = require('../Database');

    const races = db.getRaces();

    let raceIndex = 0;
    for (let race of races) {
        response.found++;

        response["RaceID"+raceIndex] = race.raceId;
        response["RaceName"+raceIndex] = race.raceName;
        response["RaceOver"+raceIndex] = Date.now() > race.unixEnd ? 1 : 0;
        response["Old"+raceIndex] = 1;

        raceIndex++;
    }

    res.end(require('../Utils').response(response));
}