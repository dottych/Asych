module.exports = (params, res) => {
    const db = require('../Database');

    const user = db.getUserById(params.u);

    const newMoney = user.money - +params.v; // unsafe, game...
    db.updateMoney(user.id, newMoney);

    db.activateTrack(params.t == "0" ? user.lastTrackId : params.t);
    db.updateActivity(params.u);

    res.end(require('../Utils').response({
        
        return: "activatedtrack",
        Money: newMoney

    }));
}