module.exports = (params, res) => {
    let response = {

        return: "tracklist",
        found: 0

    }

    res.end(require('../Utils').response(response));
}