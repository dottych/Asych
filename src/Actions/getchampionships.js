module.exports = (params, res) => {
    res.end(require('../Utils').response({
        
        return: "championships",
        found: 1,
        Name0: "Championship",
        ID0: 1

    }));

    // kinda stub
}