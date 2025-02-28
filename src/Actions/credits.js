module.exports = (params, res) => {
    res.end(require('../Utils').response({
        
        return: "credits",
        found: 1,

        T0: 1,
        U0: "Ben Olding",
        ID0: 0

    }));

    // kinda a stub
}