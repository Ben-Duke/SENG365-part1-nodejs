const Venue = require('../models/venue.server.model');
const User = require('../models/user.server.model');
const bodyParser = require('body-parser');
var path = require('path');

exports.insert = async function (req, res) {

    //console.log(req);
    valid = "valid";

    userid = req.get("X-Authorization");
    if (userid != undefined) {
        User.checkAuth(userid, function (result) {
            if (result.user_auth != userid) {
                //console.log(result);
                //query = 'INSERT INTO Venue (`venue_id`, `admin_id`, `category_id`, `venue_name`, `city`, `short_description`, `long_description`, `date_added`, `address`, `latitude`, `longitude`) VALUES (?)';
                values = [
                    null,
                    result[0].user_id,
                    req.body.categoryId.toString(),
                    req.body.venueName.toString(),
                    req.body.city.toString(),
                    req.body.shortDescription.toString(),
                    req.body.longDescription.toString(),
                    "1990-09-09",
                    req.body.address.toString(),
                    req.body.latitude,
                    req.body.longitude,

                ]
                // (null,1,1,"Santa's Winter Palace","North Pole","The chillest place on earth.","Especially good in the summer months.","1990-09-09","1 North Pole",-45,0)
                for (i = 1; i < values.length; i++) {
                    // console.log("value is for values[i] " + values[i]);
                    // console.log("valid is " + valid);
                    if (values[i] == undefined) {
                        valid = "bad request";
                        console.log("valid is " + valid);
                    }
                }

                if (valid == "valid") {
                    try {
                        console.log("calling insert");
                        Venue.insertNewVenue(values, function (result) {
                            console.log(result);
                            console.log("added venue");
                            if (result[0].insertID != undefined) {
                                res.status(201);
                                res.json({ "venueId": result[0].venue_id });
                            } else {
                                res.status(404);
                                res.send("Unauthorized");
                            }
                        });
                    }
                    catch (err) {
                        console.log("Got an erorr");
                        console.log(err.toString());
                    }
                }
                else {
                    res.status(400);
                    res.send("Bad Request");
                }
            }
            else {
                res.status(401);
                res.send("Unauthorized");
            }
        });


    } else {
        res.status(400);
        res.send("Bad Request");
    }
}
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