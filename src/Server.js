const config = require('./Config');
const utils = require('./Utils');
const db = require('./Database');

const express = require('express');
const path = require('path');
const cors = require('cors');

const routes = express.Router();
const app = express();

app.use(cors({ origin: 'null' }));

app.use(express.urlencoded());
app.use(express.json());

routes.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/index.html");
});

routes.post(config.dataProcUrl, (req, res) => {
    const params = utils.splitRequest(utils.decrypt(req.body.acr));

    console.log(params);

    try {
        require("./Actions/" + params.action)(params, res);
    } catch (e) {
        res.end(utils.response({
            error: "Sorry, but this feature is not yet implemented in Asych. (or something broke)"
        }));
    }
});

app.listen(config.port, () => {
    utils.log(`Asych << ${config.port}`);
});

app.use('/', routes);

app.use(express.static(path.join(__dirname, "../static")));

require('./DefaultTracks')();