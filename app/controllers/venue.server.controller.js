const Venue = require('../models/venue.server.model');
const bodyParser = require('body-parser');
var path = require('path');



exports.list = function (req, res) {
    Venue.getCats(function (result) {
        console.log(result);
        res.status(200);
        res.json(result);
    })
};