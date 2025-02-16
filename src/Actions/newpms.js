module.exports = (params, res) => {
    // stub
    res.end(require('../Utils').response({
        
        return: "newpms",
        i: 0, // invites
        n: 0, // new PMs count
        b: 0 // banned

    }));
}