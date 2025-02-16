module.exports = (params, res) => {
    const db = require('../Database');

    let user = db.getUserById(params.uid);

    const newScore = user.score + +params.s; // unsafe, game...
    const newMoney = user.money + +params.s * 20;

    db.updateScore(user.id, newScore);
    db.updateMoney(user.id, newMoney);

    const chat = params.c == "" || params.c == undefined ? ["", ""] : params.c.split('<');

    // uses last track ID from database, because game doesn't carry its current track ID...???
    db.addRecord(
        
        user.lastTrackId, params.uid,
        params.t, params.h,
        chat[0], chat[1].replace('>', ""),
        params.p, params.rpc
        
    );

    db.updateActivity(params.uid);

    res.end(require('../Utils').response({
        
        return: "racepathsaved",
        score: newScore,
        Money: newMoney

    }));
}