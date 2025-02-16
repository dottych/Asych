module.exports = (params, res) => {
    const db = require('../Database');

    db.updateCar(params.uid, params.cs, params.s, params.c1, params.c2, params.h);
    db.updateActivity(params.uid);

    res.end(require('../Utils').response({
        
        return: "driversaved"

    }));
    
    // literally all the game needs
}