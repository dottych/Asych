module.exports = (params, res) => {
    const db = require('../Database');

    const user = db.getUserById(params.u);
    const trackId = db.getTrackCount()+1;

    db.addTrack(
        
        trackId,
        decodeURIComponent(params.n),
        user.id,
        user.name,
        params.d
        
    );

    db.updateLastTrack(trackId);
    db.updateActivity(params.u);

    res.end(require('../Utils').response({
        
        return: "tracksaved",
        tid: trackId

    }));
}