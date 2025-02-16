module.exports = (params, res) => {
    const db = require('../Database');

    let user = db.getUserByName(decodeURIComponent(params.dn));

    if (user == undefined) {
        const newId = db.getUserCount()+1;
        db.addUser(newId, decodeURIComponent(params.dn), params.cs, params.c1, params.c2);
        user = db.getUserById(newId);
    }

    res.end(require('../Utils').response({
        
        return: "loginok",
        uid: user.id,
        u: user.name,
        c: user.carType,
        cs: user.carStyle,
        c1: user.carColour1,
        c2: user.carColour2,
        h: user.hornType,
        s: user.score, // XP
        m: user.money, // track credits
        i: 0, // invites
        b: user.banned,
        ul: user.level, // something to do with moderation?
        new: "False", // new to game, only useful for og stats tracking
        G_F: 0 // don't know, facebook related perhaps? a counter

    }));
}