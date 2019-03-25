const Venue = require('../models/venue.server.model');
const bodyParser = require('body-parser');
var path = require('path');



exports.list = function (req, res) {
    Venue.getCats(function (result) {
        console.log(result);
        out = [];
        //console.log(result.length);
        for (i = 0; i < result.length; i++) {
            console.log(result[i].category_id);
            out.push({
                "categoryId": result[i].category_id,
                "categoryName": result[i].category_name,
                "categoryDescription": result[i].category_description
            });
        }

        res.status(200);
        res.json(out);
    })
};